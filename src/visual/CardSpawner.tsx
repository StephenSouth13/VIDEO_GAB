import { useEventStore, EventPhase } from '../stores/useEventStore';
import { useEffect, useState } from 'react';

export default function CardSpawner() {
  const { phase, layout } = useEventStore();
  const [spawned, setSpawned] = useState(false);

  // Trigger spawn when energy convergence starts
  useEffect(() => {
    if (phase === EventPhase.ENERGY_CONVERGENCE) {
      setSpawned(true);
    } else if (phase === EventPhase.IDLE || phase === EventPhase.RESETTING) {
      setSpawned(false);
    }
  }, [phase]);

  if (!spawned) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
      style={{
        transform: `translateY(${layout.logo.y}px)`
      }}
    >
      {/* VietKings Logo flying left */}
      <img 
        src="/logo/vietkings.webp" 
        className="absolute left-1/2 top-1/2 w-24 h-auto object-contain animate-fly-left"
        style={{ transform: 'translate(-50%, -50%)', opacity: 0, animation: 'flyLeft 3s ease-out forwards' }}
        alt=""
        onError={(e) => e.currentTarget.style.display='none'}
      />
      
      {/* GAB Card flying right */}
      <img 
        src="/logo/GAB.png" 
        className="absolute left-1/2 top-1/2 w-32 h-auto object-contain animate-fly-right"
        style={{ transform: 'translate(-50%, -50%)', opacity: 0, animation: 'flyRight 3s ease-out forwards' }}
        alt=""
        onError={(e) => e.currentTarget.style.display='none'}
      />
    </div>
  );
}
