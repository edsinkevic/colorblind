"use client";
import styles from "colorblind/shared/styles/littleForms.module.scss";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/couriers";
import { Button, Form, Input, Row } from "antd";

export default function RegisterCourier() {
  const [error, setError] = useState<Error>();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();

  const onSubmit = async () => {
    const resp = await register({ name });

    if (resp.status === StatusCodes.OK) {
      // Decide what to do next
      router.replace("/");
      return;
    }

    if (resp.status === StatusCodes.BAD_REQUEST) {
      setProblem(await resp.json());
      return;
    }

    setError(new Error("Something went super wrong!"));
  };

  const [name, setName] = useState<string>("");

  return (
    <Form onFinish={onSubmit} className={styles.form}>
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
      {problem ? JSON.stringify(problem) : null}
      {error ? error.message : null}
    </Form>
  );
}
