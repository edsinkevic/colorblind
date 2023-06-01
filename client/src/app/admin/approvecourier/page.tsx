"use client";

import {
  Courier,
  GetUnapprovedCouriersResponse,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { MouseEventHandler, useEffect, useState } from "react";
import styles from "colorblind/shared/styles/littleForms.module.scss";
import { Button, Card, Col, List, Modal, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";
import { approve, listUnapproved } from "colorblind/shared/requests/couriers";

interface Props {
  params: {
    id: string;
    courierId: string;
  };
}

const pageSize = 4;

export default function TerminalParcels({ params: { id, courierId } }: Props) {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<Courier>();
  const [notificationApi, notificationContext] = useNotification();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const initCouriers = async () => {
      const response = await listUnapproved(1, 100);
      if (response.status !== StatusCodes.OK) {
        defaultError(notificationApi, await response.json());
        return;
      }

      const body = (await response.json()) as GetUnapprovedCouriersResponse;
      setCouriers(body);
    };

    initCouriers();
  }, [id, notificationApi]);

  const onSelect: MouseEventHandler = async (e) => {
    setSelectedCourier(couriers[e.currentTarget.id as unknown as number]);
  };

  const onApprove: MouseEventHandler = async (e) => {
    if (!selectedCourier) {
      return;
    }

    const response = await approve(selectedCourier.id, selectedCourier.version);
    if (response.status !== StatusCodes.OK) {
      defaultError(notificationApi, await response.json());
      return;
    }

    notificationApi.success({
      message: "Courier was approved!",
      placement: "top",
      duration: 3,
    });
    setSelectedCourier(undefined)
    return;
  };

  if (couriers.length === 0) {
    return (
      <div className={styles.info}>
        <h1>No unapproved couriers</h1>
      </div>
    );
  }

  const SelectedComponent = (
    <Modal
      centered
      open={!!selectedCourier}
      onCancel={() => setSelectedCourier(undefined)}
      footer={
        <Row justify={"space-evenly"}>
          <Button
            key={"Approve"}
            className={styles.bigButton}
            onClick={onApprove}
          >
            Approve
          </Button>
        </Row>
      }
    >
      <Row justify={"center"}>
        <span className={styles.selection}>Selected courier</span>
      </Row>
      <Row justify={"center"}>
        <span>{selectedCourier?.id}</span>
      </Row>
      <Row justify={"center"}>
        <span>{selectedCourier?.name}</span>
      </Row>
    </Modal>
  );

  console.log(pageNumber)

  return (
    <>
      {SelectedComponent}
      {notificationContext}
      <Row>
        <Col className={styles.terminalCatalogue}>
          <Row justify={"center"}>
            <span className={styles.title}>Unapproved couriers</span>
          </Row>
          <List
            className={styles.list}
            grid={{
              gutter: 16,
              column: 2,
            }}
            pagination={{
              position: "top",
              onChange: (page) => setPageNumber(page),
              pageSize,
            }}
            dataSource={couriers}
            renderItem={(courier, idx) => (
              <List.Item>
                <Card
                  title={courier.id}
                  onClick={onSelect}
                  className={styles.clickableCard}
                  bodyStyle={{ padding: "10px" }}
                  headStyle={{ textAlign: "center" }}
                  id={((pageNumber - 1) * pageSize + idx).toString()}
                  hoverable
                >
                  <Row justify={"center"}>
                    <span>Name: {courier.name}</span>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}
