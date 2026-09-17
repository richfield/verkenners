import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
const apiUrl = process.env.API_URL || 'http://localhost:3010';
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Verkenners',
        short_name: 'Verkenners',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ]
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: apiUrl, // Your backend API URL
        changeOrigin: true,
        configure: (proxy) => {
          // Log the request being forwarded
          proxy.on('proxyReq', (_proxyReq, req) => {
            // eslint-disable-next-line no-console
            console.log(`Proxying request to: ${req.url}`);
          });
        },
      },
    },
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
        },
      },
    },
  },
});
