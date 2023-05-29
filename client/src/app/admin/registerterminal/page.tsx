"use client";

import styles from "colorblind/shared/styles/littleForms.module.scss";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/terminal";
import { Button, Form, Input, Row } from "antd";

export default function StepOne() {
  const [error, setError] = useState<Error>();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const resp = await register({
      address,
      lockers: [
        { size: "M", count: 5 },
        { size: "XL", count: 10 },
      ],
    });

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

  const [address, setAddress] = useState<string>("");

  return (
    <Form onFinish={onSubmit} className={styles.form}>
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
      {problem ? JSON.stringify(problem) : null}
      {error ? error.message : null}
    </Form>
  );
}
