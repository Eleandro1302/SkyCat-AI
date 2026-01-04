import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './', // CRITICAL: Ensures assets load on GitHub Pages
    plugins: [react()],
    define: {
      // Safely inject the API key. 
      // Vite will replace 'process.env.API_KEY' with the string value during build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      // Prevents "process is not defined" error in some 3rd party libs
      'process.env.NODE_ENV': JSON.stringify(mode), 
    }
  };
});