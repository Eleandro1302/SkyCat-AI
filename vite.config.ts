import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // IMPORTANTE PARA GITHUB PAGES: 
    // Define caminhos relativos para que os assets carreguem corretamente em subdiretórios (/nome-do-repo/)
    base: './', 
    plugins: [react()],
    define: {
      // Injeta a API Key durante o build. 
      // No GitHub Actions, isso virá dos Secrets do repositório.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      // Previne crash de bibliotecas que acessam 'process'
      'process.env': {},
    }
  };
});