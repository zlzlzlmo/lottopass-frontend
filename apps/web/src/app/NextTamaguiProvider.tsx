'use client';

import '@tamagui/core/reset.css';
// import '@tamagui/font-inter/css/400.css';
// import '@tamagui/font-inter/css/700.css';

import { config } from '@lottopass/ui';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { ToastProvider } from '@tamagui/toast';
import { TamaguiProvider } from 'tamagui';

export function NextTamaguiProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme();

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any);
      }}
    >
      <TamaguiProvider config={config} themeClassNameOnRoot defaultTheme={theme}>
        <ToastProvider swipeDirection="horizontal" duration={6000} native={false}>
          {children}
        </ToastProvider>
      </TamaguiProvider>
    </NextThemeProvider>
  );
}
