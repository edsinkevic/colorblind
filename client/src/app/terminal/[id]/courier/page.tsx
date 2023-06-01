"use client";

import styles from "colorblind/shared/styles/littleForms.module.scss";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { authenticate } from "colorblind/shared/requests/couriers";
import { Button, Form, Input, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";

interface Props {
  params: { id: string };
}

export default function PickCourier({ params: { id } }: Props) {
  const router = useRouter();
  const [courierName, setCourierName] = useState<string>();
  const [courierPassword, setCourierPassword] = useState<string>();
  const [notificationApi, notificationContext] = useNotification();

  const onSubmit = async () => {
    if (!courierName || !courierPassword) {
      return;
    }

    const response = await authenticate({
      name: courierName,
      password: courierPassword,
    });

    if (response.status !== StatusCodes.OK) {
      const body = (await response.json()) as Problem;
      defaultError(notificationApi, body);
      return;
    }

    const session = (await response.json()) as string;

    

    router.push(`/terminal/${id}/courier/${session[0].id}`);
  };

  return (
    <Form className={styles.form} onFinish={onSubmit}>
      {notificationContext}
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
          disabled={!courierName || !courierPassword}
        >
          Submit
        </Button>
      </Row>
    </Form>
  );
}
