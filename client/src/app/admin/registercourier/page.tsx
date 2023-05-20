"use client";

import React from "react";
import { Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/couriers";
import { Button, Input, notification } from "antd";
import { StyledForm } from "colorblind/app/admin/registercourier/components/styled";
import { NotificationPlacement } from "antd/es/notification/interface";

export default function RegisterCourier() {
  const [notificationApi, notificationContext] = notification.useNotification();

  const openNotification = (
    placement: NotificationPlacement,
    message: string
  ) => {
    notificationApi.info({
      message: `Notification ${placement}`,
      description: message,
      placement,
    });
  };

  const onSubmit = async ({ name }: { name: string }) => {
    const resp = await register({ name });

    if (resp.status === StatusCodes.OK) {
      openNotification("top", `Courier ${name} created!`);
      return;
    }

    if (resp.status === StatusCodes.BAD_REQUEST) {
      const problem = (await resp.json()) as Problem;
      notificationApi.warning({
        placement: "top",
        message: "Warning!",
        description: problem.detail,
      });
      return;
    }

    notificationApi.error({
      placement: "top",
      message: "Error!",
      description: "Something went super wrong!",
    });
  };

  return (
    <>
      {notificationContext}
      <StyledForm
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        autoComplete="off"
      >
        <StyledForm.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </StyledForm.Item>

        <StyledForm.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </StyledForm.Item>
      </StyledForm>
    </>
  );
}
