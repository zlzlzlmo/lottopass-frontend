import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import { AppProviders } from "@/components/providers/AppProviders";
import { ROUTES } from "@/constants/routes";
import AuthGuard from "@/AuthGuard";
import { 
  SuspenseWrapper,
  HomePage,
  LoginPage,
  SignupPage,
  DashboardPage,
  StatisticPage,
  NumberGenerationPage,
  HistoryPage,
  WinningStoresPage,
  DetailPage,
  MyPage,
  ResultPage,
  FindPasswordPage,
  ResetPasswordPage,
  CallbackPage,
  preloadRouteComponents
} from "@/routes/LazyRoutes";
import NotFound from "@/pages/notFound/NotFound";
import ScrollToTop from "@/components/common/scroll/ScrollToTop";

// 라우트 프리로더 컴포넌트
const RoutePreloader: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // 현재 경로에 따라 관련 컴포넌트 프리로드
    preloadRouteComponents(location.pathname);
  }, [location.pathname]);
  
  return null;
};

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <RoutePreloader />
      <Routes>
        {/* Public Routes */}
        <Route 
          path={ROUTES.HOME.path} 
          element={
            <SuspenseWrapper>
              <HomePage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.LOGIN.path} 
          element={
            <SuspenseWrapper>
              <LoginPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.SIGNUP.path} 
          element={
            <SuspenseWrapper>
              <SignupPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.FIND_PASSWORD.path} 
          element={
            <SuspenseWrapper>
              <FindPasswordPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.RESET_PASSWORD.path} 
          element={
            <SuspenseWrapper>
              <ResetPasswordPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.CALLBACK.path} 
          element={
            <SuspenseWrapper>
              <CallbackPage />
            </SuspenseWrapper>
          } 
        />
        
        {/* Feature Routes */}
        <Route 
          path={ROUTES.STATISTICS.path} 
          element={
            <SuspenseWrapper>
              <StatisticPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.NUMBER_GENERATION.path} 
          element={
            <SuspenseWrapper>
              <NumberGenerationPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.HISTORY.path} 
          element={
            <SuspenseWrapper>
              <HistoryPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.WINNING_STORES.path} 
          element={
            <SuspenseWrapper>
              <WinningStoresPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.DETAIL.path} 
          element={
            <SuspenseWrapper>
              <DetailPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path={ROUTES.RESULT.path} 
          element={
            <SuspenseWrapper>
              <ResultPage />
            </SuspenseWrapper>
          } 
        />
        
        {/* Protected Routes */}
        <Route
          path={ROUTES.DASHBOARD.path}
          element={
            <AuthGuard>
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.MY.path}
          element={
            <AuthGuard>
              <SuspenseWrapper>
                <MyPage />
              </SuspenseWrapper>
            </AuthGuard>
          }
        />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;