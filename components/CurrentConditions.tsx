import React from 'react';
import { WeatherData } from '../types';
import { Wind, Droplets, Sun, CloudRain, Cloud, CloudLightning, Thermometer, CloudSnow, Flower2, MapPin } from 'lucide-react';
import { t } from '../utils/i18n';

interface Props {
  data: WeatherData;
}

const ConditionIcon = ({ condition }: { condition: string }) => {
  const baseClass = "w-20 h-20 md:w-28 md:h-28";
  
  switch (condition) {
    case 'Sunny': 
      return <Sun className={`${baseClass} text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]`} style={{ animation: 'spin-slow 20s linear infinite' }} />;
    case 'Rain': 
      return <CloudRain className={`${baseClass} text-blue-400 drop-shadow-[0_0_30px_rgba(96,165,250,0.4)]`} style={{ animation: 'bounce-gentle 3s ease-in-out infinite' }} />;
    case 'Storm': 
      return <CloudLightning className={`${baseClass} text-indigo-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.4)]`} style={{ animation: 'pulse-storm 2s infinite' }} />;
    case 'Partly Cloudy': 
      return <Cloud className={`${baseClass} text-slate-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]`} style={{ animation: 'float 5s ease-in-out infinite' }} />;
    case 'Snow': 
      return <CloudSnow className={`${baseClass} text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]`} style={{ animation: 'float 4s ease-in-out infinite' }} />;
    default: 
      return <Cloud className={`${baseClass} text-slate-400`} style={{ animation: 'float 6s ease-in-out infinite' }} />;
  }
};

const CurrentConditions: React.FC<Props> = ({ data }) => {
  const { current } = data;
  const trans = t();

  const getPollenColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'text-red-400';
      case 'High': return 'text-orange-400';
      case 'Moderate': return 'text-yellow-400';
      default: return 'text-sky-400';
    }
  };

  const getTranslatedPollenLevel = (level: string) => {
    switch (level) {
      case 'Very High': return trans.pollenLevels.veryHigh;
      case 'High': return trans.pollenLevels.high;
      case 'Moderate': return trans.pollenLevels.moderate;
      default: return trans.pollenLevels.low;
    }
  };

  return (
    <div className="relative bg-[#0f172a]/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden border border-slate-800/50 group">
      
      <style>{`
        @keyframes temp-reveal {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse-storm { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.05); filter: brightness(1.3); } }
      `}</style>

      {/* Aurora glow background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full group-hover:bg-sky-500/20 transition-all duration-1000"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000"></div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-10 z-10 relative">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-sky-400 font-bold text-xs uppercase tracking-[0.3em] mb-3">
            <MapPin className="w-3 h-3" />
            {data.location.district || trans.loadingSub}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">
            {data.location.city}
          </h1>
          
          <div className="flex items-center justify-center md:justify-start gap-8 mb-8">
            <ConditionIcon condition={current.condition} />
            <div 
              key={current.temp}
              className="text-8xl md:text-9xl font-black tracking-tighter tabular-nums"
              style={{ animation: 'temp-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              {current.temp}<span className="text-sky-500 text-5xl md:text-6xl align-top mt-4 inline-block">°</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl text-slate-200 font-bold tracking-tight">{current.description}</p>
            <p className="text-slate-400 font-medium tracking-wide">{trans.feelsLike} <span className="text-white">{current.feelsLike}°C</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 w-full md:w-72 shrink-0">
          {[
            { icon: Wind, label: trans.wind, value: `${current.windSpeed} km/h`, color: 'text-sky-400' },
            { icon: Droplets, label: trans.humidity, value: `${current.humidity}%`, color: 'text-blue-400' },
            { icon: Sun, label: trans.uvIndex, value: current.uvIndex, color: 'text-amber-400' },
            { icon: Thermometer, label: trans.airQuality, value: current.aqi, color: 'text-emerald-400' },
            { icon: Flower2, label: trans.pollen, value: getTranslatedPollenLevel(current.pollenLevel), color: getPollenColor(current.pollenLevel) }
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className={`bg-slate-800/40 p-5 rounded-[2rem] border border-slate-700/50 hover:bg-slate-700/60 transition-all duration-300 group/card animate-in fade-in zoom-in-95 duration-700 ${i === 4 ? 'col-span-2' : ''}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <stat.icon className={`w-5 h-5 mb-3 ${stat.color} group-hover/card:scale-110 transition-transform`} />
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-lg font-black tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentConditions;