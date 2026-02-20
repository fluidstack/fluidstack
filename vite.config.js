import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy.html',
      },
    },
  },
  publicDir: 'public',
  server: {
    proxy: {
      '/php': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },
});
