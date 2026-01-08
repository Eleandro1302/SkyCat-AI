import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    // Verificação ultra-segura para evitar crash no navegador
    let apiKey = '';
    
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    } else if (typeof window !== 'undefined' && (window as any).VITE_API_KEY) {
      apiKey = (window as any).VITE_API_KEY;
    }
    
    if (!apiKey || apiKey === '') {
      return "O clima em " + data.location.city + " está variando. Use roupas em camadas para se adaptar!";
    }

    const ai = new GoogleGenAI({ apiKey });
    const locationContext = data.location.city;

    const prompt = `
      Dados meteorológicos atuais em ${locationContext}:
      Condição: ${data.current.condition}, Temperatura: ${data.current.temp}°C.
      Umidade: ${data.current.humidity}%.
      
      Escreva um relatório meteorológico curto e bem-humorado em português (máximo 2 frases).
      Inclua uma dica prática de vestuário adequada para estas condições.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Aproveite o seu dia com este clima!";

  } catch (error: any) {
    console.warn("Erro ao gerar insight IA:", error);
    return "O tempo em " + data.location.city + " reserva surpresas agradáveis. Prepare-se para aproveitar!";
  }
};