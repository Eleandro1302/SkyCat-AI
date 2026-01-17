
import React, { useMemo } from 'react';
import { Target, Wind } from 'lucide-react';
import { t } from '../utils/i18n';

interface RadarViewProps {
  condition?: string;
  lat?: number;
  lng?: number;
  precipChance?: number;
  windSpeed?: number;
}

const RadarView: React.FC<RadarViewProps> = ({ condition = 'Sunny', lat = 0, lng = 0, precipChance = 0, windSpeed = 0 }) => {
  const trans = t();
  
  const weatherState = useMemo(() => {
    const c = condition.toLowerCase();
    const isStorm = c.includes('storm') || c.includes('thunder');
    const isRain = c.includes('rain') || c.includes('drizzle') || c.includes('shower');
    const isSnow = c.includes('snow') || c.includes('ice') || c.includes('flurry');
    const isWindy = windSpeed > 40 || c.includes('wind');
    return { isStorm, isRain, isSnow, isWindy };
  }, [condition, windSpeed]);

  /**
   * Níveis de zoom otimizados (bbox offset)
   * Quanto menor o valor, mais próximo o zoom.
   */
  const dynamicBboxOffset = useMemo(() => {
    // Zoom Nível 1: Eventos críticos (Rua)
    if (weatherState.isStorm || (precipChance >= 85)) return 0.002;
    
    // Zoom Nível 2: Chuva/Neve ativa (Bairro)
    if (weatherState.isRain || weatherState.isSnow || (precipChance >= 40)) return 0.005;
    
    // Zoom Nível 3: Padrão (Cidade próxima) - Ajustado para ser mais próximo que o anterior
    return 0.012;
  }, [weatherState, precipChance]);

  // Evita renderizar o mapa no "ponto zero" (Oceano Atlântico) antes da localização carregar
  const isLocationReady = lat !== 0 || lng !== 0;

  // Cálculo do bounding box seguindo o padrão OSM: minLon, minLat, maxLon, maxLat
  const bbox = useMemo(() => {
    const offsetLon = dynamicBboxOffset;
    const offsetLat = dynamicBboxOffset * 0.6; // Ajuste para o aspecto retangular do container
    return `${lng - offsetLon},${lat - offsetLat},${lng + offsetLon},${lat + offsetLat}`;
  }, [lat, lng, dynamicBboxOffset]);
  
  // Partículas de clima para a camada visual do radar
  const weatherParticles = useMemo(() => {
    if (!weatherState.isRain && !weatherState.isSnow && !weatherState.isWindy) return [];
    const count = 30;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: weatherState.isSnow ? '4s' : (weatherState.isWindy ? '1s' : '0.6s'),
      opacity: Math.random() * 0.4 + 0.1
    }));
  }, [weatherState]);

  return (
    <div className="relative w-full h-80 bg-[#020617] rounded-[2.5rem] overflow-hidden border border-slate-800/50 group isolate shadow-2xl">
      <style>{`
        @keyframes map-focus {
          0% { transform: scale(1.4); filter: blur(8px) grayscale(1); }
          100% { transform: scale(1.15); filter: blur(0) grayscale(1) invert(0.9) hue-rotate(180deg) contrast(1.2); }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes radar-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        @keyframes rain-fall-radar {
          0% { transform: translateY(-50px) translateX(10px); }
          100% { transform: translateY(350px) translateX(-10px); }
        }
        @keyframes snow-fall-radar {
          0% { transform: translateY(-20px) translateX(-5px); }
          50% { transform: translateX(5px); }
          100% { transform: translateY(350px) translateX(-5px); }
        }
        @keyframes wind-dash {
          0% { transform: translateX(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(400px); opacity: 0; }
        }
        @keyframes radar-storm-flash {
          0%, 94%, 98% { opacity: 0; }
          96% { opacity: 0.3; background: white; }
        }
      `}</style>

      {/* Camada do Mapa - Só renderiza se houver localização válida */}
      <div className="absolute inset-0 z-0 bg-slate-900">
         {isLocationReady ? (
           <iframe 
             key={`map-${lat}-${lng}-${dynamicBboxOffset}`} 
             width="100%" 
             height="100%" 
             frameBorder="0" 
             src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
             style={{ animation: 'map-focus 2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
             className="w-full h-full pointer-events-none origin-center"
             title="Weather Radar Map"
           ></iframe>
         ) : (
           <div className="w-full h-full flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
           </div>
         )}
         <div className="absolute inset-0 bg-slate-900/20 pointer-events-none"></div>
      </div>

      {/* Camada de Animação de Clima */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {weatherState.isStorm && (
          <div className="absolute inset-0 z-10" style={{ animation: 'radar-storm-flash 5s infinite' }}></div>
        )}
        
        {weatherState.isRain && weatherParticles.map(p => (
          <div 
            key={p.id}
            className="absolute w-[1px] h-6 bg-sky-400/40"
            style={{
              left: p.left,
              top: '-20px',
              opacity: p.opacity,
              animation: `rain-fall-radar ${p.duration} linear infinite`,
              animationDelay: p.delay
            }}
          />
        ))}

        {weatherState.isSnow && weatherParticles.map(p => (
          <div 
            key={p.id}
            className="absolute w-1.5 h-1.5 bg-white/60 rounded-full blur-[1px]"
            style={{
              left: p.left,
              top: '-20px',
              opacity: p.opacity,
              animation: `snow-fall-radar ${p.duration} ease-in-out infinite`,
              animationDelay: p.delay
            }}
          />
        ))}

        {weatherState.isWindy && weatherParticles.slice(0, 15).map(p => (
          <div 
            key={p.id}
            className="absolute h-[1px] w-12 bg-slate-100/30"
            style={{
              left: '-50px',
              top: p.top,
              opacity: p.opacity,
              animation: `wind-dash ${p.duration} linear infinite`,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      {/* Interface Overlays */}
      <div className="absolute inset-0 z-40 p-5 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-2 text-[10px] font-bold text-sky-400 bg-slate-950/90 px-3 py-1.5 border border-sky-500/20 rounded-lg backdrop-blur-xl shadow-lg">
             <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
             {trans.liveRadar}
           </div>
           
           <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 bg-slate-950/90 px-3 py-1.5 border border-slate-800/50 rounded-lg backdrop-blur-xl shadow-lg">
               {trans.precipChance} {weatherState.isSnow ? trans.snow : trans.rain}: <span className="text-white ml-1 font-black">{precipChance}%</span>
             </div>
             {weatherState.isWindy && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 bg-slate-950/90 px-3 py-1 border border-amber-500/20 rounded-lg backdrop-blur-xl shadow-lg animate-pulse">
                  <Wind className="w-3 h-3" />
                  <span>VENTOS: {windSpeed} km/h</span>
                </div>
             )}
           </div>
        </div>

        <div className="flex justify-center mb-2">
           <div className="bg-slate-950/90 px-4 py-1.5 rounded-full border border-slate-800/50 backdrop-blur-md flex items-center gap-2 shadow-xl">
              <span className="text-[9px] text-slate-400 font-bold tracking-tighter uppercase">
                {dynamicBboxOffset <= 0.003 ? 'ZONA TÁTICA' : dynamicBboxOffset <= 0.006 ? 'VISTA LOCAL' : 'VISTA REGIONAL'}
              </span>
           </div>
        </div>
      </div>

      {/* Tactical Center Marker */}
      <div className="absolute top-1/2 left-1/2 z-30">
        <div className="absolute w-24 h-24 border border-sky-500/10 rounded-full -translate-x-1/2 -translate-y-1/2">
           <div className="w-full h-full bg-gradient-to-tr from-sky-500/10 to-transparent rounded-full" style={{ animation: 'radar-sweep 5s linear infinite' }}></div>
        </div>
        <div className="absolute w-16 h-16 bg-sky-500/10 rounded-full animate-[radar-pulse_2.5s_infinite]"></div>
        <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <Target className="w-6 h-6 text-sky-500 drop-shadow-[0_0_12px_rgba(14,165,233,0.9)]" />
        </div>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default RadarView;
