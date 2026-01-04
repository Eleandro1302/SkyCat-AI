import React from 'react';
import { DailyForecast } from '../types';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudDrizzle } from 'lucide-react';

interface Props {
  data: DailyForecast[];
}

const AnimatedIcon = ({ condition, precipChance }: { condition: string, precipChance: number }) => {
  // Styles for custom micro-animations
  const styles = `
    @keyframes drop-fall {
      0% { transform: translateY(-5px); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(5px); opacity: 0; }
    }
    @keyframes snow-drift {
      0% { transform: translate(0, -3px) rotate(0deg); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translate(-3px, 5px) rotate(180deg); opacity: 0; }
    }
    @keyframes pulse-storm {
      0%, 100% { opacity: 1; filter: drop-shadow(0 0 0 rgba(168, 85, 247, 0)); }
      50% { opacity: 0.8; filter: drop-shadow(0 0 5px rgba(168, 85, 247, 0.5)); }
    }
  `;

  if (condition === 'Storm') {
    return (
      <div className="relative w-8 h-8 flex items-center justify-center">
        <style>{styles}</style>
        <CloudLightning className="w-6 h-6 text-purple-400" style={{ animation: 'pulse-storm 2s infinite' }} />
      </div>
    );
  }

  if (condition === 'Rain' || (condition !== 'Snow' && precipChance > 40)) {
     const isHeavy = precipChance > 70;
     return (
       <div className="relative w-8 h-8 flex items-center justify-center">
         <style>{styles}</style>
         {isHeavy ? <CloudRain className="w-6 h-6 text-blue-400" /> : <CloudDrizzle className="w-6 h-6 text-blue-300" />}
         {/* Animated Drops */}
         <div className="absolute top-4 left-3 w-0.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'drop-fall 1s infinite linear' }}></div>
         <div className="absolute top-4 left-5 w-0.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'drop-fall 1s infinite linear', animationDelay: '0.3s' }}></div>
       </div>
     );
  }

  if (condition === 'Snow' || condition.includes('Ice')) {
    return (
      <div className="relative w-8 h-8 flex items-center justify-center">
        <style>{styles}</style>
        <CloudSnow className="w-6 h-6 text-white" />
        <div className="absolute top-4 left-2 w-1 h-1 bg-white rounded-full" style={{ animation: 'snow-drift 2s infinite linear' }}></div>
        <div className="absolute top-3 left-5 w-1 h-1 bg-white rounded-full" style={{ animation: 'snow-drift 2.5s infinite linear', animationDelay: '1s' }}></div>
      </div>
    );
  }

  if (condition === 'Sunny') {
    return <Sun className="w-6 h-6 text-amber-400 animate-[spin_10s_linear_infinite]" />;
  }
  
  if (condition === 'Partly Cloudy') {
    return <Cloud className="w-6 h-6 text-sky-200" />;
  }

  // Default cloudy
  return <Cloud className="w-6 h-6 text-slate-400" />;
};

const getPrecipitationType = (condition: string) => {
  if (condition === 'Snow' || condition.includes('Ice')) return 'Snow';
  if (condition === 'Rain' || condition === 'Storm' || condition.includes('Drizzle')) return 'Rain';
  return 'Rain';
};

const DailyForecastList: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((day, idx) => {
        const isPrecip = day.precipChance > 0;
        const precipType = getPrecipitationType(day.condition);
        
        let labelText = "";
        let chanceText = "";
        let textColor = "text-slate-400";

        if (isPrecip) {
            chanceText = `${day.precipChance}%`;
            labelText = precipType;
            textColor = precipType === 'Snow' ? 'text-white' : 'text-blue-300';
        } else {
            labelText = day.condition === 'Partly Cloudy' ? 'Cloudy' : day.condition;
            textColor = labelText === 'Sunny' ? 'text-amber-400' : 'text-slate-400';
        }

        return (
            <div key={idx} className="flex items-center justify-between text-sm group hover:bg-slate-700/30 p-2 rounded-lg transition-all duration-300">
            
            {/* Day Name */}
            <span className="w-10 text-slate-400 font-medium shrink-0">{day.day}</span>
            
            {/* Icon & Probability Label - Expanded & Explicit */}
            <div className="flex items-center gap-3 w-28 shrink-0">
                <div className="shrink-0">
                    <AnimatedIcon condition={day.condition} precipChance={day.precipChance} />
                </div>
                <div className="flex flex-col leading-tight">
                    {isPrecip && (
                        <span className={`text-xs font-bold ${textColor}`}>
                            {chanceText}
                        </span>
                    )}
                    <span className={`text-[10px] font-medium uppercase tracking-wide ${isPrecip ? 'text-slate-500' : textColor}`}>
                        {labelText}
                    </span>
                </div>
            </div>

            {/* Temperature Bar */}
            <div className="flex-1 px-2 hidden sm:block">
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden relative">
                    <div 
                    className={`h-full absolute rounded-full ${
                        day.condition === 'Snow' ? 'bg-gradient-to-r from-sky-200 to-white' : 
                        day.condition === 'Rain' ? 'bg-gradient-to-r from-blue-600 to-sky-400' :
                        'bg-gradient-to-r from-sky-500 to-amber-400'
                    }`}
                    style={{ 
                        left: `${Math.min(100, Math.max(0, (day.minTemp + 10) * 2))}%`, 
                        right: `${100 - Math.min(100, Math.max(0, (day.maxTemp + 10) * 2))}%`
                    }}
                    ></div>
                </div>
            </div>

            {/* High/Low */}
            <div className="flex gap-3 text-slate-300 w-16 justify-end font-mono shrink-0">
                <span className="opacity-60">{day.minTemp}°</span>
                <span className="font-bold">{day.maxTemp}°</span>
            </div>
            </div>
        );
      })}
    </div>
  );
};

export default DailyForecastList;