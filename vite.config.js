import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handleApiRequest } from './server/api.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            try {
              await handleApiRequest(req, res);
            } catch (err) {
              console.error('API Server Middleware Error:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            }
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
  }
})
