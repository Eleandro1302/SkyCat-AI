import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './', // Important for GitHub Pages
    plugins: [react()],
    define: {
      // Prevents "process is not defined" error in browser
      'process.env': JSON.stringify(env), 
      // Specifically ensure API_KEY is available
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "")
    }
  };
});