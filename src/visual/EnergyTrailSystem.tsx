import { useEventStore, EventPhase } from '../stores/useEventStore';

export default function EnergyTrailSystem() {
  const { phase, trailColor } = useEventStore();
  
  if (phase !== EventPhase.ENERGY_CONVERGENCE && phase !== EventPhase.COUNTER_SEQUENCE && phase !== EventPhase.FINAL_CHARGE) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex justify-center items-center overflow-hidden">
       {/* CSS-based energy trails moving to center */}
       <div 
         className="absolute w-2 h-[800px] animate-spin opacity-80 blur-sm"
         style={{ background: `linear-gradient(to top, transparent, ${trailColor}, transparent)` }}
       ></div>
       <div 
         className="absolute w-[800px] h-2 animate-spin opacity-80 blur-sm" 
         style={{ animationDirection: 'reverse', background: `linear-gradient(to right, transparent, ${trailColor}, transparent)` }}
       ></div>
       <div 
         className="absolute w-2 h-[800px] animate-ping opacity-50 blur-md"
         style={{ background: `linear-gradient(to top, transparent, ${trailColor}, transparent)` }}
       ></div>
    </div>
  );
}
