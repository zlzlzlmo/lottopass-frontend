import { REGEX } from "@/constants/regex";
import { Input, Form } from "antd";

const NicknameField: React.FC = () => (
  <Form.Item
    label="닉네임"
    name="nickname"
    rules={[
      { required: true, message: "닉네임을 입력해주세요." },
      {
        pattern: REGEX.NICKNAME,
        message: "닉네임은 2~10자리 영문/한글/숫자만 가능합니다.",
      },
    ]}
    style={{ marginBottom: 16 }}
  >
    <Input placeholder="닉네임을 입력해주세요." style={{ height: 48 }} />
  </Form.Item>
);
export default NicknameField;
