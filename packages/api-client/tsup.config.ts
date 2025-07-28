import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', '@tanstack/react-query', 'axios', 'ky'],
  minify: process.env.NODE_ENV === 'production'
});