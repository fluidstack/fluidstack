import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
  publicDir: false,
  optimizeDeps: {
    include: ['bootstrap/dist/css/bootstrap.min.css', 'bootstrap/dist/js/bootstrap.bundle.min.js', 'jquery'],
  },
  server: {
    proxy: {
      '/php': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },
});
