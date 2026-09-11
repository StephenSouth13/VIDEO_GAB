import { useEventStore, EventPhase } from '../stores/useEventStore';
import { motion } from 'framer-motion';
import DraggableItem from './DraggableItem';

export default function CardSpawner() {
  const { 
    phase, 
    customLogoFly1, 
    customLogoFly2, 
    showCardVietkings, 
    showCardGAB,
    finalTemplate,
    finalCardVietkingsConfig,
    finalCardGABConfig
  } = useEventStore();

  if (phase !== EventPhase.SUCCESS) return null;

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
              opacity: 1, 
              scale: finalCardVietkingsConfig.scale || 1,
              x: 0,
              y: 0,
              rotate: vietkingsRot
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
              opacity: 1, 
              scale: finalCardGABConfig.scale || 1,
              x: 0,
              y: 0,
              rotate: gabRot
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
