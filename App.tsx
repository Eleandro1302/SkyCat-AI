import React, { useState, useRef, useEffect } from 'react';
import { Navigation, Bell, Settings, Menu, ShieldAlert, LocateFixed, Search, X, Linkedin } from 'lucide-react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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
          (err) => {
            console.warn("Auto-location error:", err);
            if (isMounted) setAppState(AppState.ONBOARDING);
          },
          { timeout: 5000 }
        );
      }
    };
    init();
    return () => { isMounted = false; };
  }, []);

  const loadWeather = async (lat: number, lng: number, locationName: string, district?: string) => {
    setAppState(AppState.LOADING);
    try {
      const data = await fetchWeatherData(lat, lng, locationName, district);
      setWeatherData(data);
      setAppState(AppState.DASHBOARD);
      setIsSearchOpen(false);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to load weather", error);
      alert("Unable to fetch weather data. Please check your internet connection.");
      setAppState(AppState.ONBOARDING);
    }
  };

  const handleLocationFound = async (latitude: number, longitude: number) => {
    localStorage.setItem('skycast_use_location', 'true');
    let locationName = "Detected Location";
    let districtName = "";
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          locationName = data.address.city || data.address.town || data.address.village || "My Location";
          districtName = data.address.suburb || "";
        }
      }
    } catch (e) { 
      console.warn("Reverse geocode failed", e);
    }
    loadWeather(latitude, longitude, locationName, districtName);
  };

  const handleGrantLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setAppState(AppState.LOADING);
    navigator.geolocation.getCurrentPosition(
      (pos) => handleLocationFound(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        console.warn(err);
        setAppState(AppState.ONBOARDING);
        alert("Location access denied or timed out.");
      },
      { timeout: 10000 }
    );
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setAppState(AppState.LOADING);
    const normalized = searchQuery.trim().toLowerCase();
    const predefinedKey = Object.keys(CITY_COORDINATES).find(k => k.toLowerCase() === normalized);
    if (predefinedKey) {
      const { lat, lng } = CITY_COORDINATES[predefinedKey];
      loadWeather(lat, lng, predefinedKey);
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      if (response.ok) {
        const results = await response.json();
        if (results.length > 0) {
          const { lat, lon, name, display_name } = results[0];
          const cityName = name || display_name.split(',')[0];
          loadWeather(parseFloat(lat), parseFloat(lon), cityName);
        } else {
          alert("City not found.");
          setAppState(weatherData ? AppState.DASHBOARD : AppState.ONBOARDING);
        }
      } else {
        throw new Error("Search API error");
      }
    } catch (error) {
      console.error(error);
      alert("Search failed. Check your connection.");
      setAppState(weatherData ? AppState.DASHBOARD : AppState.ONBOARDING);
    }
  };

  const getSeverityWeight = (severity: string) => {
    if (severity === 'extreme') return 3;
    if (severity === 'severe') return 2;
    return 1;
  };

  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 animate-pulse text-center">Fetching Forecast...</p>
        <button onClick={() => setAppState(AppState.ONBOARDING)} className="mt-8 text-xs text-slate-500 underline hover:text-slate-300">Cancel</button>
      </div>
    );
  }

  if (appState === AppState.ONBOARDING || !weatherData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/20">
               <Navigation className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">SkyCast AI</h1>
            <p className="text-slate-400 text-lg">Hyperlocal weather intelligence.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md shadow-xl">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Enter city name..." 
                  className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" disabled={!searchQuery.trim()} className="w-full bg-sky-500 hover:bg-sky-400 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25">Get Forecast</button>
            </form>
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-slate-700 flex-1"></div>
              <span className="text-xs text-slate-500 font-medium">OR</span>
              <div className="h-px bg-slate-700 flex-1"></div>
            </div>
            <button onClick={handleGrantLocation} className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white py-3 rounded-xl transition-all border border-slate-600 hover:border-slate-500">
              <LocateFixed className="w-5 h-5" />
              Use Current Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedAlerts = [...weatherData.alerts].sort((a, b) => getSeverityWeight(b.severity) - getSeverityWeight(a.severity));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 pb-20 md:pb-0 relative overflow-x-hidden">
      <WeatherEffects condition={weatherData.current.condition} />
      <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.ONBOARDING)}>
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
             <Navigation className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg hidden md:block">SkyCast AI</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
           {isSearchOpen ? (
               <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative animate-in fade-in zoom-in duration-200">
                   <input 
                        ref={searchInputRef}
                        type="text" 
                        className="w-full bg-slate-800 border border-sky-500 text-white text-sm rounded-lg pl-3 pr-10 py-2 outline-none"
                        placeholder="Search city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => { if(!searchQuery) setIsSearchOpen(false); }}
                   />
                   <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
               </form>
           ) : (
             <>
                <button onClick={() => setIsSearchOpen(true)} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"><Search className="w-4 h-4" /><span className="hidden sm:inline">Search</span></button>
                <div className="h-6 w-px bg-slate-800 mx-1"></div>
                <button onClick={handleGrantLocation} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 p-2 rounded-lg" title="Current Location"><LocateFixed className="w-5 h-5" /></button>
             </>
           )}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 max-w-5xl relative z-10">
        {sortedAlerts.length > 0 && (
          <div className="mb-6 space-y-4">
            {sortedAlerts.map(alert => (
              <div key={alert.id} className={`rounded-xl p-4 flex items-start gap-4 shadow-xl border relative overflow-hidden ${
                  alert.severity === 'extreme' ? 'bg-red-900/50 border-red-500' : 
                  alert.severity === 'severe' ? 'bg-red-950/80 border-red-500/50' : 'bg-orange-950/80 border-orange-500/50'
                }`}>
                <div className={`p-2 rounded-full shrink-0 relative z-10 ${alert.severity === 'extreme' ? 'bg-red-500 text-white' : 'bg-red-900 text-red-200'}`}><ShieldAlert className="w-6 h-6" /></div>
                <div className="relative z-10 flex-1">
                  <h3 className="font-bold text-lg">{alert.title}</h3>
                  <p className="text-sm mt-1">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <CurrentConditions data={weatherData} />
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-200 mb-6">Hourly Forecast</h3>
              <ForecastChart data={weatherData.hourly} />
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-200 mb-4">Interactive Radar</h3>
              <RadarView condition={weatherData.current.condition} lat={weatherData.location.lat} lng={weatherData.location.lng} precipChance={weatherData.hourly[0]?.precipChance || 0} />
            </div>
          </div>
          <div className="space-y-6">
            <AIWeatherInsight weatherData={weatherData} />
            <AirQualityPanel data={weatherData.current} />
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-200 mb-4">7-Day Forecast</h3>
              <DailyForecastList data={weatherData.daily} />
            </div>
          </div>
        </div>
        
        <footer className="mt-12 mb-12 text-center border-t border-slate-800 pt-8">
            <a 
              href="https://www.linkedin.com/in/eleandro-mangrich" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-all duration-300 group"
            >
              <Linkedin className="w-4 h-4 group-hover:scale-110" />
              <span className="text-sm font-medium">Desenvolvido por Eleandro Mangrich</span>
            </a>
        </footer>
      </main>
    </div>
  );
};

export default App;