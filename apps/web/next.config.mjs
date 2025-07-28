import { withTamagui } from '@tamagui/next-plugin';
import { join } from 'path';

const tamaguiPlugin = withTamagui({
  config: '@lottopass/ui/src/theme/config',
  components: ['@lottopass/ui'],
  appDir: true,
  outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
  disableExtraction: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@lottopass/ui',
    '@lottopass/shared',
    '@lottopass/stores',
    '@lottopass/api-client',
    'react-native-web',
    'react-native-svg',
    'react-native-safe-area-context',
  ],
  experimental: {
    optimizePackageImports: ['@tamagui/core'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default tamaguiPlugin(nextConfig);