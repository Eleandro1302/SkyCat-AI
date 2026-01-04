import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './', 
    plugins: [react()],
    define: {
      // Safely polyfill process for browser
      'process.env': {}, // Define as empty object first to avoid undefined errors
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      // Define a minimal process global object to satisfy libraries checking `typeof process`
      'process': JSON.stringify({ env: { API_KEY: env.API_KEY || "" } })
    }
  };
});