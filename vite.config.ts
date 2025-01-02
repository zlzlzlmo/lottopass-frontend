import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import postcssPxtorem from "postcss-pxtorem";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // @로 src 경로 참조
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
  server: {
    host: true, // 외부에서 접속 가능하도록 설정
    port: 5173, // 기본 포트
  },
  build: {
    outDir: "dist", // Vite의 기본 출력 폴더
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // index.html을 기본 엔트리로 설정
      },
    },
  },
});
