"use client";
import { useRouter } from "next/navigation";
import useNotification from "antd/es/notification/useNotification";
import { register } from "colorblind/shared/requests/couriers";
import { StatusCodes } from "colorblind/shared/lib/models/models";
import { defaultError } from "colorblind/shared/notifications/defaults";

import styles from "colorblind/shared/styles/littleForms.module.scss";
import { useState } from "react";
import { Button, Form, Input, Row } from "antd";

const Page = () => {
  const router = useRouter();
  const [notificationApi, notificationContext] = useNotification();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async () => {
    const resp = await register({ name, password });

    if (resp.status !== StatusCodes.OK) {
      defaultError(notificationApi, await resp.json());
      return;
    }

    notificationApi.success({
      message: "Registration successful. Wait for admin approval!",
      placement: "top",
      duration: 3,
    });

    setTimeout(() => router.replace("/"), 3000);
    return;
  };

  return (
    <Form onFinish={onSubmit} className={styles.form}>
      {notificationContext}
      <Row justify={"center"}>
        <span className={styles.title}>Courier registration</span>
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
        <Input
          className={styles.input}
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
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
};

export default Page;
