import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

// Define process.env for TypeScript to avoid "Cannot find name 'process'" error
declare const process: {
  env: {
    API_KEY?: string;
  }
};

let genAI: GoogleGenAI | null = null;

const getAIClient = () => {
  if (genAI) return genAI;

  try {
    // Check if process is defined (browser safety) and API_KEY exists
    // We treat empty strings or undefined as missing keys
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || "";
    
    if (!apiKey || apiKey.trim() === "" || apiKey === "undefined") {
      console.warn("API_KEY is missing or invalid. AI features disabled.");
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
    return "AI insights unavailable. Please add your API Key to the project settings to enable smart recommendations.";
  }

  const locationContext = data.location.city === 'Current Location' 
    ? `Current Location (Coordinates: ${data.location.lat}, ${data.location.lng})`
    : data.location.city;

  const prompt = `
    You are a witty, helpful personal weather assistant app named "SkyCast".
    The current weather data for ${locationContext} is:
    - Condition: ${data.current.condition}
    - Temp: ${data.current.temp}°C (Feels like ${data.current.feelsLike}°C)
    - Humidity: ${data.current.humidity}%
    - Wind: ${data.current.windSpeed} km/h
    - UV Index: ${data.current.uvIndex}
    - Alerts: ${data.alerts.length > 0 ? data.alerts[0].title : "None"}

    Provide a short, 2-sentence insight. 
    1st sentence: Summary of the vibe based on the location/weather.
    2nd sentence: Recommendation (clothing, activity, or safety).
    Keep it modern and slightly fun.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Unable to generate insight right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Weather data loaded, but AI service is temporarily unavailable.";
  }
};