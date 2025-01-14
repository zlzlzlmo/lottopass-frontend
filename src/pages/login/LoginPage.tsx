/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { authService } from "@/api";
import { ROUTES } from "@/constants/routes";
import FlexContainer from "@/components/common/container/FlexContainer";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/features/auth/authSlice";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onFinish = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { token } = await authService.login(email, password);
      localStorage.setItem("accessToken", token);

      message.success("로그인 성공!");
      navigate(ROUTES.HOME.path);
      const me = await authService.getMe();
      dispatch(setUser(me));
    } catch (error: any) {
      message.error(error.message || "로그인 실패. 다시 시도해주세요.");
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
            로그인
          </Title>
          <Text type="secondary">로또 패스에 오신 것을 환영합니다!</Text>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="이메일"
            name="email"
            rules={[{ required: true, message: "이메일을 입력해주세요." }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="이메일을 입력해주세요."
              style={{ height: 48 }}
            />
          </Form.Item>

          <Form.Item
            label="비밀번호"
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호를 입력해주세요."
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
              로그인
            </Button>
          </Form.Item>

          <FlexContainer gap={10} justify="center">
            <NavLink to={ROUTES.SIGNUP.path}>회원가입</NavLink>
            <NavLink to={ROUTES.FIND_PASSWORD.path}>비밀번호 찾기</NavLink>
          </FlexContainer>
        </Form>
      </Card>
    </Layout>
  );
};

export default LoginPage;
