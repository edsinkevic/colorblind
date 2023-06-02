"use client";

import {
  GetShippableParcelInTerminalResponse,
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
import { MouseEventHandler, useEffect, useState } from "react";
import styles from "colorblind/shared/styles/littleForms.module.scss";
import { Button, Card, Col, List, Modal, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";
import { getAuth } from "colorblind/shared/lib/state";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function TerminalParcels({ params: { id } }: Props) {
  const [parcels, setParcels] = useState<ParcelDetailsForTerminal[]>([]);
  const [notificationApi, notificationContext] = useNotification();

  const [selectedParcel, setSelectedParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const router = useRouter();
  const [session, setSession] = useState<string>();

  useEffect(() => {
    const initParcels = async () => {
      const sessionFromStorage = getAuth();
      if (!sessionFromStorage) {
        router.replace(`/terminal/${id}/courier`);
        return;
      }

      setSession(sessionFromStorage);

      const response = await detailsGetByTerminalId(id, sessionFromStorage);
      if (response.status !== StatusCodes.OK) {
        defaultError(notificationApi, await response.json());
        return;
      }

      const body =
        (await response.json()) as GetShippableParcelInTerminalResponse;
      setParcels(body.parcels);
    };

    initParcels();
  }, [id, notificationApi, router, session]);

  const onShip: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!selectedParcel) return;
    const response = await ship(
      selectedParcel.code,
      selectedParcel.version,
      session!
    );

    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      defaultError(notificationApi, problem);
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
      defaultError(notificationApi, problem);
      return;
    }

    const parcel = (await parcelResponse.json()) as ParcelDetails;

    setSelectedParcel(parcel);
  };

  const onDone: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!lockerNumber) return;

    const response = await detailsGetByTerminalId(id, session!);
    if (response.status !== StatusCodes.OK) {
      defaultError(notificationApi, await response.json());
      return;
    }

    const parcels = await response.json() ;
    setParcels(parcels.parcels);
    setLockerNumber(undefined);
    setSelectedParcel(undefined);
  };

  if (parcels.length === 0) {
    return (
      <div className={styles.info}>
        <h1>No parcels ready for shipment</h1>
      </div>
    );
  }

  const SelectedComponent = (
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

  return (
    <>
      {SelectedComponent}
      {notificationContext}
      <Row>
        <Col className={styles.terminalCatalogue}>
          <Row justify={"center"}>
            <span className={styles.title}>Parcels ready for shipment</span>
          </Row>
          <List
            className={styles.list}
            grid={{
              gutter: 16,
              column: 2,
            }}
            pagination={{
              position: "top",
              pageSize: 4,
            }}
            dataSource={parcels}
            renderItem={(shippableParcel) => (
              <List.Item>
                <Card
                  title={shippableParcel.id}
                  onClick={onSelect}
                  className={styles.clickableCard}
                  bodyStyle={{ padding: "10px" }}
                  headStyle={{ textAlign: "center" }}
                  id={shippableParcel.id}
                  hoverable
                >
                  <Row justify={"center"}>
                    <span>Size: {shippableParcel.size}</span>
                  </Row>
                  <Row justify={"center"}>
                    <span>
                      Address: {shippableParcel.deliveryTerminalAddress}
                    </span>
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
