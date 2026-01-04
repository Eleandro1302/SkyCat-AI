import React, { useState, useEffect } from 'react';
import { Navigation, LocateFixed, Search, AlertCircle } from 'lucide-react';
import { WeatherData, AppState } from './types';
import { CITY_COORDINATES } from './constants';
import { fetchWeatherData } from './services/weatherService';
import CurrentConditions from './components/CurrentConditions';
import ForecastChart from './components/ForecastChart';
import RadarView from './components/RadarView';
import AIWeatherInsight from './components/AIWeatherInsight';
import DailyForecastList from './components/DailyForecastList';
import AirQualityPanel from './components/AirQualityPanel';
import WeatherEffects from './components/WeatherEffects';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tentativa automática de localização ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('skycast_auto_loc');
    if (saved === 'true') {
      handleGrantLocation();
    }
  }, []);

  const loadWeather = async (lat: number, lng: number, name: string, district: string = "") => {
    setAppState(AppState.LOADING);
    setErrorMsg(null);
    try {
      const data = await fetchWeatherData(lat, lng, name, district);
      setWeatherData(data);
      setAppState(AppState.DASHBOARD);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not fetch weather data.");
      setAppState(AppState.ONBOARDING);
    }
  };

  const handleGrantLocation = () => {
    setAppState(AppState.LOADING);
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation not supported.");
      setAppState(AppState.ONBOARDING);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        localStorage.setItem('skycast_auto_loc', 'true');
        // Reverse Geocoding simples para pegar o nome da cidade
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || "My Location";
          loadWeather(pos.coords.latitude, pos.coords.longitude, city, data.address?.suburb);
        } catch {
          loadWeather(pos.coords.latitude, pos.coords.longitude, "Current Location");
        }
      },
      (err) => {
        console.warn(err);
        setErrorMsg("Location access denied. Please search manually.");
        setAppState(AppState.ONBOARDING);
      },
      { timeout: 8000 }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAppState(AppState.LOADING);
    
    // 1. Verifica cidades estáticas
    const staticCity = Object.keys(CITY_COORDINATES).find(k => k.toLowerCase() === searchQuery.toLowerCase());
    if (staticCity) {
      const coords = CITY_COORDINATES[staticCity];
      loadWeather(coords.lat, coords.lng, staticCity);
      return;
    }

    // 2. Busca na API Nominatim
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const place = data[0];
        loadWeather(parseFloat(place.lat), parseFloat(place.lon), place.name || searchQuery);
      } else {
        setErrorMsg("City not found.");
        setAppState(AppState.ONBOARDING);
      }
    } catch {
      setErrorMsg("Search failed. Check internet.");
      setAppState(AppState.ONBOARDING);
    }
  };

  // --- RENDER ---

  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse text-slate-400">Loading SkyCast AI...</p>
      </div>
    );
  }

  if (appState === AppState.ONBOARDING || !weatherData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full relative z-10 text-center space-y-8">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-sky-500 p-3 rounded-2xl shadow-lg shadow-sky-500/20">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">SkyCast AI</h1>
            <p className="text-slate-400">Intelligent weather forecasting.</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Enter city..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-sky-500 focus:outline-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Search City
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-slate-600">
              <div className="h-px bg-slate-700 flex-1"></div>
              <span className="text-xs font-medium">OR</span>
              <div className="h-px bg-slate-700 flex-1"></div>
            </div>

            <button 
              onClick={handleGrantLocation}
              className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LocateFixed className="w-4 h-4" />
              Use Current Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-12 overflow-x-hidden">
      <WeatherEffects condition={weatherData.current.condition} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={() => setAppState(AppState.ONBOARDING)}>
          <div className="bg-sky-500 p-1.5 rounded-lg">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold hidden sm:inline">SkyCast AI</span>
        </div>
        <button 
          onClick={() => setAppState(AppState.ONBOARDING)}
          className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
        >
          <Search className="w-3 h-3" />
          New Search
        </button>
      </nav>

      {/* Main Grid */}
      <main className="container mx-auto px-4 pt-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentConditions data={weatherData} />
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-300 mb-4">24h Temperature</h3>
              <ForecastChart data={weatherData.hourly} />
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-300 mb-4">Live Radar</h3>
              <RadarView 
                condition={weatherData.current.condition} 
                lat={weatherData.location.lat} 
                lng={weatherData.location.lng} 
                precipChance={weatherData.hourly[0]?.precipChance} 
              />
            </div>
          </div>

          {/* Sidebar Right Column */}
          <div className="space-y-6">
            <AIWeatherInsight weatherData={weatherData} />
            <AirQualityPanel data={weatherData.current} />
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-300 mb-4">7-Day Forecast</h3>
              <DailyForecastList data={weatherData.daily} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;