import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// import mkcert from 'vite-plugin-mkcert' // Disabled for HTTP development

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // mkcert() // Disabled - using HTTP for development
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // Allow connections from network
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.1.2:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
