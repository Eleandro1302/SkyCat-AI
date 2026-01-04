import React from 'react';
import { WeatherData } from '../types';
import { Wind, Droplets, Sun, CloudRain, Cloud, CloudLightning, Thermometer, CloudSnow, Flower2 } from 'lucide-react';

interface Props {
  data: WeatherData;
}

const ConditionIcon = ({ condition }: { condition: string }) => {
  const baseClass = "w-16 h-16";
  
  switch (condition) {
    case 'Sunny': 
      return <Sun className={`${baseClass} text-amber-400`} style={{ animation: 'spin-slow 12s linear infinite' }} />;
    case 'Rain': 
      return <CloudRain className={`${baseClass} text-blue-400`} style={{ animation: 'bounce-gentle 2s ease-in-out infinite' }} />;
    case 'Storm': 
      return <CloudLightning className={`${baseClass} text-purple-400`} style={{ animation: 'pulse-storm 2s infinite' }} />;
    case 'Partly Cloudy': 
      return <Cloud className={`${baseClass} text-slate-300`} style={{ animation: 'float 4s ease-in-out infinite' }} />;
    case 'Snow': 
      return <CloudSnow className={`${baseClass} text-white`} style={{ animation: 'float 3s ease-in-out infinite' }} />;
    default: 
      return <Cloud className={`${baseClass} text-slate-400`} style={{ animation: 'float 5s ease-in-out infinite' }} />;
  }
};

const CurrentConditions: React.FC<Props> = ({ data }) => {
  const { current } = data;

  // Determine Pollen Color
  const getPollenColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'text-red-400';
      case 'High': return 'text-orange-400';
      case 'Moderate': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden border border-slate-700/50">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes temp-fade-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-storm {
          0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          50% { opacity: 0.8; transform: scale(1.05); filter: brightness(1.2); }
        }
      `}</style>

      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-center z-10 relative">
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
            {data.location.district}
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{data.location.city}</h1>
          
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
            <ConditionIcon condition={current.condition} />
            <div 
              key={`${current.temp}-${data.location.city}`} // Remount on temp or city change to trigger animation
              className="text-7xl font-bold tracking-tighter"
              style={{ animation: 'temp-fade-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
            >
              {current.temp}°
            </div>
          </div>
          <p className="text-lg text-slate-300 font-medium">{current.description}</p>
          <p className="text-sm text-slate-400">Feels like {current.feelsLike}°</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto">
          <div className="bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-slate-600/30 flex flex-col items-center justify-center">
            <Wind className="w-6 h-6 text-sky-300 mb-2" />
            <span className="text-xs text-slate-400">Wind</span>
            <span className="text-lg font-semibold">{current.windSpeed} km/h</span>
          </div>
          
          <div className="bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-slate-600/30 flex flex-col items-center justify-center">
            <Droplets className="w-6 h-6 text-sky-300 mb-2" />
            <span className="text-xs text-slate-400">Humidity</span>
            <span className="text-lg font-semibold">{current.humidity}%</span>
          </div>
          
          <div className="bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-slate-600/30 flex flex-col items-center justify-center">
            <Sun className="w-6 h-6 text-sky-300 mb-2" />
            <span className="text-xs text-slate-400">UV Index</span>
            <span className="text-lg font-semibold">{current.uvIndex}</span>
          </div>
          
          <div className="bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-slate-600/30 flex flex-col items-center justify-center">
            <Thermometer className="w-6 h-6 text-sky-300 mb-2" />
            <span className="text-xs text-slate-400">AQI</span>
            <span className="text-lg font-semibold">{current.aqi}</span>
          </div>

          {/* New Pollen Card */}
          <div className="bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-slate-600/30 flex flex-col items-center justify-center col-span-2 lg:col-span-1">
            <Flower2 className={`w-6 h-6 mb-2 ${getPollenColor(current.pollenLevel)}`} />
            <span className="text-xs text-slate-400">Pollen</span>
            <span className={`text-lg font-semibold ${getPollenColor(current.pollenLevel)}`}>
              {current.pollenLevel}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CurrentConditions;