
import React, { useState, useRef, useEffect } from 'react';
import { Navigation, ShieldAlert, LocateFixed, Search, X, Linkedin, MapPin } from 'lucide-react';
import { WeatherData, AppState } from './types';
import { CITY_COORDINATES } from './constants';
import { fetchWeatherData, getMockData } from './services/weatherService';
import { t, getLocale } from './utils/i18n';
import CurrentConditions from './components/CurrentConditions';
import ForecastChart from './components/ForecastChart';
import RadarView from './components/RadarView';
import AIWeatherInsight from './components/AIWeatherInsight';
import DailyForecastList from './components/DailyForecastList';
import AirQualityPanel from './components/AirQualityPanel';
import WeatherEffects from './components/WeatherEffects';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const trans = t();
  const locale = getLocale();

  const DEFAULT_CITY = "London";

  useEffect(() => {
    let isMounted = true;
    const initializeApp = async () => {
      const getPosition = () => {
        return new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true, // Mudança para alta precisão
            timeout: 10000, // Aumentado para dar tempo ao hardware de GPS
            maximumAge: 0 // Força busca de localização fresca, não cacheada
          });
        });
      };

      try {
        setIsLocating(true);
        const position = await getPosition();
        if (isMounted) await handleLocationFound(position.coords.latitude, position.coords.longitude);
      } catch (error) {
        console.warn("Geolocation failed, falling back to default.", error);
        if (isMounted) loadDefaultCity();
      } finally {
        if (isMounted) setIsLocating(false);
      }
    };

    initializeApp();
    return () => { isMounted = false; };
  }, []);

  const loadDefaultCity = () => {
    const coords = CITY_COORDINATES[DEFAULT_CITY];
    loadWeather(coords.lat, coords.lng, DEFAULT_CITY);
  };

  const loadWeather = async (lat: number, lng: number, locationName: string, district?: string) => {
    try {
      const data = await fetchWeatherData(lat, lng, locationName, district);
      setWeatherData(data);
      setAppState(AppState.DASHBOARD);
      setIsSearchOpen(false);
    } catch (error) {
      setWeatherData(getMockData(locationName));
      setAppState(AppState.DASHBOARD);
    }
  };

  const handleLocationFound = async (latitude: number, longitude: number) => {
    let locationName = locale === 'pt' ? "Minha Localização" : "My Location";
    let districtName = "";

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${locale}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const addr = data.address;
        
        // Lógica de prioridade para nome da cidade/localidade
        locationName = addr.city || addr.town || addr.village || addr.municipality || addr.city_district || locationName;
        
        // Captura o bairro ou distrito para exibição secundária
        districtName = addr.suburb || addr.neighbourhood || addr.hamlet || addr.district || "";
        
        // Se o nome da cidade e bairro forem iguais, limpa o distrito para não repetir
        if (districtName.toLowerCase() === locationName.toLowerCase()) {
          districtName = "";
        }
      }
    } catch (e) {
      console.error("Reverse geocoding error:", e);
    }
    
    await loadWeather(latitude, longitude, locationName, districtName);
  };

  const handleManualLocationRequest = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => handleLocationFound(pos.coords.latitude, pos.coords.longitude).finally(() => setIsLocating(false)),
      (err) => {
        console.error("Manual location error:", err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const normalized = searchQuery.trim();
    
    setAppState(AppState.LOADING);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(normalized)}&limit=1&accept-language=${locale}`);
      const results = await response.json();
      if (results.length > 0) {
        // Para buscas manuais, tentamos extrair um nome mais curto do display_name
        const parts = results[0].display_name.split(',');
        const name = parts[0];
        loadWeather(parseFloat(results[0].lat), parseFloat(results[0].lon), name);
      } else {
        setAppState(AppState.DASHBOARD);
      }
    } catch (error) {
      setAppState(AppState.DASHBOARD);
    }
  };

  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 mb-8 relative">
             <div className="absolute inset-0 bg-sky-500/20 rounded-2xl animate-pulse"></div>
             <div className="relative bg-slate-900 border border-slate-800 w-full h-full rounded-2xl flex items-center justify-center">
                <Navigation className="w-8 h-8 text-sky-400 animate-bounce" />
             </div>
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase mb-4">SkyCast AI</h1>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <MapPin className="w-3 h-3 text-sky-500 animate-pulse" />
            {trans.loadingSub}
          </div>
          <button onClick={loadDefaultCity} className="mt-16 text-[10px] text-slate-600 hover:text-sky-400 uppercase tracking-widest">{trans.skipToLondon}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden">
      {weatherData && <WeatherEffects condition={weatherData.current.condition} />}
      
      <header className="fixed top-0 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
             <Navigation className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">SkyCast AI</span>
        </div>
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex relative animate-in slide-in-from-right-4">
              <input 
                ref={searchInputRef}
                type="text" 
                className="bg-slate-900 border border-sky-500/30 text-white text-xs rounded-lg pl-3 pr-8 py-2 w-40 sm:w-60"
                placeholder={trans.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"><X className="w-3 h-3" /></button>
            </form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-400 hover:text-white"><Search className="w-5 h-5" /></button>
          )}
          <button onClick={handleManualLocationRequest} disabled={isLocating} className="p-2 text-sky-400 hover:text-sky-300">
            <LocateFixed className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl relative z-10">
        {weatherData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-6">
                <CurrentConditions data={weatherData} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-6 backdrop-blur-md">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{trans.thermalFlow}</h3>
                    <ForecastChart data={weatherData.hourly} />
                  </div>
                  <RadarView 
                    condition={weatherData.current.condition} 
                    lat={weatherData.location.lat} 
                    lng={weatherData.location.lng} 
                    precipChance={weatherData.hourly[0]?.precipChance || 0} 
                    windSpeed={weatherData.current.windSpeed}
                  />
                </div>
              </div>
              <div className="md:col-span-4 space-y-6">
                <AIWeatherInsight weatherData={weatherData} />
                <AirQualityPanel data={weatherData.current} />
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-6 backdrop-blur-md">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{trans.nextDays}</h3>
                  <DailyForecastList data={weatherData.daily} />
                </div>
              </div>
            </div>

            <footer className="mt-20 pt-12 border-t border-slate-800/30 flex flex-col items-center">
              <a href="https://www.linkedin.com/in/eleandro-mangrich" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-sky-400 transition-all">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Eleandro Mangrich</span>
                  <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-widest">
                    {locale === 'pt' ? 'Arquitetura SkyCast AI' : 'SkyCast AI Architecture'} 2026
                  </p>
                </div>
              </a>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
