import { Space, Input, Select, Form, Button } from "antd";

const EmailVerificationField: React.FC<{
  emailVerificationSent: boolean;
  emailVerified: boolean;
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  verificationLoading: boolean;
  codeVerificationLoading: boolean;
  handleSendVerification: () => void;
  handleVerifyCode: () => void;
}> = ({
  emailVerificationSent,
  emailVerified,
  verificationCode,
  setVerificationCode,
  verificationLoading,
  codeVerificationLoading,
  handleSendVerification,
  handleVerifyCode,
}) => (
  <>
    <Form.Item label="이메일" required style={{ marginBottom: 16 }}>
      <Space style={{ display: "flex", gap: "8px" }}>
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
            <Select.Option value="gmail.com">gmail.com</Select.Option>
            <Select.Option value="naver.com">naver.com</Select.Option>
            <Select.Option value="daum.net">daum.net</Select.Option>
            <Select.Option value="custom">직접 입력</Select.Option>
          </Select>
        </Form.Item>
      </Space>
    </Form.Item>

    {emailVerificationSent && (
      <Form.Item label="인증 코드" required style={{ marginBottom: 16 }}>
        <Space style={{ display: "flex", gap: "8px" }}>
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
        </Space>
      </Form.Item>
    )}

    <Form.Item style={{ textAlign: "right", marginBottom: 16 }}>
      <Button
        type="default"
        onClick={handleSendVerification}
        loading={verificationLoading}
        style={{ height: 48 }}
        disabled={emailVerified}
      >
        {emailVerificationSent ? "재요청" : "인증 요청"}
      </Button>
    </Form.Item>
  </>
);

export default EmailVerificationField;
