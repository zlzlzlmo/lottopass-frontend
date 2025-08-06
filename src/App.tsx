// React 관련
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 외부 라이브러리
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 상태 관리
import { fetchAllDraws } from "@features/draw/drawSlice";
import { useAppDispatch } from "@/redux/hooks";

// 컨텍스트 및 프로바이더
import { SupabaseAuthProvider } from "@/context/SupabaseAuthContext";

// 페이지 컴포넌트
import {
  AllStoresPage,
  DetailPage,
  HistoryPage,
  HomePage,
  NotFound,
  NumberGenerationPage,
  ResultPage,
  StatisticPage,
  WinningStoresPage,
} from "@pages";
import SignupPage from "@pages/signup/SignupPage";
import LoginPage from "@pages/login/LoginPage";
import UserProfileUpdatePage from "@pages/auth/UserProfileUpdatePage";
import MyPage from "@pages/my/MyPage";
import DeleteAccountPage from "@pages/auth/DeleteAccountPage";
import FindPasswordPage from "@pages/findPassword/FindPasswordPage";
import DashboardPage from "@pages/dashboard/DashboardPage";

// 공통 컴포넌트
import ScrollToTop from "@components/common/scroll/ScrollToTop";
import AppInitializer from "@/AppInitializer";
import AuthGuard from "@/AuthGuard";

// 상수 및 스타일
import { ROUTES } from "@/constants/routes";
import "@/styles/global.scss";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const routes = [
    { path: ROUTES.HOME.path, element: <HomePage /> },
    { path: ROUTES.NUMBER_GENERATION.path, element: <NumberGenerationPage /> },
    { path: ROUTES.WINNING_STORES.path, element: <WinningStoresPage /> },
    { path: ROUTES.HISTORY.path, element: <HistoryPage /> },
    { path: ROUTES.HISTORY_DETAIL.path, element: <DetailPage /> },
    { path: ROUTES.ALL_STORES.path, element: <AllStoresPage /> },
    { path: ROUTES.RESULT.path, element: <ResultPage /> },
    { path: ROUTES.STATISTIC.path, element: <StatisticPage /> },
    { path: ROUTES.SIGNUP.path, element: <SignupPage /> },
    { path: ROUTES.LOGIN.path, element: <LoginPage /> },
    { path: ROUTES.FIND_PASSWORD.path, element: <FindPasswordPage /> },
    {
      path: ROUTES.UPDATE_PROFILE.path,
      element: (
        <AuthGuard>
          <UserProfileUpdatePage />
        </AuthGuard>
      ),
    },
    {
      path: ROUTES.MYPAGE.path,
      element: (
        <AuthGuard>
          <MyPage />
        </AuthGuard>
      ),
    },
    {
      path: ROUTES.DELETE_ACCOUNT.path,
      element: (
        <AuthGuard>
          <DeleteAccountPage />
        </AuthGuard>
      ),
    },

    {
      path: ROUTES.DASHBOARD.path,
      element: (
        <AuthGuard>
          <DashboardPage />
        </AuthGuard>
      ),
    },
    { path: "*", element: <NotFound /> },
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllDraws());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppInitializer>
            <ScrollToTop />
            {/* <AppInitializer> */}
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </AppInitializer>
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
