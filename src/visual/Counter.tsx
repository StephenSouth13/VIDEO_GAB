/* oxlint-disable react/set-state-in-effect */
import { EVENT_CONFIG } from '../config/eventConfig';
import { useEventStore, EventPhase } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Counter() {
  const { phase, globalTime, timelineConfig } = useEventStore();
  const [displayedValue, setDisplayedValue] = useState(0);
  const lastValueRef = useRef(0);
  const lastPhaseRef = useRef(phase);
  
  const visible = phase === EventPhase.COUNTER_SEQUENCE || phase === EventPhase.FINAL_CHARGE;

  const counterStartTime = timelineConfig.countdown + timelineConfig.reveal + timelineConfig.energy;
  const counterDuration = Math.max(0.001, timelineConfig.counter);

  let progress = (globalTime - counterStartTime) / counterDuration;
  progress = Math.max(0, Math.min(1, progress));
  
  // Easing function power2.inOut
  const easeInOutQuad = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easedProgress = easeInOutQuad(progress);
  
  const rawValue = Math.floor(easedProgress * EVENT_CONFIG.counter.finalValue);

  useEffect(() => {
    const shouldResetCounter =
      lastPhaseRef.current !== phase &&
      phase === EventPhase.COUNTER_SEQUENCE &&
      globalTime <= counterStartTime + 0.25;

    if (!visible) {
      lastValueRef.current = 0;
      setDisplayedValue(0);
    } else if (shouldResetCounter) {
      lastValueRef.current = rawValue;
      setDisplayedValue(rawValue);
    } else {
      const nextValue = Math.min(EVENT_CONFIG.counter.finalValue, Math.max(lastValueRef.current, rawValue));
      lastValueRef.current = nextValue;
      setDisplayedValue(nextValue);
    }

    lastPhaseRef.current = phase;
  }, [counterStartTime, globalTime, phase, rawValue, visible]);

  return (
    <DraggableItem layoutKey="counter" className="flex flex-col items-center z-10 pointer-events-none">
       <motion.div
         initial={{ opacity: 0, scale: 0.5 }}
         animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5 }}
         transition={{ duration: 1 }}
         className="flex flex-col items-center pointer-events-auto"
       >
         <h2 className="text-4xl text-gab-cyan-light mb-4 tracking-[0.5em] uppercase">Global Activation</h2>
         <div className="text-[200px] font-bold text-white drop-shadow-[0_0_60px_rgba(91,192,190,1)] leading-none font-mono">
           {displayedValue}{EVENT_CONFIG.counter.suffix}
         </div>
       </motion.div>
    </DraggableItem>
  );
}
