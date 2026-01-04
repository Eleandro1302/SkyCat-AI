import React, { useMemo } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Zap, Map as MapIcon, Droplets } from 'lucide-react';

interface RadarViewProps {
  condition?: string;
  lat?: number;
  lng?: number;
  precipChance?: number;
}

const RadarView: React.FC<RadarViewProps> = ({ condition = 'Sunny', lat = 0, lng = 0, precipChance = 0 }) => {
  
  // Determine weather parameters
  const weatherState = useMemo(() => {
    const c = condition.toLowerCase();
    const isStorm = c.includes('storm') || c.includes('thunder');
    const isRain = c.includes('rain') || c.includes('drizzle') || c.includes('shower');
    const isSnow = c.includes('snow') || c.includes('ice') || c.includes('flurry');
    const isCloudy = c.includes('cloud') || c.includes('overcast');
    const isPartly = c.includes('partly');
    const isClear = !isStorm && !isRain && !isSnow && !isCloudy && !isPartly;

    return { isStorm, isRain, isSnow, isCloudy, isPartly, isClear };
  }, [condition]);

  // Generate Cloud Particles (Static data, animated via CSS)
  const clouds = useMemo(() => {
    if (weatherState.isClear) return [];
    
    const count = weatherState.isPartly ? 4 : 12;
    const baseColor = (weatherState.isRain || weatherState.isStorm) ? 'bg-slate-600' : 'bg-slate-200'; 
    
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60 + 10}%`, // Keep clouds mostly in upper/mid area or distributed
      size: `${Math.random() * 80 + 60}px`, // css size
      opacity: (weatherState.isRain || weatherState.isStorm) ? Math.random() * 0.4 + 0.4 : Math.random() * 0.3 + 0.1,
      duration: `${Math.random() * 40 + 60}s`, // Very slow drift
      delay: `-${Math.random() * 60}s`, // Start at random points in animation
      scale: Math.random() * 0.5 + 1,
      colorClass: baseColor
    }));
  }, [weatherState]);

  // Generate Precipitation Particles
  const precipitation = useMemo(() => {
    if (!weatherState.isRain && !weatherState.isSnow && !weatherState.isStorm) return [];

    const count = weatherState.isStorm ? 80 : 50;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      // Rain needs different animation timing than snow
      duration: weatherState.isSnow ? `${Math.random() * 3 + 2}s` : `${Math.random() * 0.5 + 0.5}s`,
      delay: `-${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.3,
      size: weatherState.isSnow ? Math.random() * 3 + 2 : Math.random() * 20 + 10 // Snow size vs Rain streak length
    }));
  }, [weatherState]);

  // Calculate Bounding Box for OpenStreetMap Embed
  // Reduced offset from 0.03 to 0.01 for a much closer "Street/Neighborhood" zoom level
  const bboxOffset = 0.01;
  const bbox = `${lng - bboxOffset},${lat - bboxOffset},${lng + bboxOffset},${lat + bboxOffset}`;
  
  return (
    <div className="relative w-full h-72 bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700 shadow-lg group isolate">
      
      {/* CSS Styles for Animations */}
      <style>{`
        @keyframes drift {
          0% { transform: translateX(-50px) scale(1); }
          50% { transform: translateX(20px) scale(1.1); }
          100% { transform: translateX(-50px) scale(1); }
        }
        @keyframes rain-fall {
          0% { transform: translateY(-20px) scaleY(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(350px) scaleY(1); opacity: 0; }
        }
        @keyframes snow-fall {
          0% { transform: translate(0, -10px); opacity: 0; }
          20% { opacity: 1; transform: translate(-10px, 50px); }
          40% { transform: translate(15px, 100px); }
          60% { transform: translate(-10px, 200px); }
          100% { transform: translate(5px, 350px); opacity: 0; }
        }
        @keyframes lightning-flash {
          0%, 95%, 98% { opacity: 0; }
          96%, 99% { opacity: 0.8; background-color: rgba(255, 255, 255, 0.3); }
          97%, 100% { opacity: 0; }
        }
      `}</style>

      {/* 1. Real Map Layer (OpenStreetMap) */}
      <div className="absolute inset-0 z-0 bg-[#1e293b]">
         <iframe 
           width="100%" 
           height="100%" 
           frameBorder="0" 
           scrolling="no" 
           marginHeight={0} 
           marginWidth={0} 
           src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
           style={{ filter: 'grayscale(100%) invert(90%) hue-rotate(180deg) contrast(1.2) brightness(0.8)' }}
           className="w-full h-full pointer-events-none scale-125" 
         ></iframe>
      </div>

      {/* 2. Cloud Layer (Parallax CSS Animation) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className={`absolute rounded-full blur-2xl ${cloud.colorClass}`}
            style={{
              left: cloud.left,
              top: cloud.top,
              width: cloud.size,
              height: cloud.size,
              opacity: cloud.opacity,
              animation: `drift ${cloud.duration} ease-in-out infinite`,
              animationDelay: cloud.delay,
            }}
          />
        ))}
      </div>

      {/* 3. Storm Lighting Layer (CSS Strobe) */}
      {weatherState.isStorm && (
        <div 
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          style={{ animation: 'lightning-flash 5s infinite' }}
        ></div>
      )}

      {/* 4. Precipitation Layer (CSS Particles) */}
      {(weatherState.isRain || weatherState.isSnow || weatherState.isStorm) && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
           {precipitation.map((p) => (
             <div 
               key={p.id}
               className={`absolute ${weatherState.isSnow ? 'bg-white rounded-full' : 'bg-gradient-to-b from-transparent via-sky-300 to-transparent'}`}
               style={{
                 left: p.left,
                 top: -20, // Start above container
                 width: weatherState.isSnow ? `${p.size}px` : '1px',
                 height: weatherState.isSnow ? `${p.size}px` : `${p.size}px`,
                 opacity: p.opacity,
                 animation: `${weatherState.isSnow ? 'snow-fall' : 'rain-fall'} ${p.duration} linear infinite`,
                 animationDelay: p.delay,
               }}
             />
           ))}
        </div>
      )}

      {/* 5. UI Overlay */}
      <div className="absolute inset-0 z-40 p-3 pointer-events-none flex flex-col justify-between">
        
        {/* Header Bar */}
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-1 border border-slate-700 rounded backdrop-blur-sm shadow-lg">
             <MapIcon className="w-3 h-3 text-sky-400" />
             LIVE RADAR
           </div>

           {/* Precipitation Probability Badge */}
           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-1 border border-slate-700 rounded backdrop-blur-sm shadow-lg">
             <Droplets className={`w-3 h-3 ${precipChance > 0 ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
             {weatherState.isSnow ? 'SNOW' : 'RAIN'} CHANCE: <span className="text-white font-bold">{precipChance}%</span>
           </div>
        </div>

        <div className="flex justify-between items-end">
           <div className="text-[9px] font-mono text-slate-400 bg-slate-900/50 p-1 rounded">
             © OpenStreetMap
           </div>
           
           <div className="bg-slate-900/90 p-1.5 rounded border border-slate-700 text-slate-300 backdrop-blur-sm shadow-lg">
              {weatherState.isClear && <Sun className="w-4 h-4 text-amber-400" />}
              {weatherState.isRain && <CloudRain className="w-4 h-4 text-blue-400" />}
              {weatherState.isSnow && <CloudSnow className="w-4 h-4 text-white" />}
              {weatherState.isStorm && <Zap className="w-4 h-4 text-purple-400" />}
              {(weatherState.isCloudy || weatherState.isPartly) && <Cloud className="w-4 h-4 text-slate-300" />}
           </div>
        </div>
      </div>
      
      {/* Location Marker (Center) */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-sky-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 animate-ping"></div>
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-sky-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-40 border border-white shadow-lg"></div>

    </div>
  );
};

export default RadarView;