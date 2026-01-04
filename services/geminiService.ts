import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "") {
      return "AI insights unavailable (API Key not configured).";
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

    // Updated to the latest recommended model for text tasks
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