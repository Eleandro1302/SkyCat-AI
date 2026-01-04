import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    // Access safely via the defined replacement
    const apiKey = process.env.API_KEY;
    
    // Check if key is missing or empty string (common in production if secrets aren't set)
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "") {
      console.warn("Gemini API Key is missing. Insights disabled.");
      return "AI insights unavailable (Add API_KEY to settings).";
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
    
    if (error.message?.includes("404")) {
      return "AI temporarily unavailable.";
    }
    if (error.message?.includes("400") || error.message?.includes("API key")) {
      return "Invalid API configuration.";
    }
    
    return "Weather looks interesting today! (AI Offline)";
  }
};