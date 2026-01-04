import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

let genAI: GoogleGenAI | null = null;

const getAIClient = () => {
  if (genAI) return genAI;

  try {
    // Vite substitui process.env.API_KEY pela string durante o build.
    // Verificamos se é uma string válida e não vazia.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length === 0) {
      console.warn("API_KEY is missing. AI features disabled.");
      return null;
    }
    
    genAI = new GoogleGenAI({ apiKey });
    return genAI;
  } catch (error) {
    console.error("Error initializing Gemini Client:", error);
    return null;
  }
};

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  const ai = getAIClient();
  
  if (!ai) {
    return "AI insights unavailable (API Key missing).";
  }

  const locationContext = data.location.city === 'Current Location' 
    ? `Current Location`
    : data.location.city;

  const prompt = `
    The current weather for ${locationContext} is:
    Condition: ${data.current.condition}
    Temp: ${data.current.temp}°C (Feels: ${data.current.feelsLike}°C)
    Wind: ${data.current.windSpeed} km/h
    Humidity: ${data.current.humidity}%
    
    Give a 2-sentence witty weather report.
    1. A fun observation about the vibe.
    2. A practical tip (clothes/activity).
  `;

  try {
    // Usando gemini-1.5-flash para garantir compatibilidade e evitar erro 404
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    return response.text || "Insight unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI service temporarily unavailable.";
  }
};