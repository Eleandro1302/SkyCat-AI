import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // CRITICAL for GitHub Pages: Use relative paths for assets so they load in subdirectories
    base: './', 
    plugins: [react()],
    define: {
      // Define global process to prevent "process is not defined" errors in browser
      'process.env': {},
      // Specifically inject the API Key. 
      // Note: GitHub Actions must expose this secret to the build environment.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});