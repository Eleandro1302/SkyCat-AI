import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // CRITICAL for GitHub Pages: Use relative paths for assets
    base: './', 
    plugins: [react()],
    define: {
      // Robustly polyfill process.env for browser compatibility
      // We define the specific key string replacement first
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // We define process.env object fallback to prevent "cannot read property of undefined"
      'process.env': JSON.stringify({}),
      // We define global process to prevent "process is not defined"
      'process': JSON.stringify({ env: {} }),
    }
  };
});