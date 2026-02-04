import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
const apiUrl = process.env.API_URL || 'http://localhost:3010';
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Verkenners',
        short_name: 'Verkenners',
        theme_color: '#ffffff',
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: apiUrl, // Your backend API URL
        changeOrigin: true,
       // rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          // Log the request being forwarded
          proxy.on('proxyReq', (_proxyReq, req) => {
            // eslint-disable-next-line no-console
            console.log(`Proxying request to: ${req.url}`);
          });
        },
      },
    },
  }
});
