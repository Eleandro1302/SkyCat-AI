import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    base: './', // Essential for GitHub Pages relative paths
    plugins: [react()],
    define: {
      // Safely inject the API key. 
      // Vite will replace 'process.env.API_KEY' with the string value during build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "")
    }
  };
});