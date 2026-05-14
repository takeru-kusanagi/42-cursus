import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
    },
    fs: {
      allow: [
        '.', 
        '../shared'
      ],
    },
    proxy: {
      '/api': {
        target: 'http://backend:4000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});