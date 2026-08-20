import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署：使用相对路径，保证子目录下资源也能正常加载
  base: "./",
  plugins: [react()],
  server: {
    watch: {
      // opencv.js 体积很大且不需要热更新，避免文件监视导致崩溃
      ignored: ["**/public/opencv/**"],
    },
  },
})