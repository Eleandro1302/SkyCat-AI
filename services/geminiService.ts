import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    // PADRÃO VITE: Para expor variáveis no frontend, elas devem começar com VITE_
    // e são acessadas via import.meta.env
    const apiKey = import.meta.env.VITE_API_KEY;
    
    if (!apiKey) {
      console.warn("VITE_API_KEY não encontrada. Insights desativados.");
      return "AI insights unavailable (Configure VITE_API_KEY).";
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