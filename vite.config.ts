import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    base: './', // CRITICAL: Ensures assets load on GitHub Pages
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      'process.env': {} // Polyfill to prevent crashes in some libs
    }
  };
});