import React, { useMemo } from 'react';

interface WeatherEffectsProps {
  condition?: string;
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ condition = '' }) => {
  const weatherState = useMemo(() => {
    const c = condition.toLowerCase();
    const isStorm = c.includes('storm') || c.includes('thunder');
    const isRain = c.includes('rain') || c.includes('drizzle') || c.includes('shower');
    const isSnow = c.includes('snow') || c.includes('ice') || c.includes('flurry') || c.includes('blizzard');
    
    return { isStorm, isRain, isSnow };
  }, [condition]);

  // Don't render anything if weather is calm
  if (!weatherState.isRain && !weatherState.isSnow && !weatherState.isStorm) {
    return null;
  }

  // Generate particles based on condition
  const particles = useMemo(() => {
    const count = weatherState.isSnow ? 50 : 80; // Fewer particles for snow, more for rain
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: weatherState.isSnow 
        ? `${Math.random() * 5 + 5}s` // Slow snow (5-10s)
        : `${Math.random() * 0.5 + 0.5}s`, // Fast rain (0.5-1s)
      animationDelay: `-${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.1,
      size: weatherState.isSnow 
        ? `${Math.random() * 4 + 2}px` // Snow size
        : `${Math.random() * 2 + 1}px`  // Rain width
    }));
  }, [weatherState.isSnow, weatherState.isRain]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes fall-rain {
          0% { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }
        @keyframes fall-snow {
          0% { transform: translateY(-10vh) translateX(-10px); opacity: 0; }
          20% { opacity: 1; transform: translateX(10px); }
          40% { transform: translateX(-10px); }
          60% { transform: translateX(10px); }
          100% { transform: translateY(110vh) translateX(-10px); opacity: 0; }
        }
        @keyframes flash-storm {
          0%, 95%, 98% { opacity: 0; }
          96%, 99% { opacity: 0.15; background-color: white; }
          97%, 100% { opacity: 0; }
        }
      `}</style>

      {/* Storm Flashes */}
      {weatherState.isStorm && (
        <div 
          className="absolute inset-0 bg-white mix-blend-overlay"
          style={{ animation: 'flash-storm 8s infinite' }}
        />
      )}

      {/* Particles (Rain or Snow) */}
      {(weatherState.isRain || weatherState.isSnow) && particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${weatherState.isSnow ? 'bg-white blur-[1px]' : 'bg-gradient-to-b from-transparent via-blue-400/50 to-transparent w-[1px] h-[20px]'}`}
          style={{
            left: p.left,
            top: -20,
            width: weatherState.isSnow ? p.size : '1px',
            height: weatherState.isSnow ? p.size : '30px',
            opacity: p.opacity,
            animation: `${weatherState.isSnow ? 'fall-snow' : 'fall-rain'} ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
      
      {/* Fog Overlay for Rain/Snow to add atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-900/40 z-10"></div>
    </div>
  );
};

export default WeatherEffects;
