# 🌤️ SkyCast AI

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

> **Hyperlocal weather intelligence powered by Google Gemini.**  
> A next-generation weather dashboard that combines precision data with AI-generated insights, interactive visualizations, and a sleek glassmorphism UI.

---

## 🚀 Features

*   **🤖 AI Weather Insights:** Witty, context-aware weather summaries and clothing recommendations generated dynamically by **Google Gemini AI**.
*   **❄️ Immersive Weather Effects:** Full-screen atmospheric animations (rain, snow, thunderstorms) that react instantly to live weather conditions for a deeply engaging experience.
*   **📍 Smart Location Persistence:** Intelligently remembers your location preferences, allowing for automatic, one-tap access to your local weather on return visits.
*   **🌍 Hyperlocal Precision:** Automatic geolocation or city search using OpenStreetMap Nominatim.
*   **🌩️ Interactive Radar Simulation:** A custom-built CSS & Canvas animation engine overlaying OpenStreetMap to visualize rain, snow, and storms.
*   **📊 Dynamic Data Visualization:** Interactive hourly forecast charts using **Recharts**.
*   **🍃 Air Quality & Pollen:** Real-time tracking of AQI, PM2.5, PM10, and pollen levels for health-conscious users.
*   **⚠️ Severe Weather Alerts:** Prominent warnings for storms, extreme heat, freezing conditions, and high winds.
*   **🎨 Adaptive UI:** Beautiful dark-mode interface with weather-aware animations and gradients.

---

## 🛠️ Tech Stack

This project leverages the latest in modern web development technologies:

### **Frontend Core**
*   **React 19:** Utilizing the latest hooks and functional components for a responsive state management.
*   **TypeScript:** For type-safe code and robust development.
*   **Vite / ES Modules:** Fast build tool and optimized bundling.

### **Styling & UI**
*   **Tailwind CSS:** Utility-first CSS framework for rapid, responsive design.
*   **Lucide React:** Beautiful, consistent iconography.
*   **Recharts:** Composable charting library for React.

### **Artificial Intelligence**
*   **Google Gemini API (`@google/genai`):** The brain behind the app. It analyzes raw weather data to generate human-like summaries and advice (e.g., "Grab an umbrella, it's looking moody out there").

### **Data APIs**
*   **Open-Meteo:** The primary source for weather forecasts, historical data, air quality, and pollen counts.
*   **OpenStreetMap (Nominatim):** Used for geocoding (converting city names to coordinates) and reverse geocoding (GPS to city names).

---

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/skycast-ai.git
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your Google Gemini API Key:
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

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/eleandro-mangrich)

</div>