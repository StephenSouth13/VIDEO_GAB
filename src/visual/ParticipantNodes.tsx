import { useEventStore } from '../stores/useEventStore';

export default function ParticipantNodes() {
  const { participants, nodeShape, showNodes } = useEventStore();
  const nodes = Object.values(participants);
  
  if (nodes.length === 0 || !showNodes) return null;

  return (
    <div className="absolute bottom-[6%] left-0 right-0 flex justify-evenly items-end px-2 md:px-10 z-20 w-full overflow-hidden select-none">
      {nodes.map(node => {
        const isConfirmed = node.status === 'CONFIRMED';
        
        if (!node.name || node.name.trim() === '') {
          return <div key={node.id} className="flex flex-col items-center opacity-0 pointer-events-none w-[7%]"></div>;
        }

        return (
          <div key={node.id} className="flex flex-col items-center max-w-[8%] min-w-[40px] md:min-w-[65px] transition-transform">
            
            {/* 1. BIOMETRIC HAND SHAPE */}
            {nodeShape === 'hand' && (
              <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
                ${isConfirmed 
                  ? 'bg-yellow-400/20 border-2 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.9)] scale-110' 
                  : 'bg-black/40 border border-gray-700 opacity-60 scale-100 hover:border-yellow-500/50'
                }`}
              >
                <svg className={`w-8 h-8 md:w-12 md:h-12 ${isConfirmed ? 'text-yellow-300 drop-shadow-[0_0_10px_#FACC15]' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1.5 1.5 0 0 0-1.5 1.5v6.5h-1V4a1.5 1.5 0 0 0-3 0v7h-1V6.5a1.5 1.5 0 0 0-3 0v8c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5V7.5a1.5 1.5 0 0 0-3 0v4h-1V3.5A1.5 1.5 0 0 0 12 2z"/>
                </svg>
                {isConfirmed && <div className="absolute inset-0 rounded-xl bg-yellow-400/10 animate-ping"></div>}
              </div>
            )}

            {/* 2. RECTANGLE PILLAR */}
            {nodeShape === 'rectangle' && (
              <div className={`relative w-full aspect-[1/2.2] rounded-sm transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? 'bg-yellow-400/20 border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)] scale-110' 
                  : 'border-2 border-yellow-500/50 bg-black/40 opacity-50 scale-100'
                }`}
              >
                {isConfirmed && <div className="w-1/3 h-1/3 rounded-sm bg-yellow-200 shadow-[0_0_20px_white] animate-pulse" />}
              </div>
            )}

            {/* 3. ENERGY CIRCLE */}
            {nodeShape === 'circle' && (
              <div className={`relative rounded-full aspect-square transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? 'w-12 h-12 md:w-16 md:h-16 bg-yellow-400/20 border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)] scale-110' 
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
                  ? 'bg-gradient-to-br from-yellow-400/30 to-amber-600/30 border-2 border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-110' 
                  : 'border border-gray-600 bg-black/50 opacity-50 scale-100'
                }`}
              >
                <div className="text-[10px] font-bold text-yellow-300">GAB</div>
              </div>
            )}

            {/* 5. DIAMOND */}
            {nodeShape === 'diamond' && (
              <div className={`relative w-10 h-10 md:w-14 md:h-14 rotate-45 transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? 'bg-cyan-400/20 border-2 border-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.8)] scale-110' 
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
                  ? 'bg-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.9)] scale-110' 
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
                  ? 'bg-gradient-to-b from-yellow-300 to-amber-600 shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-110' 
                  : 'bg-gray-700 opacity-60 scale-100'
                }`}
              />
            )}

            {/* 8. HONOR STAR */}
            {nodeShape === 'star' && (
              <div className={`relative w-10 h-10 md:w-14 md:h-14 transition-all duration-500 flex items-center justify-center
                ${isConfirmed 
                  ? 'text-yellow-300 drop-shadow-[0_0_20px_#FACC15] scale-125' 
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
                  ? 'bg-cyan-400/30 border-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.9)] scale-110' 
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
                  ? 'w-12 h-12 md:w-16 md:h-16 border-yellow-400 animate-spin shadow-[0_0_25px_rgba(250,204,21,0.9)] scale-110' 
                  : 'w-10 h-10 md:w-14 md:h-14 border-gray-700 opacity-50 scale-100'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-yellow-300" />
              </div>
            )}

            {/* Connecting Vertical Energy Ray when Confirmed */}
            {isConfirmed && (
              <div className="absolute top-0 left-1/2 w-[3px] h-[180px] bg-gradient-to-t from-yellow-400 via-yellow-200 to-transparent -translate-x-1/2 -translate-y-full opacity-70 pointer-events-none"></div>
            )}
            
            <p className={`mt-2 font-sans tracking-wider whitespace-nowrap text-center uppercase leading-tight text-[9px] md:text-xs font-semibold ${isConfirmed ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-gray-400'}`}>
              {node.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}

