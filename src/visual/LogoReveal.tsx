import { useEventStore } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion } from 'framer-motion';

export default function LogoReveal() {
  const { phase, customLogoCenter } = useEventStore();
  
  // Only visible if phase has started GAB_REVEAL or later
  const visible = phase !== 'BOOT' && phase !== 'IDLE' && phase !== 'WAITING_FOR_PARTICIPANTS' && phase !== 'PARTICIPANT_CONFIRMING' && phase !== 'ALL_PARTICIPANTS_READY' && phase !== 'COUNTDOWN' && phase !== 'RESETTING';

  return (
    <DraggableItem layoutKey="logo" className="flex flex-col items-center">
       <motion.img 
         src={customLogoCenter || "/logo/GAB.png"} 
         alt="GAB Logo" 
         initial={{ opacity: 0 }}
         animate={{ opacity: visible ? 1 : 0 }}
         transition={{ duration: 1 }}
         onError={(e: any) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl font-bold text-gab-cyan-light font-mono shadow-[0_0_50px_rgba(91,192,190,0.8)] px-12 py-8 border-4 border-gab-cyan rounded-xl backdrop-blur-sm bg-gab-navy bg-opacity-50">GAB</div>';
         }}
         className="w-[60vw] max-w-[800px] object-contain drop-shadow-[0_0_50px_rgba(91,192,190,0.8)]"
       />
    </DraggableItem>
  );
}
