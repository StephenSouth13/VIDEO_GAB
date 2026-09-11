import { useEventStore, EventPhase } from '../stores/useEventStore';

export default function EnergyTrailSystem() {
  const { phase, trailColor, energyType, isPaused } = useEventStore();
  
  if (phase !== EventPhase.ENERGY_CONVERGENCE && phase !== EventPhase.COUNTER_SEQUENCE && phase !== EventPhase.FINAL_CHARGE) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex justify-center items-center overflow-hidden">
       {/* CSS-based energy trails moving to center */}
       {energyType === 'default' && (
         <>
           <div 
             className="absolute w-2 h-[800px] animate-spin opacity-80 blur-sm mix-blend-screen"
             style={{ background: `linear-gradient(to top, transparent, ${trailColor}, transparent)`, animationPlayState: isPaused ? 'paused' : 'running' }}
           ></div>
           <div 
             className="absolute w-[800px] h-2 animate-spin opacity-80 blur-sm mix-blend-screen" 
             style={{ animationDirection: 'reverse', background: `linear-gradient(to right, transparent, ${trailColor}, transparent)`, animationPlayState: isPaused ? 'paused' : 'running' }}
           ></div>
           <div 
             className="absolute w-2 h-[800px] animate-ping opacity-50 blur-md mix-blend-screen"
             style={{ background: `linear-gradient(to top, transparent, ${trailColor}, transparent)`, animationPlayState: isPaused ? 'paused' : 'running' }}
           ></div>
         </>
       )}
       {energyType === 'laser' && (
         <>
           <div className="absolute w-[200vw] h-1 animate-ping blur-sm mix-blend-screen" style={{ backgroundColor: trailColor, animationPlayState: isPaused ? 'paused' : 'running', transform: 'rotate(45deg)' }}></div>
           <div className="absolute w-[200vw] h-1 animate-ping blur-sm mix-blend-screen" style={{ backgroundColor: trailColor, animationPlayState: isPaused ? 'paused' : 'running', transform: 'rotate(-45deg)' }}></div>
           <div className="absolute w-[200vw] h-1 animate-ping blur-sm mix-blend-screen" style={{ backgroundColor: trailColor, animationPlayState: isPaused ? 'paused' : 'running', transform: 'rotate(90deg)' }}></div>
         </>
       )}
       {energyType === 'spirit-bomb' && (
         <div className="absolute w-[300px] h-[300px] rounded-full animate-ping blur-xl mix-blend-screen opacity-50" style={{ backgroundColor: trailColor, animationPlayState: isPaused ? 'paused' : 'running' }}></div>
       )}
       {energyType === 'hexagon' && (
         <div className="absolute w-[400px] h-[400px] border-8 animate-spin mix-blend-screen opacity-50" style={{ borderColor: trailColor, borderRadius: '20%', animationPlayState: isPaused ? 'paused' : 'running' }}></div>
       )}
    </div>
  );
}
