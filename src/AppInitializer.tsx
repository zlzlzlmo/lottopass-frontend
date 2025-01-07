import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser, clearUser } from "@/features/auth/authSlice";
import { authService } from "./api";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getMe();

        dispatch(setUser(response));
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        dispatch(clearUser());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
