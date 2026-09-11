import { EVENT_CONFIG } from '../config/eventConfig';
import { useEventStore, EventPhase } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion } from 'framer-motion';

export default function FinalScreen() {
  const { phase, layout, finalTemplate, showCenterLogoFinal, customLogoCenter } = useEventStore();
  const visible = phase === EventPhase.SUCCESS;

  const finalMessage = layout?.finalMessage || EVENT_CONFIG.finalMessage;

  return (
    <DraggableItem layoutKey="finalMessage" className="flex flex-col items-center justify-center text-center w-full select-none z-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.95 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center px-4"
      >
        {/* Optional Center Logo for Hero template or when enabled */}
        {(showCenterLogoFinal || finalTemplate === 'center-hero') && (
          <motion.img 
            src={customLogoCenter || "/logo/GAB.png"} 
            alt="Hero Logo"
            className="w-36 md:w-56 h-auto object-contain mb-6 drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]"
            initial={{ scale: 0 }}
            animate={{ scale: visible ? 1 : 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onError={(e: any) => e.currentTarget.style.display='none'}
          />
        )}

        {/* 1. CYBER HOLOGRAM TEMPLATE */}
        {finalTemplate === 'cyber-hologram' && (
          <div className="relative p-6 md:p-10 border-2 border-cyan-400/50 bg-black/50 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.4)]">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

            <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 mb-4 tracking-wider font-mono">
              {finalMessage.line1 || EVENT_CONFIG.finalMessage.line1}
            </h1>
            <h2 className="text-2xl md:text-5xl text-cyan-300 font-mono tracking-wide drop-shadow-[0_0_20px_rgba(0,240,255,0.9)]">
              {finalMessage.line2 || EVENT_CONFIG.finalMessage.line2}
            </h2>
          </div>
        )}

        {/* 2. GOLDEN PRESTIGE TEMPLATE */}
        {finalTemplate === 'golden-prestige' && (
          <div className="relative p-6 md:p-10 border-2 border-yellow-500/40 bg-black/60 backdrop-blur-md rounded-3xl shadow-[0_0_60px_rgba(250,204,21,0.5)]">
            <div className="text-yellow-400 text-2xl md:text-3xl mb-2 tracking-[0.3em] uppercase font-serif">✦ VIETNAM RECORD HOLDERS ✦</div>
            <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 mb-5 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)]">
              {finalMessage.line1 || EVENT_CONFIG.finalMessage.line1}
            </h1>
            <h2 className="text-3xl md:text-5xl text-yellow-200 font-semibold tracking-wider drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]">
              {finalMessage.line2 || EVENT_CONFIG.finalMessage.line2}
            </h2>
          </div>
        )}

        {/* 3. STANDARD DUAL CARDS & MINIMAL CLEAN TEMPLATES */}
        {finalTemplate !== 'cyber-hologram' && finalTemplate !== 'golden-prestige' && (
          <>
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] tracking-tight">
              {finalMessage.line1 || EVENT_CONFIG.finalMessage.line1}
            </h1>
            <h2 className="text-3xl md:text-6xl text-gab-cyan-light drop-shadow-[0_0_20px_rgba(91,192,190,0.5)] tracking-wide">
              {finalMessage.line2 || EVENT_CONFIG.finalMessage.line2}
            </h2>
          </>
        )}
      </motion.div>
    </DraggableItem>
  );
}

