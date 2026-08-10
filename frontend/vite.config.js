import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Matches TripMate AI's app.py, which runs uvicorn on 127.0.0.1:8000
      // and exposes POST /api/travel.
      '/api': {
        target: 'https://trip-planner-ai-with-multi-agents-1.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
