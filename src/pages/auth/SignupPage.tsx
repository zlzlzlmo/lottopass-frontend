/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  Space,
  message,
} from "antd";
import { SmileOutlined, MailOutlined, CheckOutlined } from "@ant-design/icons";
import Layout from "@/components/layout/Layout";

import type { FormInstance } from "antd";

import { authService, userService } from "@/api";
import { useEmailVerification } from "./hooks/useEmailVerification";

const { Title, Text } = Typography;
const { Option } = Select;

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormInstance>(null);

  const {
    emailVerificationSent,
    emailVerified,
    verificationCode,
    setVerificationCode,
    verificationLoading,
    codeVerificationLoading,
    handleSendVerification,
    handleVerifyCode,
    resetVerificationState,
  } = useEmailVerification(formRef);

  const onFinish = async (values: {
    email: string;
    domain: string;
    nickname: string;
    password: string;
  }) => {
    if (!emailVerified) {
      message.error("이메일 인증을 완료해주세요.");
      return;
    }

    setLoading(true);
    const { email, domain, nickname, password } = values;
    const fullEmail = `${email}@${domain}`;

    try {
      await userService.signup({ email: fullEmail, nickname, password });
      message.success("회원가입이 완료되었습니다. 로그인해주세요.");
      await authService.login(fullEmail, password);
    } catch (error: any) {
      message.error(`${error.message} 다시 입력해주세요.`);
      resetVerificationState("email");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error("입력값을 확인해주세요.");
  };

  return (
    <Layout>
      <Card
        style={{
          maxWidth: 400,
          margin: "50px auto",
          borderRadius: 10,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <SmileOutlined style={{ fontSize: 48, color: "#3b82f6" }} />
          <Title level={3} style={{ margin: "10px 0" }}>
            회원가입
          </Title>
          <Text type="secondary">로또 패스와 함께하세요!</Text>
        </div>

        <Form
          name="signup"
          layout="vertical"
          ref={formRef}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="이메일" required style={{ marginBottom: 16 }}>
            <Space.Compact style={{ display: "flex", gap: "8px" }}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "이메일을 입력해주세요." }]}
                noStyle
              >
                <Input
                  placeholder="이메일을 입력해주세요."
                  style={{ flex: 2, height: 48 }}
                  disabled={emailVerified}
                />
              </Form.Item>
              <Form.Item name="domain" initialValue="gmail.com" noStyle>
                <Select style={{ flex: 1, height: 48 }}>
                  <Option value="gmail.com">gmail.com</Option>
                  <Option value="naver.com">naver.com</Option>
                  <Option value="daum.net">daum.net</Option>
                  <Option value="custom">직접 입력</Option>
                </Select>
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          {emailVerificationSent && (
            <Form.Item label="인증 코드" required style={{ marginBottom: 16 }}>
              <Space.Compact style={{ display: "flex", gap: "8px" }}>
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
                  icon={<CheckOutlined />}
                  disabled={emailVerified}
                >
                  인증하기
                </Button>
              </Space.Compact>
            </Form.Item>
          )}

          <Form.Item style={{ textAlign: "right", marginBottom: 16 }}>
            <Button
              type="default"
              icon={<MailOutlined />}
              onClick={handleSendVerification}
              loading={verificationLoading}
              style={{ height: 48 }}
              disabled={emailVerified}
            >
              {emailVerificationSent ? "재요청" : "인증 요청"}
            </Button>
          </Form.Item>

          <Form.Item
            label="닉네임"
            name="nickname"
            rules={[
              {
                required: true,
                message: "닉네임을 입력해주세요.",
              },
              {
                pattern: /^[a-zA-Z가-힣0-9]{2,10}$/,
                message: "닉네임은 2~10자리 영문/한글/숫자만 가능합니다.",
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input placeholder="닉네임" style={{ height: 48 }} />
          </Form.Item>

          <Form.Item
            label="비밀번호"
            name="password"
            rules={[
              {
                required: true,
                message: "비밀번호를 입력해주세요.",
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "비밀번호는 최소 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.",
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password placeholder="비밀번호" style={{ height: 48 }} />
          </Form.Item>

          <Form.Item
            label="비밀번호 확인"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "비밀번호 확인을 입력해주세요.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("비밀번호가 일치하지 않습니다.")
                  );
                },
              }),
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              placeholder="비밀번호 확인"
              style={{ height: 48 }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 8,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              가입하기
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default SignupPage;
