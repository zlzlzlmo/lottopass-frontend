/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import postcssPxtorem from "postcss-pxtorem";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https:
      process.env.NODE_ENV === "development" // 개발 환경에서만 HTTPS 활성화
        ? {
            key: fs.readFileSync("./localhost-key.pem"),
            cert: fs.readFileSync("./localhost.pem"),
          }
        : undefined,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@api": path.resolve(__dirname, "src/api"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@context": path.resolve(__dirname, "src/context"),
      "@features": path.resolve(__dirname, "src/features"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/variables";
          @import "@/styles/functions";
        `, // 변수와 함수 파일 자동 import
      },
    },
    postcss: {
      plugins: [
        postcssPxtorem({
          rootValue: 16, // 1rem = 16px
          unitPrecision: 5, // rem 값의 소수점 자리수
          propList: ["*", "!border*"], // 변환할 속성. border 제외
          selectorBlackList: [], // 변환 제외할 클래스
          replace: true, // 기존 px 값을 rem으로 대체
          mediaQuery: false, // 미디어 쿼리 내 px 변환
          minPixelValue: 1, // 최소 px 값 (1px 이하는 변환하지 않음)
        }),
      ],
    },
  },
  // server: {
  //   host: true, // 외부에서 접속 가능하도록 설정
  //   port: 5173, // 기본 포트
  // },
  build: {
    outDir: "dist", // Vite의 기본 출력 폴더
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // index.html을 기본 엔트리로 설정
      },
    },
  },
  optimizeDeps: {
    include: ["antd", "react-qr-reader"],
  },
});
