import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: "/", // cần để "/" nếu deploy root domain
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001", // chỉ dùng khi dev local
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
  },
}));
