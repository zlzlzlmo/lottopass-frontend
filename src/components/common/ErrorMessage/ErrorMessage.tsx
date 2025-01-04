import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

interface ErrorMessageProps {
  message?: string; // 서버에서 전달된 에러 메시지
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Result
        status="error"
        title="오류 발생"
        subTitle={message || "데이터를 불러오는 중 문제가 발생했습니다."}
        extra={[
          <Button key="home" type="primary" onClick={() => navigate("/")}>
            홈으로 돌아가기
          </Button>,
          <Button key="retry" onClick={() => window.location.reload()}>
            다시 시도하기
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorMessage;
