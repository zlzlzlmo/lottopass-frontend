import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Modal, message } from "antd";
import Layout from "@/components/layout/Layout";
import FlexContainer from "@/components/common/container/FlexContainer";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import { userService } from "@/api";
import { useAppDispatch } from "@/redux/hooks";
import { clearUser } from "@/features/auth/authSlice";
import { ROUTES } from "@/constants/routes";

const { Text } = Typography;

const DeleteAccountPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async (value: { password: string }) => {
    setLoading(true);

    try {
      await userService.deleteUser(value.password);
      dispatch(clearUser());
      message.success("회원 탈퇴가 완료되었습ㄴ다.");
      navigate(ROUTES.HOME.path);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = () => setShowModal(true);

  const closeConfirmation = () => setShowModal(false);

  return (
    <Layout>
      <Container>
        <Banner>
          아쉽지만, 당신의 결정을 존중합니다. <br />
          언제든 다시 돌아오실 수 있습니다!
        </Banner>
        <FlexContainer justify="center" align="center">
          <div>
            <Text type="secondary">
              회원 탈퇴 시 계정 및 데이터가 삭제되며 복구가 불가능합니다.
            </Text>
            <Form
              name="delete-account"
              layout="vertical"
              onFinish={handleDeleteAccount}
              style={{ marginTop: 20 }}
              onKeyPress={(e) => e.key === "Enter" && e.preventDefault()} // Enter 동작 방지
            >
              <Form.Item
                label="비밀번호 확인"
                name="password"
                rules={[
                  { required: true, message: "비밀번호를 입력해주세요." },
                ]}
              >
                <Input.Password placeholder="비밀번호" style={{ height: 48 }} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  danger
                  onClick={showConfirmation} // 팝업 열기
                  style={{ width: "100%", height: 40 }}
                  htmlType="button" // 기본 제출 방지
                >
                  회원 탈퇴
                </Button>
              </Form.Item>
            </Form>
          </div>
        </FlexContainer>

        <Modal
          title="회원 탈퇴 확인"
          visible={showModal}
          onOk={() => {
            closeConfirmation();

            const form = document.forms[0] as HTMLFormElement;
            if (form) {
              form.dispatchEvent(new Event("submit", { bubbles: true }));
            }
          }}
          onCancel={closeConfirmation}
          okText="탈퇴하기"
          cancelText="취소"
          okButtonProps={{ danger: true, loading }}
        >
          <Text>
            정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Text>
        </Modal>
      </Container>
    </Layout>
  );
};

export default DeleteAccountPage;
