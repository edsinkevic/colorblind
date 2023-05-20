"use client";

import { Button, Form, Input } from "antd";

export default function CourierRegistration() {
  const onSubmit = (values: { email: string; password: string }) => {
    //TODO wire with backend
    console.log(values);
  };

  return (
    <Form
      autoComplete="off"
      onFinish={onSubmit}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input a password!" }]}
      >
        <Input type={"password"} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
