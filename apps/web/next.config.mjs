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
      
      // Ignore node-specific modules in browser
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(@supabase\/node-fetch|node-fetch|stream|http|https|url|whatwg-url|zlib|querystring)$/,
        })
      );
      
      // Provide empty modules for @supabase/node-fetch
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /@supabase\/node-fetch/,
          join(process.cwd(), 'src/lib/empty-module.js')
        )
      );
      
      // Replace process.env references
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
          'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
        })
      );
      
      // Provide polyfills for node-fetch
      config.plugins.push(
        new webpack.ProvidePlugin({
          fetch: ['node-fetch', 'default'],
        })
      );
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