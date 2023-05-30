"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Problem,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getAll } from "colorblind/shared/requests/terminal";
import { Button, Form, Row, Select } from "antd";
import styles from "colorblind/shared/styles/littleForms.module.scss";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";

export default function StepOne() {
  const router = useRouter();
  const [terminals, setTerminals] = useState<TerminalDetails[]>([]);
  const [pickedTerminalId, setPickedTerminalId] = useState<string>();
  const [notificationApi, notificationContext] = useNotification();

  useEffect(() => {
    const fetchTerminals = async () => {
      const response = await getAll();

      if (response.status !== StatusCodes.OK) {
        const body = (await response.json()) as Problem;
        defaultError(notificationApi, body);
        return;
      }

      const terminals = (await response.json()) as TerminalDetails[];
      setTerminals(terminals);

      setPickedTerminalId(terminals[0]?.id);
    };

    fetchTerminals();
  }, [notificationApi]);

  const terminalOptions = terminals.map((terminal) => ({
    value: terminal.id,
    label: terminal.address,
  }));

  const onSelect = (id: string) => setPickedTerminalId(id);
  return (
    <Form
      className={styles.form}
      onFinish={(e) => {
        router.push(`/terminal/${pickedTerminalId}`);
      }}
    >
      {notificationContext}
      <Row justify={"center"}>
        <span className={styles.title}>Select a terminal</span>
      </Row>
      <Row justify={"center"}>
        <Select
          className={styles.select}
          options={terminalOptions}
          onChange={onSelect}
          placeholder="Please select!"
          allowClear
        />
      </Row>
      <Row justify={"center"}>
        <Button
          htmlType="submit"
          disabled={!pickedTerminalId}
          className={styles.bigButton}
        >
          Submit
        </Button>
      </Row>
    </Form>
  );
}
