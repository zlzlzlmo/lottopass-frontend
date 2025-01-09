import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/features/auth/authSlice";
import LogoLoading from "@/components/common/loading/LogoLoading";

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const processUserData = () => {
      try {
        const params = new URLSearchParams(location.search);
        const user = params.get("user");

        if (user) {
          const parsedUser = JSON.parse(decodeURIComponent(user));

          dispatch(setUser(parsedUser));

          const redirectPath = sessionStorage.getItem("redirectPath");
          navigate(redirectPath ?? "/");
          sessionStorage.removeItem("redirectPath");
        } else {
          throw new Error("User data is missing in the URL.");
        }
      } catch (error) {
        console.error("Error processing user data:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        navigate("/login");
      }
    };

    processUserData();
  }, [dispatch, navigate, location]);

  return (
    <Layout>
      <LogoLoading text="로그인 중입니다. 잠시만 기다려주세요" />
    </Layout>
  );
};

export default CallbackPage;
