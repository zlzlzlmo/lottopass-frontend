import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser, clearUser } from "@/features/auth/authSlice";
import { authService } from "./api";
import LogoLoading from "./components/common/loading/LogoLoading";
import { useNavigate } from "react-router-dom";
import { redirectPathStorage } from "./utils/storage";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getMe();
        dispatch(setUser(response));
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const redirectPath = redirectPathStorage.get();
    redirectPathStorage.remove();
    navigate(redirectPath ?? "/");
  }, [dispatch]);

  if (isLoading) {
    return (
      <>
        <LogoLoading text="잠시만 기다려주세요" />
      </>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
