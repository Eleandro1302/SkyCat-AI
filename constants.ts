// Real coordinates for default cities
export const CITY_COORDINATES: Record<string, {lat: number, lng: number}> = {
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Lisbon': { lat: 38.7223, lng: -9.1393 },
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'London': { lat: 51.5074, lng: -0.1278 }
};

export const DEFAULT_CITIES = Object.keys(CITY_COORDINATES);