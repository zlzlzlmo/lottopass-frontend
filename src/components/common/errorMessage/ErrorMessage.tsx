import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onGoHome,
}) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Result
        status="error"
        title="오류 발생"
        subTitle={message || "데이터를 불러오는 중 문제가 발생했습니다."}
        extra={[
          <Button
            key="home"
            type="primary"
            onClick={onGoHome || (() => navigate("/"))}
          >
            홈으로 돌아가기
          </Button>,
          <Button
            key="retry"
            onClick={onRetry || (() => window.location.reload())}
          >
            다시 시도하기
          </Button>,
        ]}
      />
    </Layout>
  );
};

export default ErrorMessage;
