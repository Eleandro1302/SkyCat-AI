
import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';
import { getLocale } from '../utils/i18n';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    let apiKey = '';
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    } else if (typeof window !== 'undefined' && (window as any).VITE_API_KEY) {
      apiKey = (window as any).VITE_API_KEY;
    }
    
    if (!apiKey) return "";

    const ai = new GoogleGenAI({ apiKey });
    const locale = getLocale();
    const languageName = locale === 'pt' ? 'Portuguese' : 'English';

    const prompt = `
      Weather data for ${data.location.city}:
      Condition: ${data.current.condition} (${data.current.description}), Temp: ${data.current.temp}°C.
      Humidity: ${data.current.humidity}%.
      
      Write a very short, clever weather insight in ${languageName} (max 2 sentences).
      Include a practical clothing tip for these specific conditions.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "";

  } catch (error: any) {
    return "";
  }
};
