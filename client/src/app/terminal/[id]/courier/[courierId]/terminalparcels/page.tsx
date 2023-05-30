"use client";

import {
  ParcelDetails,
  ParcelDetailsForTerminal,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import {
  detailsGetByTerminalId,
  detailsGetOne,
  ship,
} from "colorblind/shared/requests/parcels";
import { notFound } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import styles from "colorblind/shared/styles/littleForms.module.scss";
import { Button, Card, Col, List, Modal, Row } from "antd";

interface Props {
  params: {
    id: string;
    courierId: string;
  };
}

export default function TerminalParcels({ params: { id, courierId } }: Props) {
  const [parcels, setParcels] = useState<ParcelDetailsForTerminal[]>([]);
  const [error, setError] = useState<string>();

  const [selectedParcel, setSelectedParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();

  useEffect(() => {
    const initParcels = async () => {
      const response = await detailsGetByTerminalId(id);
      if (response.status !== StatusCodes.OK) {
        notFound();
      }

      const parcels = await response.json();
      setParcels(parcels);
    };

    initParcels();
  }, [id]);

  const onShip: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (error || !selectedParcel) return;
    const response = await ship(
      selectedParcel.code,
      courierId,
      selectedParcel.version
    );
    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      setError(problem.detail);
      return;
    }

    const { lockerNumber } = (await response.json()) as {
      lockerNumber: number;
    };

    setLockerNumber(lockerNumber);
  };

  const onSelect: MouseEventHandler = async (e) => {
    const parcelResponse = await detailsGetOne(e.currentTarget.id);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      setError(problem.detail);
      return;
    }

    const parcel = (await parcelResponse.json()) as ParcelDetails;

    setSelectedParcel(parcel);
  };

  const onDone: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!lockerNumber) return;

    const response = await detailsGetByTerminalId(id);
    if (response.status !== StatusCodes.OK) {
      notFound();
    }

    const parcels = await response.json();
    setParcels(parcels);
    setLockerNumber(undefined);
    setSelectedParcel(undefined);
  };

  if (parcels.length === 0) {
    return (
      <div className={styles.info}>
        <h1>No parcels in terminal</h1>
      </div>
    );
  }

  const SelectedComponent = () => {
    return (
      <Modal
        centered
        open={!!selectedParcel}
        onCancel={() => setSelectedParcel(undefined)}
        footer={
          <Row justify={"space-evenly"}>
            <Button key={"ship"} className={styles.bigButton} onClick={onShip}>
              Ship
            </Button>
            <Button
              disabled={!lockerNumber}
              key={"confirm"}
              className={styles.bigButton}
              onClick={onDone}
            >
              Confirm shipment
            </Button>
          </Row>
        }
      >
        <Row justify={"center"}>
          <span className={styles.selection}>Order selected</span>
        </Row>
        {lockerNumber && (
          <Row justify={"center"}>
            <span>Locker {lockerNumber} opened.</span>
          </Row>
        )}
        <Row justify={"center"}>
          <span>{selectedParcel?.id}</span>
        </Row>
      </Modal>
    );
  };

  return (
    <>
      <SelectedComponent />
      <Row>
        <Col className={styles.terminalCatalogue}>
          <Row justify={"center"}>
            <span className={styles.title}>Parcels in terminal</span>
          </Row>
          <List
            grid={{
              gutter: 16,
              column: 2,
            }}
            pagination={{
              pageSize: 4,
              onChange: (page) => {
                console.log(page);
              },
            }}
            dataSource={parcels}
            renderItem={(parcel) => (
              <List.Item>
                <Card
                  title={
                    <Row justify={"center"}>
                      <span>Parcel</span>
                    </Row>
                  }
                  onClick={onSelect}
                  className={styles.clickableCard}
                  bodyStyle={{ padding: "10px" }}
                  id={parcel.id}
                  hoverable
                >
                  <Row justify={"center"}>
                    <span>To: {parcel.deliveryTerminalAddress}</span>
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
