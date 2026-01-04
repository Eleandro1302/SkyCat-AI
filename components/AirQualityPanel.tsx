import React from 'react';
import { CurrentWeather } from '../types';
import { Wind } from 'lucide-react';

interface Props {
  data: CurrentWeather;
}

const AirQualityPanel: React.FC<Props> = ({ data }) => {
  const { aqi, pollutants } = data;

  // AQI color logic
  const getAQIStatus = (aqi: number) => {
    if (aqi <= 20) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500', barColor: 'from-emerald-400 to-emerald-600' };
    if (aqi <= 40) return { label: 'Fair', color: 'text-lime-400', bg: 'bg-lime-500', barColor: 'from-lime-400 to-lime-600' };
    if (aqi <= 60) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500', barColor: 'from-yellow-400 to-yellow-600' };
    if (aqi <= 80) return { label: 'Poor', color: 'text-orange-400', bg: 'bg-orange-500', barColor: 'from-orange-400 to-orange-600' };
    return { label: 'Very Poor', color: 'text-red-400', bg: 'bg-red-500', barColor: 'from-red-400 to-red-600' };
  };

  const status = getAQIStatus(aqi);
  const percentage = Math.min(100, (aqi / 100) * 100);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-5 h-5 text-slate-400" />
        <h3 className="font-semibold text-slate-200">Air Quality</h3>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-3xl font-bold text-slate-100">{aqi}</span>
          <span className="text-sm text-slate-400 ml-1">AQI</span>
        </div>
        <span className={`text-lg font-medium ${status.color}`}>{status.label}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden mb-6 relative">
         <div 
           className={`h-full absolute rounded-full bg-gradient-to-r ${status.barColor} transition-all duration-1000 ease-out`}
           style={{ width: `${percentage}%` }}
         ></div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/30 p-2 rounded-lg text-center">
           <div className="text-xs text-slate-500 mb-1">PM2.5</div>
           <div className="text-sm font-medium text-slate-200">{pollutants.pm2_5} <span className="text-[10px] text-slate-500">µg/m³</span></div>
        </div>
        <div className="bg-slate-700/30 p-2 rounded-lg text-center">
           <div className="text-xs text-slate-500 mb-1">PM10</div>
           <div className="text-sm font-medium text-slate-200">{pollutants.pm10} <span className="text-[10px] text-slate-500">µg/m³</span></div>
        </div>
        <div className="bg-slate-700/30 p-2 rounded-lg text-center">
           <div className="text-xs text-slate-500 mb-1">NO₂</div>
           <div className="text-sm font-medium text-slate-200">{pollutants.no2} <span className="text-[10px] text-slate-500">µg/m³</span></div>
        </div>
        <div className="bg-slate-700/30 p-2 rounded-lg text-center">
           <div className="text-xs text-slate-500 mb-1">O₃</div>
           <div className="text-sm font-medium text-slate-200">{pollutants.o3} <span className="text-[10px] text-slate-500">µg/m³</span></div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityPanel;