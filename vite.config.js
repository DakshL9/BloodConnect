import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/bd/',
  plugins: [react()],
  server: {
    port: 8000,
    strictPort: true,
  },
  preview: {
    port: 8000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
});

