/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { Form, Button, Card, Typography, message } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import Layout from "@/components/layout/Layout";

import type { FormInstance } from "antd";

import { authService, userService } from "@/api";
import { useEmailVerification } from "../auth/hooks/useEmailVerification";
import NicknameField from "@/components/common/form/NicknameField";
import {
  EmailVerificationField,
  PasswordForm,
} from "@/components/common/form/EmailVerificationField";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/features/auth/authSlice";

const { Title, Text } = Typography;

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormInstance>(null);
  const navigate = useNavigate();
  const { getEmailValue } = useEmailVerification(formRef);

  const onFinish = async (values: {
    email: string;
    domain: string;
    nickname: string;
    password: string;
  }) => {
    setLoading(true);
    const { nickname, password } = values;

    const fullEmail = getEmailValue();
    try {
      await userService.signup({
        email: fullEmail,
        nickname: nickname,
        password,
      });
      message.success("로또패스 회원이 되신걸 환영합니다!");
      await authService.login(fullEmail, password);
      navigate(ROUTES.HOME.path);
      const response = await authService.getMe();
      dispatch(setUser(response));
    } catch (error: any) {
      message.error(`${error.message} 다시 입력해주세요.`);
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
          <EmailVerificationField />

          <NicknameField />
          <PasswordForm />
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
