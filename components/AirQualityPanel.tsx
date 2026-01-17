
import React from 'react';
import { CurrentWeather } from '../types';
import { Wind } from 'lucide-react';
import { t } from '../utils/i18n';

interface Props {
  data: CurrentWeather;
}

const AirQualityPanel: React.FC<Props> = ({ data }) => {
  const { aqi, pollutants } = data;
  const trans = t();

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 20) return { label: trans.aqiStatus.good, color: 'text-emerald-400', barColor: 'from-emerald-400 to-emerald-600' };
    if (aqi <= 40) return { label: trans.aqiStatus.fair, color: 'text-lime-400', barColor: 'from-lime-400 to-lime-600' };
    if (aqi <= 60) return { label: trans.aqiStatus.moderate, color: 'text-yellow-400', barColor: 'from-yellow-400 to-yellow-600' };
    if (aqi <= 80) return { label: trans.aqiStatus.poor, color: 'text-orange-400', barColor: 'from-orange-400 to-orange-600' };
    return { label: trans.aqiStatus.veryPoor, color: 'text-red-400', barColor: 'from-red-400 to-red-600' };
  };

  const status = getAQIStatus(aqi);
  const percentage = Math.min(100, (aqi / 100) * 100);

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-5 h-5 text-slate-400" />
        <h3 className="font-semibold text-slate-200">{trans.airQuality}</h3>
      </div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-3xl font-bold text-slate-100">{aqi}</span>
          <span className="text-sm text-slate-400 ml-1">AQI</span>
        </div>
        <span className={`text-lg font-medium ${status.color}`}>{status.label}</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6 relative">
         <div 
           className={`h-full absolute rounded-full bg-gradient-to-r ${status.barColor}`}
           style={{ width: `${percentage}%` }}
         ></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(pollutants).map(([key, value]) => (
          <div key={key} className="bg-slate-800/50 p-3 rounded-2xl text-center border border-slate-800">
             <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-tighter">{key.toUpperCase()}</div>
             <div className="text-sm font-bold text-slate-200">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityPanel;
