import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './', // Ensures assets load correctly on GitHub Pages or subdirectories
    plugins: [react()],
    define: {
      // This string replacement is safer than polyfilling the entire process object
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  };
});