import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    historyApiFallback: true,
    host: "0.0.0.0", // 允许从局域网访问
    proxy: {
      // 添加代理配置，解决开发环境下的跨域问题
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // 添加构建配置
  build: {
    // 生成 _redirects 文件
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // 确保生成正确的资源路径
    assetsDir: "assets",
    // 确保生成 _redirects 文件
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
