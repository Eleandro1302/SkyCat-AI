
import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

export const generateWeatherInsight = async (data: WeatherData): Promise<string> => {
  try {
    // A chave é injetada via Vite 'define' em process.env.API_KEY
    if (!process.env.API_KEY || process.env.API_KEY === '') {
      console.warn("API_KEY não configurada. Verifique os Secrets do GitHub Actions.");
      return "Dica: Mantenha-se hidratado e aproveite o dia!";
    }

    // Fix: Always use new GoogleGenAI({apiKey: process.env.API_KEY}); as per the SDK guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const locationContext = data.location.city === 'Current Location' 
      ? `sua localização atual`
      : data.location.city;

    const prompt = `
      Dados meteorológicos atuais em ${locationContext}:
      Condição: ${data.current.condition}, Temperatura: ${data.current.temp}°C.
      Umidade: ${data.current.humidity}%.
      
      Escreva um relatório meteorológico muito curto e bem-humorado em português (máximo 2 frases).
      Inclua uma dica prática de vestuário.
    `;

    // Fix: Use simple string contents and correct model name according to task type (Basic Text Tasks: gemini-3-flash-preview).
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Fix: Access the .text property directly (it is a getter, not a function).
    return response.text || "Aproveite o clima hoje!";

  } catch (error: any) {
    console.error("Erro no Gemini:", error);
    return "O tempo parece interessante hoje! Prepare-se para qualquer mudança.";
  }
};
