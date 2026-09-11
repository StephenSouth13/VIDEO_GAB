import { EVENT_CONFIG } from '../config/eventConfig';
import { useEventStore, EventPhase } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion } from 'framer-motion';

export default function FinalScreen() {
  const { phase, layout } = useEventStore();
  const visible = phase === EventPhase.SUCCESS;

  const finalMessage = layout?.finalMessage || EVENT_CONFIG.finalMessage;

  return (
    <DraggableItem layoutKey="finalMessage" className="flex flex-col items-center justify-center text-center w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">
          {finalMessage.line1 || EVENT_CONFIG.finalMessage.line1}
        </h1>
        <h2 className="text-4xl md:text-6xl text-gab-cyan-light drop-shadow-[0_0_20px_rgba(91,192,190,0.5)]">
          {finalMessage.line2 || EVENT_CONFIG.finalMessage.line2}
        </h2>
      </motion.div>
    </DraggableItem>
  );
}
