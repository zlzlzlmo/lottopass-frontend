import { Button, Form } from "antd";

const VerificationButton: React.FC<{
  emailVerificationSent: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}> = ({ emailVerificationSent, loading, disabled, onClick }) => (
  <Form.Item style={{ textAlign: "right", marginBottom: 16 }}>
    <Button
      type="default"
      onClick={onClick}
      loading={loading}
      style={{ height: 48 }}
      disabled={disabled}
    >
      {emailVerificationSent ? "재요청" : "인증 요청"}
    </Button>
  </Form.Item>
);
export default VerificationButton;
