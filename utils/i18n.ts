
export type Locale = 'pt' | 'en';

const translations = {
  pt: {
    loadingTitle: "Sintonizando Satélites",
    loadingSub: "Buscando sua localização...",
    skipToLondon: "Pular para Londres",
    searchPlaceholder: "Pesquisar cidade...",
    riskAlert: "Alerta de Risco",
    thermalFlow: "Fluxo Térmico 12h",
    nextDays: "Próximos Dias",
    feelsLike: "Sensação de",
    wind: "Vento",
    humidity: "Umidade",
    uvIndex: "Índice UV",
    airQuality: "Qualidade do Ar",
    pollen: "Pólen",
    liveRadar: "RADAR AO VIVO",
    precipChance: "CHANCE DE",
    rain: "CHUVA",
    snow: "NEVE",
    aiInsightTitle: "SkyCast AI Insight",
    establishingData: "Analisando clima com IA...",
    precisionMode: "Modo de Precisão",
    standardView: "Vista Padrão",
    aqiStatus: {
      good: "Bom",
      fair: "Aceitável",
      moderate: "Moderado",
      poor: "Ruim",
      veryPoor: "Muito Ruim"
    },
    pollenLevels: {
      low: "Baixo",
      moderate: "Médio",
      high: "Alto",
      veryHigh: "Crítico"
    },
    conditions: {
      sunny: "Ensolarado",
      cloudy: "Nublado",
      rain: "Chuva",
      storm: "Tempestade",
      partlyCloudy: "Parcialmente Nublado",
      snow: "Neve",
      fog: "Nevoeiro",
      drizzle: "Garoa"
    }
  },
  en: {
    loadingTitle: "Tuning Satellites",
    loadingSub: "Seeking your location...",
    skipToLondon: "Skip to London",
    searchPlaceholder: "Search city...",
    riskAlert: "Severe Alert",
    thermalFlow: "Thermal Flow 12h",
    nextDays: "Next Days",
    feelsLike: "Feels like",
    wind: "Wind",
    humidity: "Humidity",
    uvIndex: "UV Index",
    airQuality: "Air Quality",
    pollen: "Pollen",
    liveRadar: "LIVE RADAR",
    precipChance: "CHANCE OF",
    rain: "RAIN",
    snow: "SNOW",
    aiInsightTitle: "SkyCast AI Insight",
    establishingData: "AI Weather Analysis...",
    precisionMode: "Precision Mode",
    standardView: "Standard View",
    aqiStatus: {
      good: "Good",
      fair: "Fair",
      moderate: "Moderate",
      poor: "Poor",
      veryPoor: "Very Poor"
    },
    pollenLevels: {
      low: "Low",
      moderate: "Moderate",
      high: "High",
      veryHigh: "Very High"
    },
    conditions: {
      sunny: "Sunny",
      cloudy: "Cloudy",
      rain: "Rain",
      storm: "Storm",
      partlyCloudy: "Partly Cloudy",
      snow: "Snow",
      fog: "Fog",
      drizzle: "Drizzle"
    }
  }
};

export const getLocale = (): Locale => {
  const lang = navigator.language.split('-')[0];
  return lang === 'pt' ? 'pt' : 'en';
};

export const t = () => translations[getLocale()];
