"use client";

import {
  DeliverResponse,
  ParcelDetails,
  ParcelDetailsForTerminal,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import {
  deliver,
  detailsGetByCourierIdForTerminal,
  detailsGetOne,
} from "colorblind/shared/requests/parcels";
import { notFound, useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import styles from "colorblind/shared/styles/littleForms.module.scss";

import { Button, Card, Col, List, Modal, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";
import { getAuth } from "colorblind/shared/lib/state";

interface Props {
  params: {
    id: string;
  };
}

export default function CourierParcels({ params: { id } }: Props) {
  const [parcels, setParcels] = useState<ParcelDetailsForTerminal[]>([]);
  const [notificationApi, notificationContext] = useNotification();
  const [selectedParcel, setSelectedParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const [session, setSession] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const initParcels = async () => {
      const sessionFromStorage = getAuth();
      if (!sessionFromStorage) {
        router.replace(`/terminal/${id}/courier`);
        return;
      }

      setSession(sessionFromStorage);

      const response = await detailsGetByCourierIdForTerminal(session, id);

      if (response.status === StatusCodes.FORBIDDEN) {
        router.replace(`/terminal/${id}/courier`);
        return;
      }

      if (response.status !== StatusCodes.OK) {
        notFound();
      }

      const parcels = await response.json();
      setParcels(parcels);
    };

    initParcels();
  }, [id, router, session]);

  const onDeliver: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!selectedParcel) return;
    const response = await deliver(
      selectedParcel.code,
      id,
      selectedParcel.version
    );
    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      defaultError(notificationApi, problem);
      return;
    }

    const { lockerNumber } = (await response.json()) as DeliverResponse;
    setLockerNumber(lockerNumber);
  };

  const onSelect: MouseEventHandler = async (e) => {
    e.preventDefault();
    const parcelResponse = await detailsGetOne(e.currentTarget.id);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      defaultError(notificationApi, problem);
      return;
    }

    const parcel = (await parcelResponse.json()) as ParcelDetails;

    setSelectedParcel(parcel);
  };

  const onDone: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!lockerNumber) return;

    const response = await detailsGetByCourierIdForTerminal(session!, id);
    if (response.status !== StatusCodes.OK) {
      defaultError(notificationApi, await response.json());
      return;
    }

    const parcels = await response.json();
    setParcels(parcels);
    setLockerNumber(undefined);
    setSelectedParcel(undefined);
  };

  const SelectedComponent = (
    <Modal
      centered
      open={!!selectedParcel}
      onCancel={() => setSelectedParcel(undefined)}
      footer={
        <Row justify={"space-evenly"}>
          <Button
            key={"deliver"}
            className={styles.bigButton}
            onClick={onDeliver}
          >
            Deliver
          </Button>
          <Button
            disabled={!lockerNumber}
            key={"confirm"}
            className={styles.bigButton}
            onClick={onDone}
          >
            Confirm delivery
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

  if (parcels.length === 0) {
    return (
      <div className={styles.info}>
        <h1>No parcels to deliver</h1>
      </div>
    );
  }

  return (
    <>
      {SelectedComponent}
      {notificationContext}
      <Row>
        <Col className={styles.terminalCatalogue}>
          <Row justify={"center"}>
            <span className={styles.title}>Your deliverable parcels</span>
          </Row>
          <List
            grid={{
              gutter: 16,
              column: 2,
            }}
            pagination={{
              pageSize: 4,
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
                ></Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}
