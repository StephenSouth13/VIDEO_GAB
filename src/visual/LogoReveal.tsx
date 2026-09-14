import { useEventStore } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion } from 'framer-motion';

export default function LogoReveal() {
  const { phase, customLogoCenter } = useEventStore();
  
  // Only visible if phase has started GAB_REVEAL or later
  const visible = phase !== 'BOOT' && phase !== 'IDLE' && phase !== 'WAITING_FOR_PARTICIPANTS' && phase !== 'PARTICIPANT_CONFIRMING' && phase !== 'ALL_PARTICIPANTS_READY' && phase !== 'COUNTDOWN' && phase !== 'RESETTING';

  return (
    <DraggableItem layoutKey="revealLogo" className="flex flex-col items-center justify-center z-20">
       <motion.div
         className="logo-energy-aura absolute inset-0"
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
       />
       <motion.img 
         src={customLogoCenter || "/logo/GAB.png"} 
         alt="GAB Logo" 
         initial={{ opacity: 0, scale: 0.86 }}
         animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.86 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         onError={(e: any) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl font-bold text-gab-cyan-light font-mono shadow-[0_0_50px_rgba(91,192,190,0.8)] px-12 py-8 border-4 border-gab-cyan rounded-xl backdrop-blur-sm bg-gab-navy bg-opacity-50">GAB</div>';
         }}
         className="logo-reveal-image w-[34vw] max-w-[520px] min-w-[280px] max-h-[46vh] object-contain drop-shadow-[0_0_38px_rgba(91,192,190,0.75)]"
       />
    </DraggableItem>
  );
}
