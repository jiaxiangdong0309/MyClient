import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    historyApiFallback: true,
  },
  // 添加构建配置
  build: {
    // 生成 _redirects 文件
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
