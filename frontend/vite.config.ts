import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'
import path             from 'path'
import { all } from 'axios'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
    allowedHosts: ['rene-preflagellated-maida.ngrok-free.dev']
  },
})
