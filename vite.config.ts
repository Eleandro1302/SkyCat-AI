import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './', 
    plugins: [react()],
    define: {
      // Substitui process.env.API_KEY diretamente pelo valor da string durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      // Previne crash se alguma biblioteca tentar acessar 'process' diretamente
      'process.env': {},
    }
  };
});