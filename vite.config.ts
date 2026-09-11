// vite.config.ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy for Overpass API switched to a reliable mirror
      '/api/overpass': {
        target: 'https://overpass.kumi.systems',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/overpass/, '/api'),
        headers: {
          'User-Agent': 'NorwegianTrailExplorer/1.0 (Educational Project)',
        },
      },
    },
  },
});
