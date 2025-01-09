/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Card, message, Select } from "antd";
import Layout from "@/components/layout/Layout";
import { authService, userService } from "@/api";

const { Option } = Select;

const SignupPage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  const handleRequestVerification = async () => {
    const emailLocalPart = form.getFieldValue("emailLocalPart");
    const emailDomain = form.getFieldValue("emailDomain");

    if (!emailLocalPart || !emailDomain) {
      message.error("이메일을 입력해주세요.");
      return;
    }

    const email = `${emailLocalPart}@${emailDomain}`;
    form.setFieldsValue({ email });

    try {
      setVerificationInProgress(true);
      await authService.requestEmailVerification(email);
      message.success("인증 코드가 발송되었습니다.");
    } catch (error) {
      console.error(error);
      message.error("인증 코드 요청 중 오류가 발생했습니다.");
    } finally {
      setVerificationInProgress(false);
    }
  };

  const handleVerifyCode = async () => {
    const email = form.getFieldValue("email");
    const verificationCode = form.getFieldValue("verificationCode");

    if (!verificationCode) {
      message.error("인증 코드를 입력해주세요.");
      return;
    }

    try {
      const isVerified = await authService.verifyEmailCode(
        email,
        verificationCode
      );
      if (isVerified) {
        message.success("이메일 인증이 완료되었습니다.");
        setEmailVerified(true);
        setCurrentSlide(1);
      } else {
        message.error("인증 코드가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error(error);
      message.error("인증 코드 검증 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (values: any) => {
    if (!emailVerified) {
      message.error("이메일 인증을 완료해주세요.");
      return;
    }

    // 이메일 값을 슬라이드 0에서 설정한 이메일로 추가
    const email = `${form.getFieldValue("emailLocalPart")}@${form.getFieldValue(
      "emailDomain"
    )}`;
    values.email = email;

    // confirmPassword 필드 제거
    delete values.confirmPassword;

    try {
      await userService.signup(values);
      message.success("회원가입이 완료되었습니다.");
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "0 16px",
          marginTop: "40px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 640,
            textAlign: "center",
            borderRadius: 16,
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            padding: 24,
          }}
        >
          <h2 style={{ marginBottom: 24 }}>회원가입</h2>

          {currentSlide === 0 && (
            <Form form={form} layout="vertical">
              <Form.Item label="이메일" required>
                <Input.Group compact>
                  <Form.Item
                    name="emailLocalPart"
                    rules={[
                      { required: true, message: "이메일을 입력해주세요." },
                    ]}
                    noStyle
                  >
                    <Input style={{ width: "60%" }} placeholder="이메일" />
                  </Form.Item>
                  <Form.Item
                    name="emailDomain"
                    rules={[
                      { required: true, message: "도메인을 선택해주세요." },
                    ]}
                    noStyle
                  >
                    <Select style={{ width: "40%" }} placeholder="도메인 선택">
                      <Option value="gmail.com">gmail.com</Option>
                      <Option value="naver.com">naver.com</Option>
                      <Option value="daum.net">daum.net</Option>
                      <Option value="">직접 입력</Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item
                label="인증 코드"
                name="verificationCode"
                rules={[
                  { required: true, message: "인증 코드를 입력해주세요." },
                ]}
              >
                <Input placeholder="인증 코드" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  style={{ backgroundColor: "#4caf50", borderColor: "#4caf50" }}
                  onClick={handleRequestVerification}
                  loading={verificationInProgress}
                  block
                >
                  인증 코드 요청
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  style={{ backgroundColor: "#2196f3", borderColor: "#2196f3" }}
                  onClick={handleVerifyCode}
                  block
                >
                  인증 확인
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentSlide === 1 && (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="닉네임"
                name="nickname"
                rules={[
                  { required: true, message: "닉네임을 입력해주세요." },
                  {
                    pattern: /^[a-zA-Z가-힣0-9]{2,10}$/,
                    message: "2~10자리 영문/한글/숫자만 가능합니다.",
                  },
                ]}
              >
                <Input placeholder="닉네임" />
              </Form.Item>

              <Form.Item
                label="비밀번호"
                name="password"
                rules={[
                  { required: true, message: "비밀번호를 입력해주세요." },
                  {
                    pattern:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "비밀번호는 최소 8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.",
                  },
                ]}
              >
                <Input.Password placeholder="비밀번호" />
              </Form.Item>

              <Form.Item
                label="비밀번호 확인"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "비밀번호를 확인해주세요." },
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
              >
                <Input.Password placeholder="비밀번호 확인" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  회원가입 완료
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default SignupPage;
