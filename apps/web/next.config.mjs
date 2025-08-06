import { withTamagui } from '@tamagui/next-plugin';
import { join } from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
    '@supabase/ssr',
    '@supabase/supabase-js',
    '@supabase/postgrest-js',
    '@supabase/storage-js',
    '@supabase/realtime-js',
    '@supabase/auth-js',
    '@supabase/functions-js',
  ],
  experimental: {
    optimizePackageImports: ['@tamagui/core'],
  },
  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    };
    
    // Handle Node.js modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: false,
        crypto: false,
        buffer: false,
        http: false,
        https: false,
        url: false,
        util: false,
        process: false,
        zlib: false,
        querystring: false,
        path: false,
        fs: false,
        net: false,
        tls: false,
        assert: false,
      };
      
      // Define process.env for client-side
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env),
          'global': 'globalThis',
        })
      );
      
      // Provide browser polyfills
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
      
      // Handle @supabase modules
      config.module.rules.push({
        test: /\.m?js$/,
        include: /node_modules\/@supabase/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      });
    }
    
    // Add polyfills for React 19 compatibility
    config.module.rules.push({
      test: /node_modules[\/\\]react-native-web[\/\\]/,
      loader: 'string-replace-loader',
      options: {
        multiple: [
          {
            search: "import { hydrate as domLegacyHydrate } from 'react-dom';",
            replace: "const domLegacyHydrate = () => { console.warn('hydrate is deprecated in React 19'); };",
          },
          {
            search: "import { unmountComponentAtNode } from 'react-dom';",
            replace: "const unmountComponentAtNode = () => { console.warn('unmountComponentAtNode is deprecated in React 19'); };",
          },
        ],
      },
    });
    
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

// export default bundleAnalyzer(tamaguiPlugin(nextConfig));
export default bundleAnalyzer(nextConfig);