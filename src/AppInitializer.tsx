import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser, clearUser } from "@/features/auth/authSlice";
import { authService } from "./api";
import LogoLoading from "./components/common/loading/LogoLoading";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { registerServiceWorker } from "@/hooks/usePWA";
import { PWAInstallPrompt, PWAOfflineIndicator } from "@/components/PWAInstallPrompt";
import { supabase } from "@/lib/supabase/client";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { user: supabaseUser, loading: supabaseLoading } = useSupabaseAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Supabase 사용자가 있으면 프로필 정보 가져오기
        if (supabaseUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();
          
          if (profile) {
            dispatch(setUser({
              id: profile.id,
              email: profile.email,
              nickname: profile.nickname || undefined,
            }));
          }
        } else {
          // 레거시 토큰 체크
          const token = localStorage.getItem('accessToken');
          if (token) {
            try {
              const response = await authService.getMe();
              dispatch(setUser(response));
            } catch (error) {
              console.error("레거시 인증 실패:", error);
              localStorage.removeItem('accessToken');
              dispatch(clearUser());
            }
          } else {
            dispatch(clearUser());
          }
        }
      } catch (error) {
        console.error("인증 초기화 실패:", error);
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    };

    if (!supabaseLoading) {
      initializeAuth();
    }
  }, [dispatch, supabaseUser, supabaseLoading]);

  // Service Worker 등록
  useEffect(() => {
    // 프로덕션 환경에서만 Service Worker 등록
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        registerServiceWorker()
          .then(registration => {
            console.log('Service Worker 등록 성공');
            
            // 주기적 백그라운드 동기화 등록
            if ('sync' in ServiceWorkerRegistration.prototype) {
              (registration as any).sync.register('sync-lottery-results')
                .catch((err: Error) => console.log('백그라운드 동기화 등록 실패:', err));
            }
          })
          .catch(error => {
            console.error('Service Worker 등록 실패:', error);
          });
      });
    }
  }, []);

  // 앱 업데이트 확인
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service Worker가 업데이트되면 페이지 새로고침
        window.location.reload();
      });
    }
  }, []);

  // 온라인/오프라인 상태 변경 감지
  useEffect(() => {
    const handleOnline = () => {
      console.log('온라인 상태');
      // 오프라인 동안 쌓인 작업 처리
      if ('sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          return (registration as any).sync.register('offline-sync');
        });
      }
    };

    const handleOffline = () => {
      console.log('오프라인 상태');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading || supabaseLoading) {
    return (
      <>
        <LogoLoading text="잠시만 기다려주세요" />
      </>
    );
  }

  return (
    <>
      {children}
      <PWAInstallPrompt />
      <PWAOfflineIndicator />
    </>
  );
};

export default AppInitializer;
