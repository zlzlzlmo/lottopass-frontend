import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ROUTES } from "@/constants/routes";
import FlexContainer from "@/components/common/container/FlexContainer";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { useActionState } from "@/hooks/useActionState";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/features/auth/authSlice";
import { supabase } from "@/lib/supabase/client";

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signIn } = useSupabaseAuth();
  const { execute, loading, error } = useActionState();

  const handleLogin = async (values: LoginFormData) => {
    const result = await execute(async () => {
      // Supabase로 로그인
      await signIn(values.email, values.password);
      
      // 프로필 정보 가져오기
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .single();
      
      if (profile) {
        // Redux에 사용자 정보 저장
        dispatch(setUser({
          id: profile.id,
          email: profile.email,
          nickname: profile.nickname || undefined,
        }));
      }
      
      return true;
    });

    if (result.success) {
      message.success("로그인 성공!");
      navigate(ROUTES.HOME.path);
    }
  };

  const onFinishFailed = () => {
    message.error("입력값을 확인해주세요.");
  };

  // 에러 메시지 표시
  React.useEffect(() => {
    if (error) {
      message.error(error.message || "로그인 실패. 다시 시도해주세요.");
    }
  }, [error]);

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

        <Form<LoginFormData>
          name="login"
          layout="vertical"
          onFinish={handleLogin}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="이메일"
            name="email"
            rules={[
              { required: true, message: "이메일을 입력해주세요." },
              { type: "email", message: "올바른 이메일 형식이 아닙니다." }
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="이메일을 입력해주세요."
              style={{ height: 48 }}
              autoComplete="email"
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
              autoComplete="current-password"
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