import { WeatherData, HourlyForecast, DailyForecast, Alert } from '../types';

const getWeatherCondition = (code: number): { condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Storm' | 'Partly Cloudy' | 'Snow', description: string } => {
  if (code === 0) return { condition: 'Sunny', description: 'Céu limpo' };
  if (code === 1) return { condition: 'Sunny', description: 'Predominantemente limpo' };
  if (code === 2) return { condition: 'Partly Cloudy', description: 'Parcialmente nublado' };
  if (code === 3) return { condition: 'Cloudy', description: 'Encoberto' };
  if ([45, 48].includes(code)) return { condition: 'Cloudy', description: 'Nevoeiro' };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Rain', description: 'Garoa' };
  if ([61, 63, 65, 66, 67].includes(code)) return { condition: 'Rain', description: 'Chuva' };
  if ([71, 73, 75, 77].includes(code)) return { condition: 'Snow', description: 'Neve' }; 
  if ([80, 81, 82].includes(code)) return { condition: 'Rain', description: 'Pancadas de chuva' };
  if ([85, 86].includes(code)) return { condition: 'Snow', description: 'Pancadas de neve' };
  if ([95, 96, 99].includes(code)) return { condition: 'Storm', description: 'Tempestade' };
  
  return { condition: 'Sunny', description: 'Limpo' };
};

export const getMockData = (city: string): WeatherData => {
  return {
    location: { city, district: "Modo Demonstração", lat: -23.55, lng: -46.63 },
    current: {
      temp: 24, feelsLike: 26, humidity: 60, windSpeed: 10, uvIndex: 5,
      condition: 'Sunny', description: 'Céu Limpo (Dados de Backup)',
      aqi: 40, pollenLevel: 'Low',
      pollutants: { pm2_5: 8, pm10: 15, no2: 10, o3: 25, so2: 5 }
    },
    hourly: Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`, temp: 22 + Math.sin(i/4)*4, precipChance: 5, condition: 'Sunny'
    })) as HourlyForecast[],
    daily: Array.from({ length: 7 }).map((_, i) => ({
      day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][(new Date().getDay() + i) % 7],
      minTemp: 18, maxTemp: 28, precipChance: 0, condition: 'Sunny'
    })) as DailyForecast[],
    alerts: []
  };
};

export const fetchWeatherData = async (lat: number, lng: number, city: string, district?: string): Promise<WeatherData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide&timezone=auto`;

  try {
    const [weatherRes, airQualityRes] = await Promise.all([
      fetch(weatherUrl, { signal: controller.signal }),
      fetch(airQualityUrl, { signal: controller.signal }).catch(() => null)
    ]);

    clearTimeout(timeoutId);

    if (!weatherRes.ok) throw new Error('Weather fetch failed');
    const data = await weatherRes.json();
    
    let aqi = 35;
    let pollutants = { pm2_5: 0, pm10: 0, no2: 0, o3: 0, so2: 0 };

    if (airQualityRes && airQualityRes.ok) {
      const aqData = await airQualityRes.json();
      aqi = aqData.current?.european_aqi || 35;
      pollutants = {
        pm2_5: aqData.current?.pm2_5 || 0,
        pm10: aqData.current?.pm10 || 0,
        no2: aqData.current?.nitrogen_dioxide || 0,
        o3: aqData.current?.ozone || 0,
        so2: aqData.current?.sulphur_dioxide || 0
      };
    }

    const currentCondition = getWeatherCondition(data.current.weather_code);
    
    const hourly = data.hourly.time.slice(0, 24).map((timeStr: string, index: number) => {
      const hours = new Date(timeStr).getHours().toString().padStart(2, '0');
      const cond = getWeatherCondition(data.hourly.weather_code[index]);
      return {
        time: `${hours}:00`,
        temp: Math.round(data.hourly.temperature_2m[index]),
        precipChance: data.hourly.precipitation_probability[index],
        condition: cond.condition
      };
    });

    const daily = data.daily.time.map((timeStr: string, index: number) => {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const date = new Date(`${timeStr}T00:00:00`);
      const cond = getWeatherCondition(data.daily.weather_code[index]);
      return {
        day: days[date.getDay()],
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        precipChance: data.daily.precipitation_probability_max?.[index] || 0,
        condition: cond.condition
      };
    });

    const alerts: Alert[] = [];
    if (data.current.wind_speed_10m > 50) alerts.push({ id: 'w1', severity: 'severe', title: 'Ventos Fortes', description: 'Rajadas acima de 50km/h.', issuedAt: 'Agora' });

    return {
      location: { city, district: district || '', lat, lng },
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        uvIndex: 4,
        condition: currentCondition.condition,
        description: currentCondition.description,
        aqi, pollenLevel: 'Low', pollutants
      },
      hourly, daily, alerts
    };
  } catch (error) {
    console.error("Critical fetch error:", error);
    return getMockData(city);
  }
};