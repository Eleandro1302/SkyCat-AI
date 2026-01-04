import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

let genAI: GoogleGenAI | null = null;

const getAIClient = () => {
  if (genAI) return genAI;

  try {
    // O Vite substitui process.env.API_KEY pelo valor real durante o build.
    // Se estiver no GitHub Pages sem a Secret configurada, isso pode ser uma string vazia.
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
    return "AI insights unavailable (API Key missing/invalid).";
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
    // Usamos 'gemini-1.5-flash' pois é o modelo estável padrão.
    // Modelos 'experimental' ou 'latest' frequentemente mudam de nome ou ficam indisponíveis.
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    return response.text || "Insight unavailable.";
  } catch (error: any) {
    // Melhor tratamento de erro para debug no console do navegador
    console.error("Gemini API Error details:", error);
    if (error.message?.includes("404")) {
        return "AI Model temporarily unavailable (404).";
    }
    if (error.message?.includes("400") || error.message?.includes("API key")) {
        return "Invalid API Key configuration.";
    }
    return "AI service temporarily unavailable.";
  }
};