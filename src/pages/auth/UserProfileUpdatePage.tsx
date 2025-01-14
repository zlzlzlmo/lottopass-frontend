/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { authService, userService } from "@/api";
import { useAppDispatch } from "@/redux/hooks";
import { setUser as setUpdatedUser } from "@/features/auth/authSlice";
import { ROUTES } from "@/constants/routes";

const { Title, Text } = Typography;

const UserProfileUpdatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<{
    email: string;
    password?: string;
    nickname?: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getProfile();
        setUser({
          email: response.email,
          nickname: response.nickname,
        });
      } catch (error: any) {
        message.error(error.message);
      }
    };

    fetchUserData();
  }, []);

  const onFinish = async (user: {
    email: string;
    password?: string;
    nickname?: string;
  }) => {
    if (!user.password) {
      delete user.password;
    }

    if (!user.nickname) {
      delete user.nickname;
    }

    setLoading(true);
    try {
      const { token } = await userService.updateProfile(user);
      localStorage.setItem("accessToken", token);
      message.success("회원 정보가 성공적으로 수정되었습니다.");
      const me = await authService.getMe();
      dispatch(setUpdatedUser(me));
      navigate(ROUTES.HOME.path);
    } catch (error: any) {
      message.error(error.message || "회원 정보 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error("입력값을 확인해주세요.");
  };

  if (!user) {
    return null;
  }

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
          <UserOutlined style={{ fontSize: 48, color: "#3b82f6" }} />
          <Title level={3} style={{ margin: "10px 0" }}>
            회원 정보 수정
          </Title>
          <Text type="secondary">회원 정보를 업데이트하세요.</Text>
        </div>

        <Form
          name="updateProfile"
          layout="vertical"
          initialValues={user}
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
              prefix={<MailOutlined />}
              placeholder="이메일"
              style={{ height: 48 }}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="닉네임"
            name="nickname"
            rules={[{ required: true, message: "닉네임을 입력해주세요." }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="닉네임"
              style={{ height: 48 }}
            />
          </Form.Item>

          <Form.Item
            label="비밀번호 (변경 시 입력)"
            name="password"
            rules={[
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "비밀번호는 최소 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.",
              },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호 (변경 시 입력)"
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
              수정하기
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default UserProfileUpdatePage;
