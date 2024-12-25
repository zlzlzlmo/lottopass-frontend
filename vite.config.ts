import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables";`, // 변수 파일 경로
      },
    },
  },
  server: {
    host: true, // 외부에서 접속 가능하도록 설정
    port: 5173, // 기본 포트
  },
});
