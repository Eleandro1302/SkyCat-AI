import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    // CRITICAL for GitHub Pages: Use relative paths for assets
    base: './', 
    plugins: [react()],
    define: {
      // Polyfill process.env for compatibility with the existing code structure
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});