"use client";

import styles from "colorblind/shared/styles/littleForms.module.scss";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusCodes } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/terminal";
import { Button, Form, Input, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";

export default function StepOne() {
  const router = useRouter();
  const [notificationApi, notificationContext] = useNotification();

  const onSubmit = async () => {
    const resp = await register({
      address,
      lockers: [
        { size: "M", count: 5 },
        { size: "XL", count: 10 },
      ],
    });

    if (resp.status !== StatusCodes.OK) {
      defaultError(notificationApi, await resp.json());
    }

    router.replace("/");
    return;
  };

  const [address, setAddress] = useState<string>("");

  return (
    <Form onFinish={onSubmit} className={styles.form}>
      {notificationContext}
      <Row justify={"center"}>
        <span className={styles.title}>Register terminal</span>
      </Row>
      <Row justify={"center"}>
        <Input
          className={styles.input}
          value={address}
          placeholder={"Address"}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        ></Input>
      </Row>
      <Row justify={"center"}>
        <Button htmlType="submit" className={styles.bigButton}>
          Submit
        </Button>
      </Row>
    </Form>
  );
}
