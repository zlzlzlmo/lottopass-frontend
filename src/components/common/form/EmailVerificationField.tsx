import React from "react";
import { Form, Input, Select } from "antd";
import { REGEX } from "@/constants/regex";
import FlexContainer from "../container/FlexContainer";
const EmailVerificationField: React.FC = () => (
  <>
    <Form.Item label="이메일" required style={{ marginBottom: 16 }}>
      <FlexContainer gap={10}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "이메일을 입력해주세요." }]}
          noStyle
        >
          <Input
            placeholder="이메일을 입력해주세요."
            style={{ flex: 2, height: 48 }}
          />
        </Form.Item>
        <Form.Item name="domain" initialValue="gmail.com" noStyle>
          <Select style={{ flex: 1, height: 48 }}>
            <Select.Option value="gmail.com">gmail.com</Select.Option>
            <Select.Option value="naver.com">naver.com</Select.Option>
            <Select.Option value="daum.net">daum.net</Select.Option>
            <Select.Option value="custom">직접 입력</Select.Option>
          </Select>
        </Form.Item>
      </FlexContainer>
    </Form.Item>
    {/* <Form.Item style={{ textAlign: "right" }}>
      <Button
        type="default"
        onClick={handleSendVerification}
        loading={verificationLoading}
        style={{ height: 48 }}
        disabled={emailVerified}
      >
        {emailVerificationSent ? "재요청" : "인증 요청"}
      </Button>
    </Form.Item> */}
    {/* 
    {emailVerificationSent && (
      <Form.Item label="인증 코드" required style={{ marginBottom: 16 }}>
        <FlexContainer gap={10}>
          <Input
            placeholder="인증 코드를 입력해주세요."
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ flex: 2, height: 48 }}
            disabled={emailVerified}
          />
          <Button
            type="primary"
            onClick={handleVerifyCode}
            loading={codeVerificationLoading}
            style={{ flex: 1, height: 48 }}
            disabled={emailVerified}
          >
            인증하기
          </Button>
        </FlexContainer>
      </Form.Item>
    )} */}
  </>
);

const NicknameField: React.FC = () => (
  <Form.Item
    label="닉네임"
    name="nickname"
    rules={[
      { required: true, message: "닉네임을 입력해주세요." },
      {
        pattern: REGEX.NICKNAME,
        message: "닉네임은 2~10자리 영문/한글/숫자만 가능합니다.",
      },
    ]}
    style={{ marginBottom: 16 }}
  >
    <Input placeholder="닉네임" style={{ height: 48 }} />
  </Form.Item>
);

const PasswordField: React.FC = () => (
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
    <Input.Password placeholder="비밀번호" style={{ height: 48 }} />
  </Form.Item>
);

const ConfirmPasswordField: React.FC = () => (
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
    <Input.Password placeholder="비밀번호 확인" style={{ height: 48 }} />
  </Form.Item>
);

const PasswordForm: React.FC = () => {
  return (
    <>
      <PasswordField />
      <ConfirmPasswordField />
    </>
  );
};

export { EmailVerificationField, NicknameField, PasswordForm };
