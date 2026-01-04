import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

// Declaração simples para TypeScript não reclamar do process.env
declare var process: {
  env: {
    API_KEY: string;
  };
};

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    // O Parcel substituirá process.env.API_KEY pelo valor real no momento do build
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey.trim() === "") {
      console.warn("API Key ausente. Adicione API_KEY ao seu arquivo .env ou Secrets do GitHub.");
      return "AI insights unavailable (Configure API_KEY).";
    }

    const ai = new GoogleGenAI({ apiKey });

    const locationContext = data.location.city === 'Current Location' 
      ? `Current Location`
      : data.location.city;

    const prompt = `
      Current weather in ${locationContext}:
      ${data.current.condition}, ${data.current.temp}°C.
      Humidity: ${data.current.humidity}%.
      
      Write a very short, witty 2-sentence weather report. 
      Include a practical clothing tip.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Enjoy the weather!";

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Weather looks interesting today! (AI Offline)";
  }
};