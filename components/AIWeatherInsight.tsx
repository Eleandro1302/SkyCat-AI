import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateWeatherInsight } from '../services/geminiService';
import { WeatherData } from '../types';
import { t } from '../utils/i18n';

interface Props {
  weatherData: WeatherData;
}

const AIWeatherInsight: React.FC<Props> = ({ weatherData }) => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const trans = t();

  const fetchInsight = async () => {
    setLoading(true);
    const result = await generateWeatherInsight(weatherData);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData.location.city]); // Re-fetch only when city changes

  return (
    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-4 rounded-2xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-indigo-200 font-semibold text-sm tracking-wide">{trans.aiInsightTitle}</h3>
        </div>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="text-indigo-300 hover:text-white transition-colors p-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="min-h-[3rem]">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-indigo-500/20 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-500/20 rounded w-1/2"></div>
            <p className="text-[10px] text-indigo-400 mt-1 uppercase tracking-widest">{trans.establishingData}</p>
          </div>
        ) : (
          <p className="text-slate-200 text-sm leading-relaxed font-light">
            {insight}
          </p>
        )}
      </div>
    </div>
  );
};

export default AIWeatherInsight;