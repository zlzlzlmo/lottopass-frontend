import { FormInstance } from "antd";

export const useEmailVerification = (
  formRef: React.RefObject<FormInstance>
) => {
  // const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  // const [emailVerified, setEmailVerified] = useState(false);
  // const [verificationCode, setVerificationCode] = useState("");
  // const [verificationLoading, setVerificationLoading] = useState(false);
  // const [codeVerificationLoading, setCodeVerificationLoading] = useState(false);

  const getEmailValue = () => {
    if (!formRef.current) return;
    const values = formRef.current.getFieldsValue(["email", "domain"]);
    const email =
      values.domain === "custom"
        ? values.email
        : `${values.email}@${values.domain}`;

    return email;
  };

  // const handleSendVerification = async () => {
  //   if (!formRef.current) return;

  //   const email = getEmailValue();

  //   setVerificationLoading(true);
  //   try {
  //     const success = await authService.requestEmailVerification(email);
  //     if (success) {
  //       message.success("인증 메일이 발송되었습니다. 메일을 확인해주세요.");
  //       setEmailVerificationSent(true);
  //     } else {
  //       message.error("인증 메일 발송에 실패했습니다. 다시 시도해주세요.");
  //     }
  //   } catch {
  //     message.error("오류가 발생했습니다. 다시 시도해주세요.");
  //     resetVerificationState("code");
  //   } finally {
  //     setVerificationLoading(false);
  //   }
  // };

  // const handleVerifyCode = async () => {
  //   if (!formRef.current) return;

  //   const email = getEmailValue();

  //   setCodeVerificationLoading(true);
  //   try {
  //     const success = await authService.verifyEmailCode(
  //       email,
  //       verificationCode
  //     );
  //     if (success) {
  //       message.success("이메일 인증이 완료되었습니다.");
  //       setEmailVerified(true);
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     message.error(`${error.message}`);
  //   } finally {
  //     setCodeVerificationLoading(false);
  //   }
  // };

  return {
    getEmailValue,
  };
};
