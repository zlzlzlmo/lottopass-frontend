import React from "react";
import { Form, Input } from "antd";
import { REGEX } from "@/constants/regex";

const PasswordForm: React.FC = () => {
  return (
    <>
      <Form.Item
        label="비밀번호"
        name="password"
        rules={[
          { required: true, message: "비밀번호를 입력해주세요." },
          {
            pattern: REGEX.PASSWORD,
            message:
              "비밀번호는 최소 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.",
          },
        ]}
        style={{ marginBottom: 16 }}
      >
        <Input.Password
          placeholder="비밀번호를 입력해주세요."
          style={{ height: 48 }}
        />
      </Form.Item>

      <Form.Item
        label="비밀번호 확인"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "비밀번호 확인을 입력해주세요." },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
            },
          }),
        ]}
        style={{ marginBottom: 16 }}
      >
        <Input.Password
          placeholder="비밀번호 확인을 입력해주세요."
          style={{ height: 48 }}
        />
      </Form.Item>
    </>
  );
};

export default PasswordForm;
