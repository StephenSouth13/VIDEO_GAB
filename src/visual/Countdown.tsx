import { useEventStore } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion, AnimatePresence } from 'framer-motion';

export default function Countdown() {
  const { globalTime, timelineConfig } = useEventStore();
  
  // Calculate remaining seconds from globalTime
  const countdownDuration = timelineConfig.countdown;
  const remaining = Math.max(1, Math.min(countdownDuration, Math.ceil(countdownDuration - globalTime)));

  return (
    <DraggableItem layoutKey="countdown" className="flex items-center justify-center pointer-events-auto">
      <AnimatePresence mode="wait">
        <motion.h1 
          key={remaining} 
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-[250px] md:text-[320px] font-black text-white drop-shadow-[0_0_60px_rgba(0,240,255,1)] leading-none select-none font-mono"
        >
          {remaining}
        </motion.h1>
      </AnimatePresence>
    </DraggableItem>
  );
}

