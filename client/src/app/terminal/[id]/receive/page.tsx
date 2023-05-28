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

interface Props {
  params: { id: string };
}

export default function TerminalReceive({ params: { id } }: Props) {
  const [error, setError] = useState<string>();
  const [code, setCode] = useState<string>("");
  const [parcel, setParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const router = useRouter();

  const fetchParcel = async () => {
    const parcelResponse = await getOneByCode(code);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      setError(problem.detail);
      return;
    }

    const fetchedParcel = (await parcelResponse.json()) as ParcelDetails;

    if (fetchedParcel.status !== ParcelStatus.DELIVERED) {
      setError("Parcel was not delivered yet!");
      return;
    }

    setParcel(fetchedParcel);
    setError(undefined);
  };

  const onApplyCode: MouseEventHandler = async () => {
    await fetchParcel();
  };

  const onLockerOpen: MouseEventHandler = async () => {
    if (!parcel || error) return;
    const response = await receive(code, parcel.version);

    if (response.status === StatusCodes.Conflict) {
      const problem = (await response.json()) as Problem;
      setError(problem.detail);
      await fetchParcel();
      return;
    }

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

  const onSubmit: MouseEventHandler = async () => {
    setError(undefined);
    await router.push(`/terminal/${id}`);
  };

  return (
    <Form className={styles.form}>
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
      <br />
      {lockerNumber ? (
        <Row justify={"center"}>
          <Button className={styles.bigButton} onClick={onSubmit}>
            Close locker {lockerNumber}
          </Button>
        </Row>
      ) : null}
      {successMessage}
      {error}
    </Form>
  );
}
