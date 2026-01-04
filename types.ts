export interface WeatherLocation {
  city: string;
  district: string;
  lat: number;
  lng: number;
}

export interface HourlyForecast {
  time: string; // HH:00
  temp: number;
  precipChance: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Storm' | 'Partly Cloudy' | 'Snow';
}

export interface DailyForecast {
  day: string;
  minTemp: number;
  maxTemp: number;
  precipChance: number; // Added precipitation probability
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Storm' | 'Partly Cloudy' | 'Snow';
}

export interface Alert {
  id: string;
  severity: 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  issuedAt: string;
}

export interface Pollutants {
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Storm' | 'Partly Cloudy' | 'Snow';
  description: string;
  aqi: number; // Air Quality Index
  pollenLevel: 'Low' | 'Moderate' | 'High' | 'Very High'; // Added Pollen Level
  pollutants: Pollutants; // Detailed pollutants
}

export interface WeatherData {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: Alert[];
}

export enum AppState {
  ONBOARDING,
  LOADING,
  DASHBOARD,
  ERROR
}