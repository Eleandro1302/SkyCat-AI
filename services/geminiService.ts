import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    // Check for API Key safely
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "" || typeof apiKey !== 'string') {
      return "AI insights disabled (API Key missing). Add your key to get witty weather reports!";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    // Using gemini-3-flash-preview for maximum stability/availability
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Enjoy the weather!";

  } catch (error: any) {
    console.error("Gemini Safe Error:", error);
    
    // Graceful fallbacks for common errors
    if (error.message?.includes("404")) {
      return "AI temporarily unavailable (Model Not Found).";
    }
    if (error.message?.includes("400") || error.message?.includes("API key")) {
      return "Please check your API Key configuration.";
    }
    
    return "Weather looks interesting today! (AI Offline)";
  }
};