import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/* Guideline: Define __dirname for ESM compatibility to support path resolution */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Unique Build ID to force filename changes and bypass any stale caches
    const buildId = Date.now().toString();

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        '__BUILD_ID__': JSON.stringify(buildId)
      },
      build: {
        emptyOutDir: true,
        rollupOptions: {
          output: {
            entryFileNames: `assets/[name]-${buildId}.js`,
            chunkFileNames: `assets/[name]-${buildId}.js`,
            assetFileNames: `assets/[name]-${buildId}.[ext]`
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});