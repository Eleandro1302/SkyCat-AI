import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração padrão e simples para Vite + React + GitHub Pages
export default defineConfig({
  base: './', // CRUCIAL: Permite que o site rode em subpastas (ex: usuario.github.io/repo)
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
});