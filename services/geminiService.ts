import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "") {
      console.warn("Gemini API Key missing.");
      return "AI insights unavailable. Please configure your API_KEY.";
    }

    const ai = new GoogleGenAI({ apiKey });

    // Create a concise prompt context
    const prompt = `
      Act as a witty weather reporter.
      Location: ${data.location.city}.
      Condition: ${data.current.condition}, ${data.current.temp}°C.
      Humidity: ${data.current.humidity}%.
      Wind: ${data.current.windSpeed} km/h.
      
      Give me a 2-sentence update:
      1. One sentence about the current vibe.
      2. One practical tip (clothing or activity).
      Keep it short and fun.
    `;

    // Use the correct model for text tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Weather looks good, enjoy your day!";

  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return "AI is taking a nap. Enjoy the weather anyway!";
  }
};