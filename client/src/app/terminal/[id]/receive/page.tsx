"use client";
import styles from "colorblind/shared/styles/littleForms.module.scss";
import { MouseEventHandler, useState } from "react";
import { getOneByCode, receive } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  ParcelStatus,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";

interface Props {
  params: { id: string };
}

export default function TerminalReceive({ params: { id } }: Props) {
  const [code, setCode] = useState<string>("");
  const [parcel, setParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const router = useRouter();
  const [notificationApi, notificationContext] = useNotification();

  const fetchParcel = async () => {
    const parcelResponse = await getOneByCode(code);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      defaultError(notificationApi, problem);
      return;
    }

    const fetchedParcel = (await parcelResponse.json()) as ParcelDetails;

    if (fetchedParcel.status !== ParcelStatus.DELIVERED) {
      notificationApi.error({
        message: "Error",
        description: `Parcel is ${fetchedParcel.status.toLocaleLowerCase()}!`,
        placement: "bottomLeft",
        duration: 5,
      });
      return;
    }

    setParcel(fetchedParcel);
  };

  const onApplyCode: MouseEventHandler = async () => {
    await fetchParcel();
  };

  const onLockerOpen: MouseEventHandler = async () => {
    if (!parcel) return;
    const response = await receive(code, parcel.version);

    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      defaultError(notificationApi, problem);
      await fetchParcel();
      return;
    }

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

  const onSubmit: MouseEventHandler = async () => {
    await router.push(`/terminal/${id}`);
  };

  return (
    <Form className={styles.form}>
      {notificationContext}
      <Row justify={"center"}>
        <span className={styles.title}>Enter parcel code</span>
      </Row>
      <Row justify={"center"}>
        <span>Enter the tracking code to open a locker.</span>
      </Row>
      <Row justify={"center"}>
        <Input
          className={styles.input}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
      </Row>
      <Row justify={"center"}>
        <Button className={styles.bigButton} onClick={onApplyCode}>
          Apply code
        </Button>
      </Row>
      {parcel ? (
        <Row justify={"center"}>
          <Button className={styles.bigButton} onClick={onLockerOpen}>
            Open locker
          </Button>
        </Row>
      ) : null}{" "}
      {lockerNumber ? (
        <Row justify={"center"}>
          <Button className={styles.bigButton} onClick={onSubmit}>
            Close locker {lockerNumber}
          </Button>
        </Row>
      ) : null}
    </Form>
  );
}
