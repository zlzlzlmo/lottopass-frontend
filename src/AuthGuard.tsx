import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "./redux/hooks";
import { message } from "antd";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    message.destroy();
    message.error("로그인 권한이 필요합니다. 로그인 후 이용해주시길 바랍니다.");
    return <Navigate to={ROUTES.LOGIN.path} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
