import { useEventStore, EventPhase } from '../stores/useEventStore';

export default function EnergyTrailSystem() {
  const { phase } = useEventStore();
  
  if (phase !== EventPhase.ENERGY_CONVERGENCE && phase !== EventPhase.COUNTER_SEQUENCE && phase !== EventPhase.FINAL_CHARGE) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex justify-center items-center">
       {/* CSS-based energy trails moving to center */}
       <div className="absolute w-2 h-[500px] bg-gradient-to-t from-transparent via-gab-electric to-transparent animate-spin opacity-50 blur-sm"></div>
       <div className="absolute w-[500px] h-2 bg-gradient-to-r from-transparent via-gab-cyan-light to-transparent animate-spin opacity-50 blur-sm" style={{animationDirection: 'reverse'}}></div>
    </div>
  );
}
