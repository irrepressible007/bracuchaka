import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

      '/api/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

      '/api/users': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

      '/api/vehicles': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

      '/api/admin': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

      '/api/rides': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});