import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getImageOptimizerPlugin } from './image-optimizer.config.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), getImageOptimizerPlugin()],
})
