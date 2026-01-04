import { WeatherData, HourlyForecast, DailyForecast, Alert } from '../types';

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
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

export const fetchWeatherData = async (lat: number, lng: number, city: string, district?: string): Promise<WeatherData> => {
  // 1. Weather Forecast API
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  // 2. Air Quality API (AQI + Pollen + Pollutants)
  // Added: pm10, pm2_5, nitrogen_dioxide, ozone, sulphur_dioxide
  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto`;

  try {
    // Fetch both in parallel
    const [weatherRes, airQualityRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(airQualityUrl)
    ]);

    if (!weatherRes.ok) throw new Error('Weather data fetch failed');
    const data = await weatherRes.json();

    // Process Air Quality Data
    let aqi = 30; // Default
    let pollenLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low';
    
    // Default pollutants
    let pollutants = {
      pm2_5: 0,
      pm10: 0,
      no2: 0,
      o3: 0,
      so2: 0
    };

    if (airQualityRes.ok) {
      const aqData = await airQualityRes.json();
      if (aqData.current) {
        aqi = aqData.current.european_aqi || 30;
        
        // Map pollutants
        pollutants = {
          pm2_5: aqData.current.pm2_5 || 0,
          pm10: aqData.current.pm10 || 0,
          no2: aqData.current.nitrogen_dioxide || 0,
          o3: aqData.current.ozone || 0,
          so2: aqData.current.sulphur_dioxide || 0
        };

        // Calculate generic Pollen Level based on max of all available types
        const pollenTypes = ['alder_pollen', 'birch_pollen', 'grass_pollen', 'mugwort_pollen', 'olive_pollen', 'ragweed_pollen'];
        let maxPollen = 0;
        
        pollenTypes.forEach((key: string) => {
          const val = aqData.current[key];
          if (typeof val === 'number' && val > maxPollen) {
            maxPollen = val;
          }
        });

        // Simple scale for display purposes (grains/m³)
        if (maxPollen >= 200) pollenLevel = 'Very High';
        else if (maxPollen >= 50) pollenLevel = 'High';
        else if (maxPollen >= 10) pollenLevel = 'Moderate';
      }
    }

    const currentCondition = getWeatherCondition(data.current.weather_code);
    
    // Process Hourly Data (next 24h)
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

    // Process Daily Data (next 7 days)
    const daily: DailyForecast[] = data.daily.time.map((timeStr: string, index: number) => {
      // Ensure we parse the date correctly regardless of timezone issues by appending T00:00
      const date = new Date(`${timeStr}T00:00:00`); 
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const cond = getWeatherCondition(data.daily.weather_code[index]);

      return {
        day: days[date.getDay()],
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        precipChance: data.daily.precipitation_probability_max?.[index] || 0, // Map probability
        condition: cond.condition
      };
    });

    // Generate alerts based on real data conditions
    const alerts: Alert[] = [];
    const code = data.current.weather_code;
    const windSpeed = data.current.wind_speed_10m;
    const precip = data.current.precipitation;
    const temp = data.current.temperature_2m;

    // 1. Storm Alerts
    if ([95, 96, 99].includes(code)) {
      alerts.push({
        id: 'storm-alert',
        severity: 'severe',
        title: 'Thunderstorm Warning',
        description: 'Thunderstorms detected in the area. Seek shelter and avoid open areas.',
        issuedAt: 'Now'
      });
    }

    // 2. Snow/Ice Alerts
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      alerts.push({
        id: 'snow-alert',
        severity: 'moderate',
        title: 'Snow & Ice Advisory',
        description: 'Snowfall detected. Roads may be slippery. Drive with caution.',
        issuedAt: 'Now'
      });
    }

    // 3. High Wind Alerts
    if (windSpeed > 40) {
      alerts.push({
        id: 'wind-alert',
        severity: windSpeed > 60 ? 'severe' : 'moderate',
        title: 'High Wind Warning',
        description: `Current wind speeds are high (${windSpeed} km/h). Secure loose items outside.`,
        issuedAt: 'Now'
      });
    }

    // 4. Heavy Rain
    if (precip > 5) {
      alerts.push({
        id: 'rain-alert',
        severity: 'moderate',
        title: 'Heavy Rain Detected',
        description: `Significant precipitation (${precip}mm). Visibility may be reduced.`,
        issuedAt: 'Now'
      });
    }

    // 5. Extreme Heat
    if (temp > 35) {
      alerts.push({
        id: 'heat-alert',
        severity: 'extreme',
        title: 'Excessive Heat Warning',
        description: `Temperatures are very high (${temp}°C). Stay hydrated and avoid direct sun.`,
        issuedAt: 'Now'
      });
    }

    // 6. Freezing Conditions
    if (temp < 0) {
      alerts.push({
        id: 'freeze-alert',
        severity: 'moderate',
        title: 'Freeze Warning',
        description: `Temperatures are below freezing (${temp}°C). Protect plants and pets.`,
        issuedAt: 'Now'
      });
    }

    // 7. Pollen Alert
    if (pollenLevel === 'Very High') {
      alerts.push({
        id: 'pollen-alert',
        severity: 'moderate',
        title: 'High Pollen Count',
        description: 'Pollen levels are very high today. Allergy sufferers should take precautions.',
        issuedAt: 'Now'
      });
    }

    // 8. Poor Air Quality Alert
    if (aqi > 60) {
       alerts.push({
        id: 'aqi-alert',
        severity: aqi > 80 ? 'severe' : 'moderate',
        title: 'Poor Air Quality',
        description: `Air quality index is ${aqi}. Sensitive groups should reduce outdoor exertion.`,
        issuedAt: 'Now'
      });
    }

    // Return formatted data
    return {
      location: {
        city,
        district: district || '',
        lat,
        lng
      },
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        uvIndex: 5, 
        condition: currentCondition.condition,
        description: currentCondition.description,
        aqi, // Real AQI from Air Quality API
        pollenLevel,
        pollutants
      },
      hourly,
      daily,
      alerts
    };

  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};