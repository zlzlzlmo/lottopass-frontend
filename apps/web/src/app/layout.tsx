import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// import { NextTamaguiProvider } from './NextTamaguiProvider';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://lottopass.com'),
  title: 'LottoPass - 로또 통계 및 번호 생성',
  description: '똑똑한 로또 번호 생성과 당첨 통계 분석 서비스',
  keywords: ['로또', '로또번호생성', '로또통계', '로또당첨', '로또분석'],
  authors: [{ name: 'LottoPass Team' }],
  openGraph: {
    title: 'LottoPass - 로또 통계 및 번호 생성',
    description: '똑똑한 로또 번호 생성과 당첨 통계 분석 서비스',
    url: 'https://lottopass.com',
    siteName: 'LottoPass',
    images: [
      {
        url: '/lotto-share.jpg',
        width: 1200,
        height: 630,
        alt: 'LottoPass',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LottoPass - 로또 통계 및 번호 생성',
    description: '똑똑한 로또 번호 생성과 당첨 통계 분석 서비스',
    images: ['/lotto-share.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
