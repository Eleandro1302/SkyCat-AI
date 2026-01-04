import React, { useState, useRef, useEffect } from 'react';
import { Navigation, Bell, Settings, Menu, ShieldAlert, LocateFixed, Search, X, RefreshCw } from 'lucide-react';
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
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Function to load weather data using the service
  const loadWeather = async (lat: number, lng: number, locationName: string, district?: string) => {
    try {
      setAppState(AppState.LOADING);
      const data = await fetchWeatherData(lat, lng, locationName, district);
      setWeatherData(data);
      setAppState(AppState.DASHBOARD);
      setIsSearchOpen(false);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to load weather", error);
      alert("Failed to fetch weather data. Please check your connection or try a different city.");
      
      // If we fail and have no data, go back to onboarding
      if (!weatherData) {
        setAppState(AppState.ONBOARDING);
      } else {
        setAppState(AppState.DASHBOARD);
      }
    }
  };

  // Shared function to handle successful location retrieval
  const handleLocationFound = async (latitude: number, longitude: number) => {
    // Persist preference
    localStorage.setItem('skycast_use_location', 'true');

    let locationName = "Detected Location";
    let districtName = "";
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          locationName = data.address.city || 
                         data.address.town || 
                         data.address.village || 
                         data.address.municipality || 
                         "Detected Location";
          
          districtName = data.address.suburb || 
                         data.address.neighbourhood || 
                         data.address.quarter || 
                         "";
          if (districtName === locationName) districtName = "";
        }
      }
    } catch (e) { 
      console.error("Reverse geocoding failed", e);
      locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }

    loadWeather(latitude, longitude, locationName, districtName);
  };

  // Initialize App: Check local storage or browser permissions
  useEffect(() => {
    const initApp = async () => {
       // Safety timeout: If nothing happens in 5 seconds, force Onboarding
       const timeoutId = setTimeout(() => {
         if (appState === AppState.LOADING && !weatherData) {
           setAppState(AppState.ONBOARDING);
         }
       }, 5000);

       const savedPreference = localStorage.getItem('skycast_use_location') === 'true';

       const tryAutoLocation = () => {
         if (!navigator.geolocation) {
            clearTimeout(timeoutId);
            setAppState(AppState.ONBOARDING);
            return;
         }

         navigator.geolocation.getCurrentPosition(
           (position) => {
             clearTimeout(timeoutId);
             handleLocationFound(position.coords.latitude, position.coords.longitude);
           },
           (error) => {
             clearTimeout(timeoutId);
             console.warn("Auto-location failed", error);
             if (error.code === error.PERMISSION_DENIED) {
                 localStorage.removeItem('skycast_use_location');
             }
             setAppState(AppState.ONBOARDING);
           },
           { timeout: 8000 } // Geo timeout
         );
       };

       if (savedPreference) {
           tryAutoLocation();
           return;
       }

       // Check permissions without forcing prompt
       if (navigator.permissions && navigator.geolocation) {
           try {
              const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
              if (permission.state === 'granted') {
                  tryAutoLocation();
                  return;
              }
           } catch (e) { /* ignore */ }
       }
       
       // Fallback to Onboarding immediately if no preference
       clearTimeout(timeoutId);
       setAppState(AppState.ONBOARDING);
    };
    
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGrantLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setAppState(AppState.LOADING);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationFound(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location", error);
        setAppState(AppState.ONBOARDING);
        alert("Location access denied or timed out. Please search for a city manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAppState(AppState.LOADING);

    try {
      // First check if it matches a hardcoded city for instant load (optional optimization)
      const normalizedQuery = searchQuery.trim();
      const predefined = Object.keys(CITY_COORDINATES).find(c => c.toLowerCase() === normalizedQuery.toLowerCase());
      
      if (predefined) {
        const coords = CITY_COORDINATES[predefined];
        loadWeather(coords.lat, coords.lng, predefined);
        return;
      }

      // If not, use Nominatim Search API
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(normalizedQuery)}&limit=1`);
      
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const { lat, lon, display_name, name } = results[0];
          const cityName = name || display_name.split(',')[0];
          loadWeather(parseFloat(lat), parseFloat(lon), cityName);
        } else {
          alert("City not found. Please try another name.");
          setAppState(weatherData ? AppState.DASHBOARD : AppState.ONBOARDING);
          if (weatherData) setIsSearchOpen(true);
        }
      } else {
        throw new Error("Search API failed");
      }
    } catch (error) {
      console.error("Search failed", error);
      alert("Unable to search for city. Please check connection.");
      setAppState(weatherData ? AppState.DASHBOARD : AppState.ONBOARDING);
    }
  };

  const getSeverityWeight = (severity: string) => {
    switch (severity) {
      case 'extreme': return 3;
      case 'severe': return 2;
      case 'moderate': return 1;
      default: return 0;
    }
  };

  // LOADING VIEW
  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 animate-pulse">
            {searchQuery ? `Searching for "${searchQuery}"...` : "Loading SkyCast AI..."}
          </p>
        </div>
      </div>
    );
  }

  // START SCREEN (ONBOARDING)
  if (appState === AppState.ONBOARDING || !weatherData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/20">
               <Navigation className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              SkyCast AI
            </h1>
            <p className="text-slate-400 text-lg">
              Hyperlocal weather insights powered by AI.
            </p>
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
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25"
              >
                Search Weather
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-slate-700 flex-1"></div>
              <span className="text-xs text-slate-500 font-medium">OR</span>
              <div className="h-px bg-slate-700 flex-1"></div>
            </div>

            <button 
              onClick={handleGrantLocation}
              className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white py-3 rounded-xl transition-all border border-slate-600 hover:border-slate-500"
            >
              <LocateFixed className="w-5 h-5" />
              Use Current Location
            </button>
          </div>
        </div>

        {/* Footer for Onboarding */}
        <div className="absolute bottom-6 left-0 w-full text-center z-20">
             <p className="text-slate-500 text-xs">
                Powered by Google Gemini & Open-Meteo
             </p>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  const sortedAlerts = [...weatherData.alerts].sort((a, b) => getSeverityWeight(b.severity) - getSeverityWeight(a.severity));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 pb-20 md:pb-0 relative">
      
      {/* Full Screen Weather Effects */}
      <WeatherEffects condition={weatherData.current.condition} />

      {/* Top Navigation */}
      <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 px-4 py-3 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.ONBOARDING)}>
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
             <Navigation className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg hidden md:block">SkyCast AI</span>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
           
           {/* Search Bar - conditionally rendered */}
           {isSearchOpen ? (
               <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative animate-in fade-in zoom-in duration-200">
                   <input 
                        ref={searchInputRef}
                        type="text" 
                        className="w-full bg-slate-800 border border-sky-500 text-white text-sm rounded-lg pl-3 pr-10 py-2 outline-none"
                        placeholder="Search city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {
                            if(!searchQuery) setIsSearchOpen(false);
                        }}
                   />
                   <button 
                    type="button" 
                    onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                   >
                       <X className="w-4 h-4" />
                   </button>
               </form>
           ) : (
             <>
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search City</span>
                </button>

                <div className="h-6 w-px bg-slate-800 mx-1"></div>

                <button 
                    onClick={handleGrantLocation}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 p-2 rounded-lg transition-colors flex items-center justify-center"
                    title="Use Current Location"
                >
                    <LocateFixed className="w-5 h-5" />
                </button>
             </>
           )}
            
            {!isSearchOpen && (
                <>
                    <button className="p-2 hover:bg-slate-800 rounded-full relative">
                    <Bell className="w-5 h-5 text-slate-400" />
                    {weatherData.alerts.length > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    )}
                    </button>
                    <button 
                    className="md:hidden p-2 hover:bg-slate-800 rounded-full"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                    <Menu className="w-5 h-5 text-slate-400" />
                    </button>
                </>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 max-w-5xl relative z-10">
        
        {/* Severe Weather Alert Banner */}
        {sortedAlerts.length > 0 && (
          <div className="mb-6 space-y-4">
            {sortedAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`rounded-xl p-4 flex items-start gap-4 shadow-xl border relative overflow-hidden ${
                  alert.severity === 'extreme' 
                    ? 'bg-gradient-to-r from-red-600 to-red-900 border-red-500 text-white' 
                    : alert.severity === 'severe'
                      ? 'bg-red-950/80 border-red-500/50 text-red-50'
                      : 'bg-orange-950/80 border-orange-500/50 text-orange-50'
                }`}
              >
                {/* Background pulse for extreme alerts */}
                {alert.severity === 'extreme' && (
                  <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none"></div>
                )}
                
                <div className={`p-2 rounded-full shrink-0 relative z-10 ${
                  alert.severity === 'extreme' ? 'bg-red-500 text-white' : 
                  alert.severity === 'severe' ? 'bg-red-900 text-red-200' : 'bg-orange-900 text-orange-200'
                }`}>
                   <ShieldAlert className="w-6 h-6" />
                </div>
                
                <div className="relative z-10 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg uppercase tracking-wide">{alert.title}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                       alert.severity === 'extreme' ? 'border-white/50 bg-white/20' : 
                       alert.severity === 'severe' ? 'border-red-400/30 bg-red-400/10 text-red-300' : 
                       'border-orange-400/30 bg-orange-400/10 text-orange-300'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm mt-1 leading-relaxed opacity-90">{alert.description}</p>
                  <p className="text-xs mt-3 flex items-center gap-1.5 opacity-75 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>Action required in {weatherData.location.city}</span>
                    <span className="opacity-50">•</span>
                    <span>Issued: {alert.issuedAt}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Main Info */}
          <div className="md:col-span-2 space-y-6">
            <CurrentConditions data={weatherData} />
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-200">Hourly Forecast</h3>
                <span className="text-xs text-slate-500">Next 24 Hours</span>
              </div>
              <ForecastChart data={weatherData.hourly} />
            </div>

             <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-200 mb-4">Interactive Radar</h3>
              <RadarView 
                condition={weatherData.current.condition} 
                lat={weatherData.location.lat}
                lng={weatherData.location.lng}
                precipChance={weatherData.hourly[0]?.precipChance || 0}
              />
            </div>
          </div>

          {/* Right Column: AI & Details */}
          <div className="space-y-6">
            <AIWeatherInsight weatherData={weatherData} />

            <AirQualityPanel data={weatherData.current} />

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-200 mb-4">7-Day Forecast</h3>
              <DailyForecastList data={weatherData.daily} />
            </div>

            {/* Customization / Widgets Teaser */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                 <Settings className="w-4 h-4 text-slate-400" />
                 <h3 className="font-semibold text-slate-200">Customization</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Personalize your dashboard widgets and notification thresholds.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm">Rain Alerts</span>
                  <div className="w-8 h-4 bg-sky-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                 <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-sm">Daily Briefing</span>
                  <div className="w-8 h-4 bg-slate-600 rounded-full relative cursor-pointer">
                     <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer for Dashboard */}
        <footer className="mt-12 mb-8 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm">
            Powered by Google Gemini & Open-Meteo
            </p>
        </footer>

      </main>
    </div>
  );
};

export default App;