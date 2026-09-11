import { useEventStore } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion, AnimatePresence } from 'framer-motion';

export default function Countdown() {
  const { globalTime, timelineConfig } = useEventStore();
  
  // Calculate remaining seconds from globalTime
  const countdownDuration = timelineConfig.countdown;
  const remaining = Math.max(1, Math.min(countdownDuration, Math.ceil(countdownDuration - globalTime)));

  return (
    <DraggableItem layoutKey="countdown" className="flex items-center justify-center pointer-events-auto z-[95]">
      <AnimatePresence mode="wait">
        <motion.div
          key={remaining} 
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-w-[260px] min-h-[260px] md:min-w-[360px] md:min-h-[360px] rounded-full bg-black/35 border border-cyan-300/30 shadow-[0_0_90px_rgba(0,240,255,0.45)] backdrop-blur-sm flex items-center justify-center"
        >
          <h1 className="text-[180px] md:text-[260px] font-black text-white drop-shadow-[0_0_60px_rgba(0,240,255,1)] leading-none select-none font-mono">
            {remaining}
          </h1>
        </motion.div>
      </AnimatePresence>
    </DraggableItem>
  );
}
