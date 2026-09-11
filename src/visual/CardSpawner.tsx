import { useEventStore, EventPhase } from '../stores/useEventStore';
import { motion } from 'framer-motion';
import DraggableItem from './DraggableItem';
import { useEffect, useState } from 'react';

export default function CardSpawner() {
  const { 
    phase, 
    globalTime, 
    timelineConfig, 
    customLogoFly1, 
    customLogoFly2, 
    showCardVietkings, 
    showCardGAB,
    finalTemplate,
    finalCardVietkingsConfig,
    finalCardGABConfig
  } = useEventStore();
  const [spawned, setSpawned] = useState(false);

  // Trigger spawn when energy convergence starts
  useEffect(() => {
    if (
      phase === EventPhase.ENERGY_CONVERGENCE || 
      phase === EventPhase.COUNTER_SEQUENCE || 
      phase === EventPhase.FINAL_CHARGE || 
      phase === EventPhase.EXPLOSION || 
      phase === EventPhase.SUCCESS
    ) {
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

  // Compute template-specific target transforms
  let vietkingsRot = finalCardVietkingsConfig.rotate ?? -15;
  let gabRot = finalCardGABConfig.rotate ?? 10;
  let vietkingsCardStyle = "";
  let gabCardStyle = "";

  if (finalTemplate === 'top-sponsors') {
    vietkingsRot = 0;
    gabRot = 0;
    vietkingsCardStyle = "border-2 border-white/20 p-2 rounded-lg bg-black/40 backdrop-blur";
    gabCardStyle = "border-2 border-white/20 p-2 rounded-lg bg-black/40 backdrop-blur";
  } else if (finalTemplate === 'cyber-hologram') {
    vietkingsCardStyle = "border-2 border-cyan-400 p-2 rounded shadow-[0_0_25px_rgba(0,240,255,0.7)] bg-black/60 backdrop-blur";
    gabCardStyle = "border-2 border-cyan-400 p-2 rounded shadow-[0_0_25px_rgba(0,240,255,0.7)] bg-black/60 backdrop-blur";
  } else if (finalTemplate === 'golden-prestige') {
    vietkingsCardStyle = "border-2 border-yellow-400 p-2 rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.8)] bg-black/60 backdrop-blur";
    gabCardStyle = "border-2 border-yellow-400 p-2 rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.8)] bg-black/60 backdrop-blur";
  } else if (finalTemplate === 'minimal-clean') {
    vietkingsRot = 0;
    gabRot = 0;
  }

  return (
    <>
      {showCardVietkings && (
        <DraggableItem layoutKey="cardVietkings" isEndPos className="z-30">
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 400, y: 150 }}
            animate={{ 
              opacity: phase === EventPhase.ENERGY_CONVERGENCE ? 0 : 1, 
              scale: (flyProgress * 1.5 > 1 ? 1 : flyProgress * 1.5) * (finalCardVietkingsConfig.scale || 1),
              x: 400 * (1 - flyProgress),
              y: 150 * (1 - flyProgress),
              rotate: vietkingsRot * flyProgress
            }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            className={vietkingsCardStyle}
          >
            <img 
              src={customLogoFly1 || "/logo/vietkings.webp"} 
              className="w-24 md:w-32 h-auto object-contain drop-shadow-2xl"
              alt="Logo Vietkings"
              onError={(e: any) => e.currentTarget.style.display='none'}
            />
          </motion.div>
        </DraggableItem>
      )}

      {showCardGAB && (
        <DraggableItem layoutKey="cardGAB" isEndPos className="z-30">
          <motion.div
            initial={{ opacity: 0, scale: 0, x: -400, y: -150 }}
            animate={{ 
              opacity: phase === EventPhase.ENERGY_CONVERGENCE ? 0 : 1, 
              scale: (flyProgress * 1.5 > 1 ? 1 : flyProgress * 1.5) * (finalCardGABConfig.scale || 1),
              x: -400 * (1 - flyProgress),
              y: -150 * (1 - flyProgress),
              rotate: gabRot * flyProgress
            }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            className={gabCardStyle}
          >
            <img 
              src={customLogoFly2 || "/logo/GAB.png"} 
              className="w-32 md:w-44 h-auto object-contain drop-shadow-2xl"
              alt="Logo GAB Card"
              onError={(e: any) => e.currentTarget.style.display='none'}
            />
          </motion.div>
        </DraggableItem>
      )}
    </>
  );
}

