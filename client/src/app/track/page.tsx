"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "colorblind/shared/styles/littleForms.module.scss";
import {
  getRecentlyTracked,
  storeRecentlyTracked,
} from "colorblind/app/track/components/actions";
import { getOneByCode } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { AutoComplete, Button, Form, Row } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { defaultError } from "colorblind/shared/notifications/defaults";

interface Props {}

export default function ParcelDetailsPage({}: Props) {
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const [recentlyTracked, setRecentlyTracked] = useState<string[]>([]);
  const [notificationApi, notificationContext] = useNotification();

  useEffect(() => {
    const recentlyTracked = getRecentlyTracked();

    if (!recentlyTracked) {
      setRecentlyTracked([]);
      return;
    }

    setRecentlyTracked(recentlyTracked);
    setCode(recentlyTracked.at(0) ?? "");
  }, []);

  const onSubmit = async () => {
    const response = await getOneByCode(code);

    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      defaultError(notificationApi, problem);
      return;
    }

    const parcel = (await response.json()) as ParcelDetails;

    storeRecentlyTracked(code);
    router.push(`/track/${parcel.id}`);
  };

  return (
    <Form onFinish={onSubmit} className={styles.form}>
      {notificationContext}
      <Row justify={"center"}>
        <span className={styles.title}>Track</span>
      </Row>
      <Row justify={"center"}>
        <AutoComplete
          className={styles.input}
          value={code}
          options={recentlyTracked.map((x) => ({ value: x }))}
          onChange={setCode}
          notFoundContent={"No recently tracked parcels"}
        />
      </Row>

      <Row justify={"center"}>
        <Button
          className={styles.bigButton}
          htmlType={"submit"}
          disabled={!code}
        >
          Track
        </Button>
      </Row>
    </Form>
  );
}
