import { useEventStore, EventPhase } from '../stores/useEventStore';
import { motion } from 'framer-motion';
import DraggableItem from './DraggableItem';
import { useEffect, useState } from 'react';

export default function CardSpawner() {
  const { phase, globalTime, timelineConfig, customLogoFly1, customLogoFly2 } = useEventStore();
  const [spawned, setSpawned] = useState(false);

  // Trigger spawn when energy convergence starts
  useEffect(() => {
    if (phase === EventPhase.ENERGY_CONVERGENCE || phase === EventPhase.COUNTER_SEQUENCE || phase === EventPhase.FINAL_CHARGE || phase === EventPhase.EXPLOSION || phase === EventPhase.SUCCESS) {
      setSpawned(true);
    } else if (phase === EventPhase.IDLE || phase === EventPhase.RESETTING) {
      setSpawned(false);
    }
  }, [phase]);

  // Calculate start time of explosion to trigger fly out
  const explosionStartTime = timelineConfig.countdown + timelineConfig.reveal + timelineConfig.energy + timelineConfig.counter + timelineConfig.finalCharge;
  
  // Progress of flying out (from 0 to 1 during the explosion phase)
  const flyProgress = Math.max(0, Math.min(1, (globalTime - explosionStartTime) / timelineConfig.explosion));

  if (!spawned) return null;

  return (
    <>
      <DraggableItem layoutKey="cardVietkings" isEndPos className="z-30">
        <motion.img 
          src={customLogoFly1 || "/logo/vietkings.webp"} 
          className="w-24 h-auto object-contain"
          alt=""
          onError={(e: any) => e.currentTarget.style.display='none'}
          initial={{ opacity: 0, scale: 0, x: 400, y: 150 }} // Start from center (offsetting the DraggableItem's position)
          animate={{ 
            opacity: phase === EventPhase.ENERGY_CONVERGENCE ? 0 : 1, 
            scale: flyProgress * 1.5 > 1 ? 1 : flyProgress * 1.5,
            x: 400 * (1 - flyProgress), // Fly from center to endPos
            y: 150 * (1 - flyProgress),
            rotate: -15 * flyProgress
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        />
      </DraggableItem>

      <DraggableItem layoutKey="cardGAB" isEndPos className="z-30">
        <motion.img 
          src={customLogoFly2 || "/logo/GAB.png"} 
          className="w-32 h-auto object-contain"
          alt=""
          onError={(e: any) => e.currentTarget.style.display='none'}
          initial={{ opacity: 0, scale: 0, x: -400, y: -150 }}
          animate={{ 
            opacity: phase === EventPhase.ENERGY_CONVERGENCE ? 0 : 1, 
            scale: flyProgress * 1.5 > 1 ? 1 : flyProgress * 1.5,
            x: -400 * (1 - flyProgress),
            y: -150 * (1 - flyProgress),
            rotate: 10 * flyProgress
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        />
      </DraggableItem>
    </>
  );
}
