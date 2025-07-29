import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-native', 'react-native-web', 'tamagui'],
  minify: true,
  esbuildOptions(options) {
    options.conditions = ['module'];
    options.mainFields = ['module', 'main'];
  },
});