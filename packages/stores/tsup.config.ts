import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'zustand', 'immer', '@supabase/supabase-js'],
  minify: process.env.NODE_ENV === 'production',
  platform: 'browser'
});