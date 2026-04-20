import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'
import path             from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  
  server: {
    port: 5173,
    allowedHosts: ['.ngrok-free.dev', 'localhost', '127.0.0.1'],
    proxy: {
      '/auth': {
        target:       'http://127.0.0.1:4000',
        changeOrigin: true,
        secure:       false,
      },
      '/files': {
        target:       'http://127.0.0.1:4000',
        changeOrigin: true,
        secure:       false,
      },
      '/ai': {
        target:       'http://127.0.0.1:4000',
        changeOrigin: true,
        secure:       false,
      },
      '/uploads': {
        target:       'http://127.0.0.1:4000',
        changeOrigin: true,
        secure:       false,
      },
    },
    
  },
})
