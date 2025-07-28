import React from 'react';
import { lazyWithRetry, lazyWithPreload } from '@/utils/lazyWithRetry';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 로딩 컴포넌트
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  </div>
);

// Suspense Wrapper
export const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense fallback={<PageLoader />}>
    {children}
  </React.Suspense>
);

// 페이지 컴포넌트 동적 임포트 (재시도 로직 포함)
export const HomePage = lazyWithRetry(
  () => import('@/pages/home/HomePage'),
  { maxRetries: 3 }
);

export const LoginPage = lazyWithRetry(
  () => import('@/pages/login/LoginPage')
);

export const SignupPage = lazyWithRetry(
  () => import('@/pages/signup/SignupPage')
);

export const DashboardPage = lazyWithRetry(
  () => import('@/pages/dashboard/DashboardPage')
);

// 프리로드 가능한 페이지
export const StatisticPage = lazyWithPreload(
  () => import('@/pages/statistic/StatisticPage')
);

export const NumberGenerationPage = lazyWithPreload(
  () => import('@/pages/numberGeneration/NumberGenerationPage')
);

export const HistoryPage = lazyWithPreload(
  () => import('@/pages/history/HistoryPage')
);

export const WinningStoresPage = lazyWithPreload(
  () => import('@/pages/winningStores/WinningStoresPage')
);

// 세부 페이지
export const DetailPage = lazyWithRetry(
  () => import('@/pages/detail/DetailPage')
);

export const MyPage = lazyWithRetry(
  () => import('@/pages/my/MyPage')
);

export const ResultPage = lazyWithRetry(
  () => import('@/pages/result/ResultPage')
);

// 인증 관련 페이지
export const FindPasswordPage = lazyWithRetry(
  () => import('@/pages/findPassword/FindPasswordPage')
);

export const ResetPasswordPage = lazyWithRetry(
  () => import('@/pages/auth/ResetPasswordPage')
);

export const CallbackPage = lazyWithRetry(
  () => import('@/pages/auth/CallbackPage')
);

// 프리로드 함수들
export const preloadStatistics = () => StatisticPage.preload();
export const preloadNumberGeneration = () => NumberGenerationPage.preload();
export const preloadHistory = () => HistoryPage.preload();
export const preloadWinningStores = () => WinningStoresPage.preload();

// 라우트 기반 프리로드
export const preloadRouteComponents = (pathname: string) => {
  switch (pathname) {
    case '/':
      // 홈에서는 자주 사용되는 페이지들을 프리로드
      preloadStatistics();
      preloadNumberGeneration();
      break;
    case '/statistics':
      // 통계 페이지에서는 관련 페이지 프리로드
      preloadHistory();
      break;
    case '/number-generation':
      // 번호 생성 페이지에서는 결과 페이지 프리로드
      ResultPage.preload?.();
      break;
  }
};

// 청크 프리로드 유틸리티
export const preloadChunks = async (chunkNames: string[]) => {
  const promises = chunkNames.map(chunkName => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'script';
      link.href = `/assets/${chunkName}.js`;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  });
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.warn('Failed to preload some chunks:', error);
  }
};