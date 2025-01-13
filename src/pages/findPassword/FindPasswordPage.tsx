/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Layout from "@/components/layout/Layout";
import { authService, userService } from "@/api";
import ResetPasswordPage from "../auth/ResetPasswordPage";

const { Title, Text } = Typography;

const FindPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [form] = Form.useForm();

  const sendVerificationCode = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        message.error("이메일을 먼저 입력해주세요.");
        return;
      }
      const isEmailTaken = await userService.checkEmail(email);

      if (!isEmailTaken) {
        message.error("해당 이메일의 계정이 존재하지 않습니다.");
        return;
      }
      setSendingCode(true);
      await authService.requestEmailVerification(email);
      message.success("인증 코드가 이메일로 발송되었습니다.");
    } catch (error: any) {
      message.error(error.message || "인증 코드 발송에 실패했습니다.");
    } finally {
      setSendingCode(false);
    }
  };

  const onFinish = async (values: { email: string; code: string }) => {
    setLoading(true);
    try {
      await authService.verifyEmailCode(values.email, values.code);
      message.success(
        "인증이 완료되었습니다. 비밀번호 재설정 페이지로 이동합니다."
      );
      setIsVerified(true);
    } catch (error: any) {
      message.error(error.message || "인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error("입력값을 확인해주세요.");
  };
  if (!isVerified)
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
            <MailOutlined style={{ fontSize: 48, color: "#3b82f6" }} />
            <Title level={3} style={{ margin: "10px 0" }}>
              이메일 인증
            </Title>
            <Text type="secondary">이메일 주소와 인증 코드를 입력하세요.</Text>
          </div>

          <Form
            form={form} // Form 인스턴스 연결
            name="emailVerification"
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
                prefix={<MailOutlined />}
                placeholder="이메일"
                style={{ height: 48 }}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "right", marginBottom: 16 }}>
              <Button
                type="default"
                onClick={sendVerificationCode} // 함수 호출
                loading={sendingCode}
                style={{ height: 48 }}
              >
                인증 코드 보내기
              </Button>
            </Form.Item>

            <Form.Item
              label="인증 코드"
              name="code"
              rules={[{ required: true, message: "인증 코드를 입력해주세요." }]}
              style={{ marginBottom: 16 }}
            >
              <Input placeholder="인증 코드" style={{ height: 48 }} />
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
                인증 완료
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    );

  return <ResetPasswordPage email={form.getFieldValue("email")} />;
};

export default FindPasswordPage;
