import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // ESSENCIAL PARA GITHUB PAGES:
    // Define o caminho base como relativo para que os assets carreguem
    // independentemente do nome do repositório/subpasta.
    base: './', 
    
    plugins: [react()],
    
    define: {
      // Injeta a API Key de forma segura no código buildado
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      // Garante compatibilidade com bibliotecas que verificam NODE_ENV
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // Desabilita sourcemaps em produção para economizar espaço
    }
  };
});