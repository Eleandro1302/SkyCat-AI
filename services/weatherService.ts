import { WeatherData, HourlyForecast, DailyForecast, Alert } from '../types';

// WMO Weather interpretation codes (WW)
const getWeatherCondition = (code: number): { condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Storm' | 'Partly Cloudy' | 'Snow', description: string } => {
  if (code === 0) return { condition: 'Sunny', description: 'Clear sky' };
  if (code === 1) return { condition: 'Sunny', description: 'Mainly clear' };
  if (code === 2) return { condition: 'Partly Cloudy', description: 'Partly cloudy' };
  if (code === 3) return { condition: 'Cloudy', description: 'Overcast' };
  if ([45, 48].includes(code)) return { condition: 'Cloudy', description: 'Fog' };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Rain', description: 'Drizzle' };
  if ([61, 63, 65, 66, 67].includes(code)) return { condition: 'Rain', description: 'Rain' };
  if ([71, 73, 75, 77].includes(code)) return { condition: 'Snow', description: 'Snow' }; 
  if ([80, 81, 82].includes(code)) return { condition: 'Rain', description: 'Showers' };
  if ([85, 86].includes(code)) return { condition: 'Snow', description: 'Snow showers' };
  if ([95, 96, 99].includes(code)) return { condition: 'Storm', description: 'Thunderstorm' };
  
  return { condition: 'Sunny', description: 'Clear' };
};

// --- MOCK DATA GENERATOR (Fallback) ---
const getMockData = (city: string): WeatherData => {
  console.warn("Using Mock Data for fallback");
  return {
    location: { city: city || "Demo City", district: "Offline Mode", lat: 0, lng: 0 },
    current: {
      temp: 22, feelsLike: 24, humidity: 65, windSpeed: 12, uvIndex: 4,
      condition: 'Partly Cloudy', description: 'Partly cloudy (Demo Data)',
      aqi: 45, pollenLevel: 'Moderate',
      pollutants: { pm2_5: 10, pm10: 20, no2: 15, o3: 30, so2: 5 }
    },
    hourly: Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`, temp: 20 + Math.sin(i/3)*5, precipChance: 10, condition: i > 12 ? 'Rain' : 'Sunny'
    })) as HourlyForecast[],
    daily: Array.from({ length: 7 }).map((_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      minTemp: 18, maxTemp: 26, precipChance: i % 3 === 0 ? 60 : 0,
      condition: i % 3 === 0 ? 'Rain' : 'Sunny'
    })) as DailyForecast[],
    alerts: [{
      id: 'demo-alert', severity: 'moderate', title: 'Data Mode: Offline',
      description: 'Unable to fetch live data. Showing demonstration mode.', issuedAt: 'Now'
    }]
  };
};

export const fetchWeatherData = async (lat: number, lng: number, city: string, district?: string): Promise<WeatherData> => {
  // 1. Weather Forecast API
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  // 2. Air Quality API
  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto`;

  try {
    // Fetch both in parallel
    const [weatherRes, airQualityRes] = await Promise.all([
      fetch(weatherUrl).catch(e => null),
      fetch(airQualityUrl).catch(e => null)
    ]);

    if (!weatherRes || !weatherRes.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    const data = await weatherRes.json();
    
    // Process Air Quality Data (Safely)
    let aqi = 30;
    let pollenLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low';
    let pollutants = { pm2_5: 0, pm10: 0, no2: 0, o3: 0, so2: 0 };

    if (airQualityRes && airQualityRes.ok) {
      try {
        const aqData = await airQualityRes.json();
        if (aqData.current) {
          aqi = aqData.current.european_aqi || 30;
          pollutants = {
            pm2_5: aqData.current.pm2_5 || 0,
            pm10: aqData.current.pm10 || 0,
            no2: aqData.current.nitrogen_dioxide || 0,
            o3: aqData.current.ozone || 0,
            so2: aqData.current.sulphur_dioxide || 0
          };
          
          const pollenTypes = ['alder_pollen', 'birch_pollen', 'grass_pollen', 'mugwort_pollen', 'olive_pollen', 'ragweed_pollen'];
          let maxPollen = 0;
          pollenTypes.forEach((key: string) => {
            const val = aqData.current[key];
            if (typeof val === 'number' && val > maxPollen) maxPollen = val;
          });
          if (maxPollen >= 200) pollenLevel = 'Very High';
          else if (maxPollen >= 50) pollenLevel = 'High';
          else if (maxPollen >= 10) pollenLevel = 'Moderate';
        }
      } catch (e) {
        console.warn("AQI parse error, using defaults");
      }
    }

    const currentCondition = getWeatherCondition(data.current.weather_code);
    
    const hourly: HourlyForecast[] = data.hourly.time.slice(0, 24).map((timeStr: string, index: number) => {
      const date = new Date(timeStr);
      const hours = date.getHours().toString().padStart(2, '0');
      const cond = getWeatherCondition(data.hourly.weather_code[index]);
      return {
        time: `${hours}:00`,
        temp: Math.round(data.hourly.temperature_2m[index]),
        precipChance: data.hourly.precipitation_probability[index],
        condition: cond.condition
      };
    });

    const daily: DailyForecast[] = data.daily.time.map((timeStr: string, index: number) => {
      const date = new Date(`${timeStr}T00:00:00`); 
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
    const code = data.current.weather_code;
    const windSpeed = data.current.wind_speed_10m;
    const precip = data.current.precipitation;
    const temp = data.current.temperature_2m;

    if ([95, 96, 99].includes(code)) alerts.push({ id: 'storm-alert', severity: 'severe', title: 'Thunderstorm Warning', description: 'Seek shelter.', issuedAt: 'Now' });
    if ([71, 73, 75, 77, 85, 86].includes(code)) alerts.push({ id: 'snow-alert', severity: 'moderate', title: 'Snow Advisory', description: 'Roads slippery.', issuedAt: 'Now' });
    if (windSpeed > 40) alerts.push({ id: 'wind-alert', severity: windSpeed > 60 ? 'severe' : 'moderate', title: 'High Wind', description: `Gusts ${windSpeed} km/h.`, issuedAt: 'Now' });
    if (precip > 5) alerts.push({ id: 'rain-alert', severity: 'moderate', title: 'Heavy Rain', description: `${precip}mm rain.`, issuedAt: 'Now' });
    if (temp > 35) alerts.push({ id: 'heat-alert', severity: 'extreme', title: 'Heat Warning', description: 'Stay hydrated.', issuedAt: 'Now' });
    if (aqi > 60) alerts.push({ id: 'aqi-alert', severity: aqi > 80 ? 'severe' : 'moderate', title: 'Poor Air Quality', description: `AQI: ${aqi}`, issuedAt: 'Now' });

    return {
      location: { city, district: district || '', lat, lng },
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        uvIndex: 5, 
        condition: currentCondition.condition,
        description: currentCondition.description,
        aqi, pollenLevel, pollutants
      },
      hourly, daily, alerts
    };

  } catch (error) {
    console.error("Error fetching weather data, switching to fallback:", error);
    // FALLBACK: Return mock data so the app doesn't crash
    return getMockData(city);
  }
};