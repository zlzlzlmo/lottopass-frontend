/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { authService, userService } from "@/api";
import { REGEX } from "@/constants/regex";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/features/auth/authSlice";

const { Title, Text } = Typography;

interface ResetPasswordPageProps {
  email: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!email) {
      message.error("유효하지 않은 접근입니다.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      message.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await userService.resetPassword({
        email,
        newPassword: values.password,
      });

      const { token } = await authService.login(email, values.password);
      localStorage.setItem("accessToken", token);
      const me = await authService.getMe();
      dispatch(setUser(me));
      navigate("/");
    } catch (error: any) {
      message.error(error.message || "비밀번호 재설정에 실패했습니다.");
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
          <LockOutlined style={{ fontSize: 48, color: "#3b82f6" }} />
          <Title level={3} style={{ margin: "10px 0" }}>
            비밀번호 재설정
          </Title>
          <Text type="secondary">새로운 비밀번호를 설정하세요.</Text>
        </div>

        <Form
          name="resetPassword"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="새 비밀번호"
            name="password"
            rules={[
              {
                required: true,
                message: "새 비밀번호를 입력해주세요.",
              },
              {
                pattern: REGEX.PASSWORD,
                message:
                  "비밀번호는 최소 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.",
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="새 비밀번호"
              style={{ height: 48 }}
            />
          </Form.Item>

          <Form.Item
            label="비밀번호 확인"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "비밀번호 확인을 입력해주세요.",
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
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
              재설정하기
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default ResetPasswordPage;
