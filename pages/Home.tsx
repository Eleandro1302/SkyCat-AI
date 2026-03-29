import React, { useState, useRef, useEffect } from 'react';
import { Navigation, LocateFixed, Search, X, Linkedin, MapPin, BookOpen } from 'lucide-react';
import { WeatherData, AppState } from '../types';
import { CITY_COORDINATES } from '../constants';
import { fetchWeatherData, getMockData } from '../services/weatherService';
import { t, getLocale } from '../utils/i18n';
import CurrentConditions from '../components/CurrentConditions';
import ForecastChart from '../components/ForecastChart';
import RadarView from '../components/RadarView';
import AIWeatherInsight from '../components/AIWeatherInsight';
import DailyForecastList from '../components/DailyForecastList';
import AirQualityPanel from '../components/AirQualityPanel';
import WeatherEffects from '../components/WeatherEffects';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
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
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
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
        
        locationName = addr.city || addr.town || addr.village || addr.municipality || addr.city_district || locationName;
        districtName = addr.suburb || addr.neighbourhood || addr.hamlet || addr.district || "";
        
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
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <MapPin className="w-3 h-3 text-sky-500 animate-pulse" />
            {trans.loadingSub}
          </div>
          <p className="text-xs text-slate-500 max-w-xs text-center leading-relaxed">
            {locale === 'pt' 
              ? 'Estamos preparando sua experiência meteorológica personalizada com insights de IA em tempo real.' 
              : 'We are preparing your personalized weather experience with real-time AI insights.'}
          </p>
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
        
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Link to="/about" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Sobre' : 'About'}</Link>
          <Link to="/articles" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Artigos' : 'Articles'}</Link>
          <Link to="/contact" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Contato' : 'Contact'}</Link>
        </nav>

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

            <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900/40 border border-slate-800/40 rounded-[2rem] p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">{locale === 'pt' ? 'Como Funciona a Previsão' : 'How Forecasting Works'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {locale === 'pt' 
                    ? 'Nossa tecnologia utiliza modelos numéricos globais combinados com inteligência artificial para processar bilhões de pontos de dados. Isso nos permite prever mudanças atmosféricas com precisão milimétrica, desde frentes frias até microclimas urbanos.' 
                    : 'Our technology uses global numerical models combined with artificial intelligence to process billions of data points. This allows us to predict atmospheric changes with pinpoint accuracy, from cold fronts to urban microclimates.'}
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/40 rounded-[2rem] p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">{locale === 'pt' ? 'Importância do AQI' : 'Importance of AQI'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {locale === 'pt' 
                    ? 'O Índice de Qualidade do Ar (AQI) é vital para sua saúde. Ele monitora poluentes como PM2.5 e Ozônio. Um AQI acima de 100 pode ser prejudicial para grupos sensíveis, enquanto acima de 150 é considerado insalubre para todos.' 
                    : 'The Air Quality Index (AQI) is vital for your health. It monitors pollutants like PM2.5 and Ozone. An AQI above 100 can be harmful to sensitive groups, while above 150 is considered unhealthy for everyone.'}
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/40 rounded-[2rem] p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">{locale === 'pt' ? 'Dicas de Segurança' : 'Safety Tips'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {locale === 'pt' 
                    ? 'Em caso de tempestades severas, procure abrigo em locais fechados e evite áreas abertas ou sob árvores. Mantenha-se hidratado durante ondas de calor e use protetor solar mesmo em dias nublados se o índice UV estiver alto.' 
                    : 'In case of severe storms, seek shelter indoors and avoid open areas or under trees. Stay hydrated during heatwaves and use sunscreen even on cloudy days if the UV index is high.'}
                </p>
              </div>
            </section>

            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                  </div>
                  {locale === 'pt' ? 'Artigos Recentes' : 'Latest Articles'}
                </h2>
                <Link to="/articles" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest">
                  {locale === 'pt' ? 'Ver Todos' : 'View All'}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 12, titlePt: 'Energia Solar e Clima', titleEn: 'Solar Energy & Weather' },
                  { id: 11, titlePt: 'Ponto de Orvalho', titleEn: 'Dew Point Importance' },
                  { id: 10, titlePt: 'Influência das Montanhas', titleEn: 'Mountain Influence' }
                ].map((article) => (
                  <Link 
                    key={article.id} 
                    to="/articles" 
                    className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl hover:border-sky-500/30 transition-all group"
                  >
                    <h3 className="text-slate-200 font-bold mb-2 group-hover:text-sky-400 transition-colors">
                      {locale === 'pt' ? article.titlePt : article.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {locale === 'pt' ? 'Leia mais sobre este tópico meteorológico...' : 'Read more about this meteorological topic...'}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <footer className="mt-20 pt-12 border-t border-slate-800/30 flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs text-slate-400">
                <Link to="/about" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Sobre o SkyCast AI' : 'About SkyCast AI'}</Link>
                <Link to="/articles" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Artigos' : 'Articles'}</Link>
                <Link to="/privacy" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}</Link>
                <Link to="/terms" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Termos de Serviço' : 'Terms of Service'}</Link>
                <Link to="/contact" className="hover:text-sky-400 transition-colors">{locale === 'pt' ? 'Contato' : 'Contact'}</Link>
              </div>
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

export default Home;
