import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './', // CRITICAL for GitHub Pages
    plugins: [react()],
    define: {
      // Robustly inject the API key
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      // Polyfill for libraries expecting node env
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  };
});