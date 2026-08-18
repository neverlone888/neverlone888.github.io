import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // opencv.js 体积很大且不需要热更新，避免文件监视导致崩溃
      ignored: ["**/public/opencv/**"],
    },
  },
})