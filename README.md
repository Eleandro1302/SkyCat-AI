# 🌤️ SkyCast AI

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Parcel](https://img.shields.io/badge/parcel-build-yellow.svg?style=for-the-badge)

> **Hyperlocal weather intelligence powered by Google Gemini.**  
> A next-generation weather dashboard combining precision data with AI insights.

---

## 🚀 Como fazer Deploy no GitHub Pages

Este projeto agora usa **Parcel**, que é muito mais simples para deployments estáticos.

### Opção 1: GitHub Actions (Automático - Recomendado)

1.  Vá em **Settings** > **Secrets and variables** > **Actions** do seu repositório.
2.  Crie um secret chamado `API_KEY` com sua chave do Google Gemini.
3.  No seu arquivo de workflow (`.yml`), use:
    ```yaml
    - run: npm install
    - run: npm run build
      env:
        API_KEY: ${{ secrets.API_KEY }}
    ```

### Opção 2: Manual

1.  Tenha um arquivo `.env` na raiz com: `API_KEY=sua_chave_aqui`
2.  Rode o comando de build:
    ```bash
    npm run build
    ```
3.  Isso criará uma pasta `dist`. Envie o conteúdo dessa pasta para o GitHub Pages.

---

## 📦 Instalação Local

1.  **Clone o repositório**
2.  **Instale as dependências**
    ```bash
    npm install
    ```
3.  **Configure a Chave**
    Crie um arquivo `.env` na raiz:
    ```env
    API_KEY=sua_chave_gemini_aqui
    ```
4.  **Rode o App**
    ```bash
    npm start
    ```
    O app abrirá em `http://localhost:1234`

---

## 🛠️ Tecnologias

*   **React 19**
*   **Parcel** (Zero Config Bundler)
*   **Google Gemini API**
*   **Tailwind CSS**
*   **Open-Meteo API**
