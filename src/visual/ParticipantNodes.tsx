import { useEventStore } from '../stores/useEventStore';

export default function ParticipantNodes() {
  const { participants, nodeShape, nodeGlowStyle, showNodes, layout } = useEventStore();
  const nodes = Object.values(participants);
  
  if (nodes.length === 0 || !showNodes) return null;

  const glowMap: Record<string, { aura: string; core: string; text: string; ray: string }> = {
    classic: {
      aura: 'bg-yellow-300/35 blur-xl shadow-[0_0_35px_rgba(250,204,21,0.9)]',
      core: 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.85)]',
      text: 'text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]',
      ray: 'from-yellow-400 via-yellow-200'
    },
    energy: {
      aura: 'bg-cyan-300/45 blur-2xl shadow-[0_0_50px_rgba(34,211,238,1)]',
      core: 'border-cyan-300 shadow-[0_0_38px_rgba(34,211,238,0.95)]',
      text: 'text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,1)]',
      ray: 'from-cyan-300 via-white'
    },
    blinding: {
      aura: 'bg-white/70 blur-2xl shadow-[0_0_80px_rgba(255,255,255,1)]',
      core: 'border-white shadow-[0_0_55px_rgba(255,255,255,1)]',
      text: 'text-white drop-shadow-[0_0_14px_rgba(255,255,255,1)]',
      ray: 'from-white via-yellow-100'
    },
    neon: {
      aura: 'bg-fuchsia-400/45 blur-2xl shadow-[0_0_55px_rgba(217,70,239,1)]',
      core: 'border-fuchsia-300 shadow-[0_0_42px_rgba(217,70,239,1)]',
      text: 'text-fuchsia-200 drop-shadow-[0_0_10px_rgba(217,70,239,1)]',
      ray: 'from-fuchsia-300 via-cyan-200'
    },
    plasma: {
      aura: 'bg-orange-300/45 blur-2xl shadow-[0_0_55px_rgba(251,146,60,1)]',
      core: 'border-orange-300 shadow-[0_0_44px_rgba(251,146,60,1)]',
      text: 'text-orange-200 drop-shadow-[0_0_10px_rgba(251,146,60,1)]',
      ray: 'from-orange-300 via-yellow-100'
    },
    halo: {
      aura: 'bg-emerald-300/40 blur-2xl shadow-[0_0_50px_rgba(52,211,153,1)]',
      core: 'border-emerald-300 shadow-[0_0_42px_rgba(52,211,153,1)]',
      text: 'text-emerald-200 drop-shadow-[0_0_10px_rgba(52,211,153,1)]',
      ray: 'from-emerald-300 via-white'
    },
  };
  const glow = glowMap[nodeGlowStyle] || glowMap.energy;
  const nodeLayout = layout.nodes || { x: 0, y: 0, scale: 1 };
  const nodeScale = Math.min(3, Math.max(0.25, Number(nodeLayout.scale ?? 1) || 1));

  return (
    <div
      className="absolute bottom-[6%] left-0 right-0 flex justify-evenly items-end px-2 md:px-10 z-30 w-full overflow-visible select-none"
      style={{
        transform: `translate(${nodeLayout.x || 0}px, ${nodeLayout.y || 0}px) scale(${nodeScale})`,
        transformOrigin: '50% 100%'
      }}
    >
      {nodes.map(node => {
        const isConfirmed = node.status === 'CONFIRMED';
        
        if (!node.name || node.name.trim() === '') {
          return <div key={node.id} className="flex flex-col items-center opacity-0 pointer-events-none w-[7%]"></div>;
        }

        return (
          <div key={node.id} className="relative flex flex-col items-center max-w-[8%] min-w-[40px] md:min-w-[65px] transition-transform">
            {isConfirmed && (
              <>
                <div className={`absolute -top-6 left-1/2 w-20 h-20 -translate-x-1/2 rounded-full animate-pulse pointer-events-none ${glow.aura}`} />
                <div className="absolute -top-2 left-1/2 w-28 h-28 -translate-x-1/2 rounded-full border border-white/25 animate-ping pointer-events-none" />
              </>
            )}
            
            {/* 1. BIOMETRIC HAND SHAPE */}
            {nodeShape === 'hand' && (
              <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
                ${isConfirmed 
                  ? `bg-white/10 border-2 ${glow.core} scale-110` 
                  : 'bg-black/40 border border-gray-700 opacity-60 scale-100 hover:border-yellow-500/50'
                }`}
              >
                <svg className={`w-8 h-8 md:w-12 md:h-12 ${isConfirmed ? glow.text : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1.5 1.5 0 0 0-1.5 1.5v6.5h-1V4a1.5 1.5 0 0 0-3 0v7h-1V6.5a1.5 1.5 0 0 0-3 0v8c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5V7.5a1.5 1.5 0 0 0-3 0v4h-1V3.5A1.5 1.5 0 0 0 12 2z"/>
                </svg>
                {isConfirmed && <div className="absolute inset-0 rounded-xl bg-white/15 animate-ping"></div>}
              </div>
            )}

            {/* 2. RECTANGLE PILLAR */}
            {nodeShape === 'rectangle' && (
              <div className={`relative w-full aspect-[1/2.2] rounded-sm transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `bg-white/10 border-4 ${glow.core} scale-110` 
                  : 'border-2 border-yellow-500/50 bg-black/40 opacity-50 scale-100'
                }`}
              >
                {isConfirmed && <div className="w-1/3 h-1/3 rounded-sm bg-white shadow-[0_0_24px_white] animate-pulse" />}
              </div>
            )}

            {/* 3. ENERGY CIRCLE */}
            {nodeShape === 'circle' && (
              <div className={`relative rounded-full aspect-square transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `w-12 h-12 md:w-16 md:h-16 bg-white/10 border-4 ${glow.core} scale-110` 
                  : 'w-10 h-10 md:w-14 md:h-14 border-2 border-yellow-500/50 bg-black/40 opacity-50 scale-100'
                }`}
              >
                {isConfirmed && <div className="w-1/2 h-1/2 rounded-full bg-yellow-200 shadow-[0_0_20px_white] animate-pulse" />}
              </div>
            )}

            {/* 4. GLOWING CARD */}
            {nodeShape === 'card' && (
              <div className={`relative w-full aspect-[1/1.5] rounded-lg transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `bg-gradient-to-br from-white/30 to-cyan-500/20 border-2 ${glow.core} scale-110` 
                  : 'border border-gray-600 bg-black/50 opacity-50 scale-100'
                }`}
              >
                <div className={`text-[10px] font-bold ${isConfirmed ? glow.text : 'text-yellow-300'}`}>GAB</div>
              </div>
            )}

            {/* 5. DIAMOND */}
            {nodeShape === 'diamond' && (
              <div className={`relative w-10 h-10 md:w-14 md:h-14 rotate-45 transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `bg-white/10 border-2 ${glow.core} scale-110` 
                  : 'border border-cyan-800 bg-black/40 opacity-50 scale-100'
                }`}
              >
                {isConfirmed && <div className="w-3 h-3 bg-white -rotate-45 shadow-[0_0_10px_white] animate-pulse" />}
              </div>
            )}

            {/* 6. CYBER HEXAGON */}
            {nodeShape === 'hexagon' && (
              <div className={`relative w-10 h-12 md:w-14 md:h-16 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `bg-white ${glow.core} scale-110` 
                  : 'bg-gray-800 opacity-60 scale-100'
                }`}
              >
                <div className="w-[85%] h-[85%] bg-black [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] flex items-center justify-center">
                  {isConfirmed && <div className="w-3 h-3 rounded-full bg-yellow-300 animate-pulse" />}
                </div>
              </div>
            )}

            {/* 7. ENERGY SHIELD */}
            {nodeShape === 'shield' && (
              <div className={`relative w-10 h-12 md:w-14 md:h-16 [clip-path:polygon(0%_0%,100%_0%,100%_70%,50%_100%,0%_70%)] transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `bg-gradient-to-b from-white to-cyan-200 ${glow.core} scale-110` 
                  : 'bg-gray-700 opacity-60 scale-100'
                }`}
              />
            )}

            {/* 8. HONOR STAR */}
            {nodeShape === 'star' && (
              <div className={`relative w-10 h-10 md:w-14 md:h-14 transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `${glow.text} scale-125` 
                  : 'text-gray-600 opacity-60 scale-100'
                }`}
              >
                <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
            )}

            {/* 9. CRYSTAL COLUMN */}
            {nodeShape === 'cylinder' && (
              <div className={`relative w-6 md:w-8 h-16 md:h-24 rounded-t-full border-t-4 border-l-2 border-r-2 transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `bg-white/20 ${glow.core} scale-110` 
                  : 'border-gray-700 bg-black/40 opacity-50 scale-100'
                }`}
              >
                {isConfirmed && <div className="w-2 h-10 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse" />}
              </div>
            )}

            {/* 10. PARTICLE RING */}
            {nodeShape === 'ring' && (
              <div className={`relative rounded-full aspect-square border-4 border-dashed transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? `w-12 h-12 md:w-16 md:h-16 animate-spin ${glow.core} scale-110` 
                  : 'w-10 h-10 md:w-14 md:h-14 border-gray-700 opacity-50 scale-100'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-yellow-300" />
              </div>
            )}

            {/* Connecting Vertical Energy Ray when Confirmed */}
            {isConfirmed && (
              <div className={`absolute top-0 left-1/2 w-[4px] h-[220px] bg-gradient-to-t ${glow.ray} to-transparent -translate-x-1/2 -translate-y-full opacity-85 blur-[0.5px] pointer-events-none`}></div>
            )}
            
            <p className={`mt-2 font-sans tracking-wider whitespace-nowrap text-center uppercase leading-tight text-[9px] md:text-xs font-semibold ${isConfirmed ? glow.text : 'text-gray-400'}`}>
              {node.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
