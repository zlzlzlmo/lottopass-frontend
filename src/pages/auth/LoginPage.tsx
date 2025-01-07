import React from "react";
import { Button, Space, Card } from "antd";
import Layout from "@/components/layout/Layout";

interface LoginButtonProps {
  provider: string;
  label: string;
  style: React.CSSProperties;
  logo?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  provider,
  label,
  style,
  logo,
}) => {
  const handleLogin = () => {
    const backendUrl = "http://localhost:3000";
    window.location.href = `${backendUrl}/auth/${provider}`;
  };

  return (
    <Button
      style={{
        ...style,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 입체감 추가
        borderRadius: 8, // 버튼에 곡선 추가
        height: 50,
      }}
      block
      onClick={handleLogin}
    >
      {logo && (
        <img
          src={logo}
          alt={`${provider} logo`}
          style={{ width: 24, marginRight: 12 }}
        />
      )}
      {label}
    </Button>
  );
};

const LoginPage: React.FC = () => {
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
          <Space direction="vertical" style={{ width: "100%" }}>
            <LoginButton
              provider="google"
              label="Google로 로그인"
              style={{
                background: "white",
                border: "1px solid #dadce0",
                color: "#3c4043",
                fontWeight: "500",
              }}
              logo="https://developers.google.com/identity/images/g-logo.png"
            />
            <LoginButton
              provider="kakao"
              label="Kakao로 로그인"
              style={{
                background: "#fee500",
                border: "none",
                color: "#000000",
                fontWeight: "500",
              }}
              logo="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
            />
            <LoginButton
              provider="naver"
              label="Naver로 로그인"
              style={{
                background: "#03C75A",
                border: "none",
                color: "#ffffff",
                fontWeight: "500",
              }}
              logo="https://static.nid.naver.com/oauth/small_g_in.PNG"
            />
          </Space>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
