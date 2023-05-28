"use client";

import styles from "colorblind/shared/styles/littleForms.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Courier,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { query } from "colorblind/shared/requests/couriers";
import { Button, Form, Input, Row } from "antd";

interface Props {
  params: { id: string };
}

export default function PickCourier({ params: { id } }: Props) {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();
  const [error, setError] = useState<string>();
  const [courierName, setCourierName] = useState<string>();
  const [courierPassword, setCourierPassword] = useState<string>();
  const [courier, setCourier] = useState<Courier>();

  useEffect(() => {
    const fetchCourier = async () => {
      const response = await query(courierName);

      if (response.status !== StatusCodes.OK) {
        const body = (await response.json()) as Problem;
        setProblem(body);
        return;
      }

      const couriers = (await response.json()) as Courier[];

      if (couriers.length === 0) {
        setError("Courier not found!");
        return;
      }

      setCourier(couriers[0]);
      setError(undefined);
    };

    fetchCourier();
  }, [courierName]);

  return (
    <Form
      className={styles.form}
      onFinish={(e) => {
        if (courier) router.push(`/terminal/${id}/courier/${courier.id}`);
      }}
    >
      <Row justify={"center"}>
        <span className={styles.title}>Log-in</span>
      </Row>
      <Row justify={"center"}>
        <Input
          className={styles.input}
          placeholder="Username"
          value={courierName}
          onChange={(e) => {
            setCourierName(e.target.value);
          }}
        />
      </Row>

      <Row justify={"center"}>
        <Input
          className={styles.input}
          type="password"
          placeholder="Password "
          value={courierPassword}
          onChange={(e) => {
            setCourierPassword(e.target.value);
          }}
        />
      </Row>

      <Row justify={"center"}>
        <Button
          htmlType="submit"
          className={styles.bigButton}
          disabled={!courierName}
        >
          Submit
        </Button>
      </Row>
      {problem ? JSON.stringify(problem) : null}
      {error}
    </Form>
  );
}
