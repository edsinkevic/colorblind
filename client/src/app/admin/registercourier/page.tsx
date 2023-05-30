"use client";
import styles from "colorblind/shared/styles/littleForms.module.scss";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusCodes } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/couriers";
import { Button, Form, Input, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";

export default function RegisterCourier() {
  const router = useRouter();
  const [notificationApi, notificationContext] = useNotification();

  const onSubmit = async () => {
    const resp = await register({ name });

    if (resp.status !== StatusCodes.OK) {
      defaultError(notificationApi, await resp.json());
      return;
    }

    // Decide what to do next
    router.replace("/");
    return;
  };

  const [name, setName] = useState<string>("");

  return (
    <Form onFinish={onSubmit} className={styles.form}>
      {notificationContext}
      <Row justify={"center"}>
        <span className={styles.title}>Register courier</span>
      </Row>
      <Row justify={"center"}>
        <Input
          className={styles.input}
          value={name}
          placeholder={"Name"}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Row>
      <Row justify={"center"}>
        <Button htmlType="submit" className={styles.bigButton} disabled={!name}>
          Submit
        </Button>
      </Row>
    </Form>
  );
}
