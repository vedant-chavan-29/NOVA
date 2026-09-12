import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function backendApiPlugin() {
  return {
    name: 'backend-api-plugin',
    async configureServer(server) {
      try {
        const { apiMiddleware } = await import('./server/apiMiddleware.js')
        server.middlewares.use(apiMiddleware)
      } catch (err) {
        console.warn('[Vite Plugin] Dev API middleware warning:', err.message)
      }
    },
    async configurePreviewServer(server) {
      try {
        const { apiMiddleware } = await import('./server/apiMiddleware.js')
        server.middlewares.use(apiMiddleware)
      } catch (err) {
        console.warn('[Vite Plugin] Preview API middleware warning:', err.message)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/fast2sms': {
        target: 'https://www.fast2sms.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fast2sms/, '')
      }
    }
  }
})

