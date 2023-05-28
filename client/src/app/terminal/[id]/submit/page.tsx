"use client";
import styles from "colorblind/shared/styles/littleForms.module.scss";
import { MouseEventHandler, useState } from "react";
import { getOneByCode, submit } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  Problem,
  StatusCodes,
  SubmitResponse,
} from "colorblind/shared/lib/models/models";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";

interface Props {
  params: { id: string };
}

export default function TerminalSubmit({ params: { id } }: Props) {
  const [code, setCode] = useState<string>("");
  const [parcel, setParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const router = useRouter();
  const [notificationApi, notificationContext] = useNotification();

  const onApplyCode: MouseEventHandler = async () => {
    const parcelResponse = await getOneByCode(code);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      notificationApi.error({
        message: problem.title,
        description: problem.detail,
        placement: "bottomLeft",
        duration: 5,
      });
      return;
    }

    const fetchedParcel = (await parcelResponse.json()) as ParcelDetails;
    setParcel(fetchedParcel);
  };

  const onConfirm: MouseEventHandler = async () => {
    if (!parcel) return;
    const response = await submit(code, id, parcel.version);
    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      notificationApi.error({
        message: problem.title,
        description: problem.detail,
        placement: "bottomLeft",
        duration: 5,
      });
      return;
    }

    const { lockerNumber } = (await response.json()) as SubmitResponse;

    setLockerNumber(lockerNumber);
  };

  const onClose: MouseEventHandler = async () => {
    notificationApi.success({
      message: "Parcel submitted successfully!",
      placement: "top",
      duration: 3,
    });
    await setTimeout(() => router.push(`/terminal/${id}`), 3000);
  };

  return (
    <Form className={styles.form}>
      {notificationContext}
      <Row justify={"center"}>
        <span className={styles.title}>Submit a parcel</span>
      </Row>
      <Row justify={"center"}>
        <span>Enter the order code to open a locker.</span>
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
        <Button onClick={onApplyCode} className={styles.bigButton}>
          Apply code
        </Button>
      </Row>
      <Row justify={"center"}>
        {parcel ? (
          <Button className={styles.bigButton} onClick={onConfirm}>
            Confirm
          </Button>
        ) : null}
      </Row>
      <Row justify={"center"}>
        {lockerNumber ? (
          <Button className={styles.bigButton} onClick={onClose}>
            Close locker {lockerNumber}
          </Button>
        ) : null}
      </Row>
    </Form>
  );
}
