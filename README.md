# 🌤️ SkyCast AI

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **Hyperlocal weather intelligence powered by Google Gemini.**  
> A next-generation weather dashboard that combines precision data with AI-generated insights.

---

## 🚀 GitHub Pages Deployment Guide

Since this app uses an API Key, you cannot simply push the `.env` file to GitHub (it is insecure and ignored by git). To make it work on GitHub Pages, follow these steps:

### Option 1: Using GitHub Actions (Recommended)

1.  Go to your repository **Settings** > **Secrets and variables** > **Actions**.
2.  Click **New repository secret**.
3.  Name: `API_KEY`
4.  Value: Paste your Google Gemini API Key.
5.  In your GitHub Actions workflow file (e.g., `.github/workflows/deploy.yml`), ensure you pass the secret to the build command:
    ```yaml
    - run: npm run build
      env:
        API_KEY: ${{ secrets.API_KEY }}
    ```

### Option 2: Manual Build & Deploy

If you are manually building the `dist` folder to push to a `gh-pages` branch:

1.  Ensure you have a `.env` file locally with `API_KEY=your_key`.
2.  Run `npm run build`.
3.  Deploy the contents of the `dist` folder.

---

## 🛠️ Tech Stack

*   **React 19**
*   **Vite 6** (Configured with `base: './'` for relative paths)
*   **Google Gemini API** (`gemini-1.5-flash` model)
*   **Tailwind CSS**
*   **Open-Meteo API**

---

## 📦 Local Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Eleandro1302/skycast-ai.git
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the App**
    ```bash
    npm run dev
    ```

---

## 👨‍💻 Author

<div align="center">

### **Eleandro Mangrich**

Designed and Developed with ❤️ and ☕.

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge&logo=github)](https://github.com/Eleandro1302)

</div>