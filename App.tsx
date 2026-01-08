import React, { useState, useRef, useEffect } from 'react';
import { Navigation, ShieldAlert, LocateFixed, Search, X, Linkedin } from 'lucide-react';
import { WeatherData, AppState } from './types';
import { CITY_COORDINATES } from './constants';
import { fetchWeatherData, getMockData } from './services/weatherService';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const savedPreference = localStorage.getItem('skycast_use_location');
      
      if (savedPreference === 'true') {
        if (isMounted) setAppState(AppState.LOADING);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (isMounted) handleLocationFound(pos.coords.latitude, pos.coords.longitude);
          },
          () => {
            if (isMounted) loadDefaultCity();
          },
          { timeout: 4000 }
        );
      } else {
        // Fallback rápido para evitar tela vazia
        const timer = setTimeout(() => {
          if (isMounted && !weatherData) loadDefaultCity();
        }, 2000);
        return () => clearTimeout(timer);
      }
    };
    init();
    return () => { isMounted = false; };
  }, []);

  const loadDefaultCity = () => {
    const defaultCity = "São Paulo";
    const coords = CITY_COORDINATES[defaultCity];
    loadWeather(coords.lat, coords.lng, defaultCity);
  };

  const loadWeather = async (lat: number, lng: number, locationName: string, district?: string) => {
    setAppState(AppState.LOADING);
    try {
      const data = await fetchWeatherData(lat, lng, locationName, district);
      setWeatherData(data);
      setAppState(AppState.DASHBOARD);
      setIsSearchOpen(false);
    } catch (error) {
      console.error("Load weather failed", error);
      setWeatherData(getMockData(locationName));
      setAppState(AppState.DASHBOARD);
    }
  };

  const handleLocationFound = async (latitude: number, longitude: number) => {
    localStorage.setItem('skycast_use_location', 'true');
    let locationName = "Localização Atual";
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      if (response.ok) {
        const data = await response.json();
        locationName = data.address.city || data.address.town || "Minha Localização";
      }
    } catch (e) { console.warn(e); }
    loadWeather(latitude, longitude, locationName);
  };

  const handleGrantLocation = () => {
    if (!navigator.geolocation) {
      loadDefaultCity();
      return;
    }
    setAppState(AppState.LOADING);
    navigator.geolocation.getCurrentPosition(
      (pos) => handleLocationFound(pos.coords.latitude, pos.coords.longitude),
      () => loadDefaultCity(),
      { timeout: 8000 }
    );
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const normalized = searchQuery.trim();
    const predefined = Object.keys(CITY_COORDINATES).find(k => k.toLowerCase() === normalized.toLowerCase());
    
    if (predefined) {
      loadWeather(CITY_COORDINATES[predefined].lat, CITY_COORDINATES[predefined].lng, predefined);
      return;
    }

    setAppState(AppState.LOADING);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(normalized)}&limit=1`);
      const results = await response.json();
      if (results.length > 0) {
        loadWeather(parseFloat(results[0].lat), parseFloat(results[0].lon), results[0].name);
      } else {
        alert("Cidade não encontrada.");
        setAppState(weatherData ? AppState.DASHBOARD : AppState.ONBOARDING);
      }
    } catch (error) {
      setAppState(weatherData ? AppState.DASHBOARD : AppState.ONBOARDING);
    }
  };

  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 animate-pulse font-medium">Sintonizando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 relative overflow-x-hidden">
      {weatherData && <WeatherEffects condition={weatherData.current.condition} />}
      
      <header className="fixed top-0 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.ONBOARDING)}>
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
             <Navigation className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:block">SkyCast AI</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex relative">
              <input 
                ref={searchInputRef}
                type="text" 
                className="bg-slate-800 border border-sky-500 text-white text-sm rounded-lg pl-3 pr-8 py-2 outline-none w-40 sm:w-64"
                placeholder="Buscar cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-4 h-4" /></button>
            </form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors"><Search className="w-5 h-5 text-slate-300" /></button>
          )}
          <button onClick={handleGrantLocation} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-sky-400 transition-colors"><LocateFixed className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-10 max-w-5xl relative z-10">
        {weatherData ? (
          <>
            {weatherData.alerts.length > 0 && (
              <div className="mb-6 space-y-3">
                {weatherData.alerts.map(alert => (
                  <div key={alert.id} className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 flex gap-4 items-center animate-in slide-in-from-top duration-500">
                    <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                      <h3 className="font-bold text-red-200">{alert.title}</h3>
                      <p className="text-sm text-red-300/80">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <CurrentConditions data={weatherData} />
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                  <h3 className="font-semibold text-slate-200 mb-6">Previsão por Hora</h3>
                  <ForecastChart data={weatherData.hourly} />
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                  <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider opacity-60">Visualização de Radar</h3>
                  <RadarView condition={weatherData.current.condition} lat={weatherData.location.lat} lng={weatherData.location.lng} precipChance={weatherData.hourly[0]?.precipChance || 0} />
                </div>
              </div>
              
              <div className="space-y-6">
                <AIWeatherInsight weatherData={weatherData} />
                <AirQualityPanel data={weatherData.current} />
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                  <h3 className="font-semibold text-slate-200 mb-4">Próximos 7 Dias</h3>
                  <DailyForecastList data={weatherData.daily} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-400 mb-4">Carregando dados meteorológicos...</h2>
            <button onClick={loadDefaultCity} className="bg-sky-500 text-white px-6 py-2 rounded-full font-medium">Tentar Novamente</button>
          </div>
        )}
        
        <footer className="mt-12 text-center border-t border-slate-800/50 pt-8">
          <a 
            href="https://www.linkedin.com/in/eleandro-mangrich" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-400 transition-all duration-300 group"
          >
            <Linkedin className="w-4 h-4 group-hover:scale-110" />
            <span className="text-xs font-medium uppercase tracking-widest">Desenvolvido por Eleandro Mangrich</span>
          </a>
        </footer>
      </main>
    </div>
  );
};

export default App;