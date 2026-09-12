import { EVENT_CONFIG } from '../config/eventConfig';
import { useEventStore, EventPhase } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion } from 'framer-motion';

const vietnamizeFinalLine = (value: string, fallback: string) => {
  const normalized = value.trim().toUpperCase();
  const map: Record<string, string> = {
    'CHUC MUNG': 'CHÚC MỪNG',
    'CHUC MUNG CAC KY LUC GIA': 'CHÚC MỪNG',
    'CONG DONG KY LUC GIA VIET NAM': 'CỘNG ĐỒNG KỶ LỤC GIA VIỆT NAM',
    'DA KICH HOAT THE GAB THANH CONG': 'ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG',
  };
  return map[normalized] || value.trim() || fallback;
};

export default function FinalScreen() {
  const { phase, layout, finalTemplate, showCenterLogoFinal, customLogoCenter } = useEventStore();
  const visible = phase === EventPhase.SUCCESS;

  const finalMessage = layout?.finalMessage || EVENT_CONFIG.finalMessage;
  const line1 = finalMessage.line1?.trim() || 'CHÚC MỪNG';
  const line2Parts = (finalMessage.line2?.trim() || 'CỘNG ĐỒNG KỶ LỤC GIA VIỆT NAM|ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG').split('|');
  const line2 = line2Parts[0]?.trim() || 'CỘNG ĐỒNG KỶ LỤC GIA VIỆT NAM';
  const line3 = line2Parts[1]?.trim();
  const ceremonyLine1 = vietnamizeFinalLine(line1, 'CHÚC MỪNG');
  const ceremonyLine2 = vietnamizeFinalLine(line2, 'CỘNG ĐỒNG KỶ LỤC GIA VIỆT NAM');
  const ceremonyLine3 = vietnamizeFinalLine(line3 || 'ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG', 'ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG');

  if (finalTemplate === 'center-hero') {
    return (
      <>
        <motion.div
          className="ceremony-final-bg absolute inset-0 z-[55] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <div className="absolute inset-0 z-[80] flex items-center justify-center text-center select-none pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 24, scale: visible ? 1 : 0.97 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="ceremony-final-content flex flex-col items-center justify-center"
          >
            {(showCenterLogoFinal || finalTemplate === 'center-hero') && (
              <motion.img
                src={customLogoCenter || "/logo/GAB.png"}
                alt="GAB Logo"
                className="w-[clamp(116px,8.5vw,190px)] h-auto object-contain mb-[clamp(10px,1.3vw,22px)] drop-shadow-[0_0_35px_rgba(253,224,71,0.82)]"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.82 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                onError={(e: any) => e.currentTarget.style.display = 'none'}
              />
            )}
            <div className="ceremony-final-counter">{EVENT_CONFIG.counter.finalValue}{EVENT_CONFIG.counter.suffix}</div>
            <h1 className="ceremony-final-title">{ceremonyLine1}</h1>
            <h2 className="ceremony-final-line">{ceremonyLine2}</h2>
            <h2 className="ceremony-final-line">{ceremonyLine3}</h2>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <DraggableItem layoutKey="finalMessage" className="flex flex-col items-center justify-center text-center w-full max-w-[72vw] select-none z-[80]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.95 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center px-10 py-7 rounded-lg bg-black/35 border border-white/10 backdrop-blur-sm shadow-[0_0_80px_rgba(0,240,255,0.24)]"
      >
        {/* Optional Center Logo for Hero template or when enabled */}
        {showCenterLogoFinal && (
          <motion.img 
            src={customLogoCenter || "/logo/GAB.png"} 
            alt="Hero Logo"
            className="w-[clamp(96px,8vw,168px)] h-auto object-contain mb-5 drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]"
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

            <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 mb-4 tracking-wider font-mono">
              {line1}
            </h1>
            <h2 className="text-xl md:text-4xl text-cyan-300 font-mono tracking-wide drop-shadow-[0_0_20px_rgba(0,240,255,0.9)]">
              {line2}
            </h2>
          </div>
        )}

        {/* 2. GOLDEN PRESTIGE TEMPLATE */}
        {finalTemplate === 'golden-prestige' && (
          <div className="relative p-6 md:p-10 border-2 border-yellow-500/40 bg-black/60 backdrop-blur-md rounded-3xl shadow-[0_0_60px_rgba(250,204,21,0.5)]">
            <div className="text-yellow-400 text-2xl md:text-3xl mb-2 tracking-[0.3em] uppercase font-serif">✦ VIETNAM RECORD HOLDERS ✦</div>
            <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 mb-5 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)]">
              {line1}
            </h1>
            <h2 className="text-2xl md:text-4xl text-yellow-200 font-semibold tracking-wider drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]">
              {line2}
            </h2>
          </div>
        )}

        {/* 3. STANDARD DUAL CARDS & MINIMAL CLEAN TEMPLATES */}
        {finalTemplate !== 'cyber-hologram' && finalTemplate !== 'golden-prestige' && (
          <>
            <h1 className="text-[clamp(30px,3.3vw,70px)] font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] tracking-normal leading-tight whitespace-nowrap">
              {line1}
            </h1>
            <h2 className="text-[clamp(22px,2.2vw,46px)] text-gab-cyan-light drop-shadow-[0_0_20px_rgba(91,192,190,0.5)] tracking-normal leading-tight whitespace-nowrap">
              {line2}
            </h2>
          </>
        )}
      </motion.div>
    </DraggableItem>
  );
}
