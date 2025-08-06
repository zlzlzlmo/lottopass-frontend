'use client';

import { ApiProvider } from '@lottopass/api-client';
import { useAuthStore } from '@lottopass/stores';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      // Validate token with API
      // This would be handled by the API client
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApiProvider enableDevtools={process.env.NODE_ENV === 'development'}>
        {children}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          duration={3000}
          className="font-pretendard"
        />
      </ApiProvider>
    </ThemeProvider>
  );
}