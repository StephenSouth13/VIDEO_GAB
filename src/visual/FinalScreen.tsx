import { EVENT_CONFIG } from '../config/eventConfig';
import { useEventStore, EventPhase } from '../stores/useEventStore';
import DraggableItem from './DraggableItem';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

const CEREMONY_TITLE = 'CH\u00daC M\u1eeaNG';
const CEREMONY_COMMUNITY = 'C\u1ed8NG \u0110\u1ed2NG K\u1ef6 L\u1ee4C GIA VI\u1ec6T NAM';
const CEREMONY_ACTIVATED = '\u0110\u00c3 K\u00cdCH HO\u1ea0T TH\u1eba GAB TH\u00c0NH C\u00d4NG';

const cleanFinalText = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/ĐỒ\s+NG/gi, 'ĐỒNG')
    .replace(/HOẠT\s+THẺ/gi, 'HOẠT THẺ')
    .trim();

const vietnamizeFinalLine = (value: string, fallback: string) => {
  const cleaned = cleanFinalText(value);
  const normalized = cleaned
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ');
  const map: Record<string, string> = {
    'CHUC MUNG': CEREMONY_TITLE,
    'CHUC MUNG CAC KY LUC GIA': CEREMONY_TITLE,
    'CONG DONG KY LUC GIA VIET NAM': CEREMONY_COMMUNITY,
    'CONG DO NG KY LUC GIA VIET NAM': CEREMONY_COMMUNITY,
    'DA KICH HOAT THE GAB THANH CONG': CEREMONY_ACTIVATED,
  };
  return map[normalized] || cleaned || fallback;
};

export default function FinalScreen() {
  const { phase, layout, finalTemplate, showCenterLogoFinal, customLogoCenter } = useEventStore();
  const visible = phase === EventPhase.SUCCESS;

  const finalMessage = layout?.finalMessage || EVENT_CONFIG.finalMessage;
  const centerFinalLogoLayout = layout?.centerFinalLogo || { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  const inlineLogoStyle = {
    transform: `translate(${centerFinalLogoLayout.x || 0}px, ${centerFinalLogoLayout.y || 0}px) scale(${centerFinalLogoLayout.scale || 1}) rotate(${centerFinalLogoLayout.rotate || 0}deg)`,
    opacity: centerFinalLogoLayout.opacity ?? 1,
  };
  const finalMessageStyle = {
    '--final-title-size': `${finalMessage.titleSize ?? 82}px`,
    '--final-line-size': `${finalMessage.lineSize ?? 54}px`,
    '--final-counter-size': `${finalMessage.counterSize ?? 72}px`,
    '--final-letter-spacing': `${finalMessage.letterSpacing ?? 0}px`,
    '--final-line-gap': `${finalMessage.lineGap ?? 10}px`,
  } as CSSProperties;
  const line1 = cleanFinalText(finalMessage.line1 || '') || CEREMONY_TITLE;
  const line2Parts = (finalMessage.line2?.trim() || `${CEREMONY_COMMUNITY}|${CEREMONY_ACTIVATED}`).split('|');
  const line2 = cleanFinalText(line2Parts[0] || '') || CEREMONY_COMMUNITY;
  const line3 = line2Parts[1] ? cleanFinalText(line2Parts[1]) : '';

  const ceremonyLine1 = vietnamizeFinalLine(line1, CEREMONY_TITLE);
  let ceremonyLine2 = vietnamizeFinalLine(line2, CEREMONY_COMMUNITY);
  let ceremonyLine3 = line3 ? vietnamizeFinalLine(line3, CEREMONY_ACTIVATED) : CEREMONY_ACTIVATED;

  if (ceremonyLine2 === CEREMONY_ACTIVATED) {
    ceremonyLine2 = CEREMONY_COMMUNITY;
    ceremonyLine3 = CEREMONY_ACTIVATED;
  }

  if (finalTemplate === 'center-hero') {
    return (
      <>
        <motion.div
          className="ceremony-final-bg absolute inset-0 z-[55] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
        {showCenterLogoFinal && (
          <DraggableItem layoutKey="centerFinalLogo" className="z-[86] flex items-center justify-center">
            <div className="final-logo-orbit absolute inset-0" />
            <motion.img
              src={customLogoCenter || '/logo/GAB.png'}
              alt="GAB Logo"
              className="final-logo-image w-[clamp(116px,8.5vw,190px)] h-auto object-contain drop-shadow-[0_0_35px_rgba(253,224,71,0.82)]"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.82 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              onError={(e: any) => e.currentTarget.style.display = 'none'}
            />
          </DraggableItem>
        )}
        <DraggableItem layoutKey="finalMessage" className="z-[84] flex items-center justify-center text-center select-none">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 24, scale: visible ? 1 : 0.97 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="ceremony-final-content flex flex-col items-center justify-center"
            style={finalMessageStyle}
          >
            <div className="ceremony-final-counter">{EVENT_CONFIG.counter.finalValue}{EVENT_CONFIG.counter.suffix}</div>
            <h1 className="ceremony-final-title">{ceremonyLine1}</h1>
            <h2 className="ceremony-final-line">{ceremonyLine2}</h2>
            <h2 className="ceremony-final-line">{ceremonyLine3}</h2>
          </motion.div>
        </DraggableItem>
      </>
    );
  }

  return (
    <DraggableItem layoutKey="finalMessage" className="flex flex-col items-center justify-center text-center w-full max-w-[72vw] select-none z-[80]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.95 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center px-10 py-7 rounded-lg bg-black/35 border border-white/10 backdrop-blur-sm shadow-[0_0_80px_rgba(0,240,255,0.24)]"
      >
        {showCenterLogoFinal && (
          <div className="relative z-[2] mb-5 flex items-center justify-center" style={inlineLogoStyle}>
            <div className="final-logo-orbit absolute inset-0" />
            <motion.img
              src={customLogoCenter || '/logo/GAB.png'}
              alt="Hero Logo"
              className="final-logo-image w-[clamp(96px,8vw,168px)] h-auto object-contain drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]"
              initial={{ scale: 0 }}
              animate={{ scale: visible ? 1 : 0 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              onError={(e: any) => e.currentTarget.style.display = 'none'}
            />
          </div>
        )}

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

        {finalTemplate === 'golden-prestige' && (
          <div className="relative p-6 md:p-10 border-2 border-yellow-500/40 bg-black/60 backdrop-blur-md rounded-3xl shadow-[0_0_60px_rgba(250,204,21,0.5)]">
            <div className="text-yellow-400 text-2xl md:text-3xl mb-2 tracking-[0.3em] uppercase font-serif">VIETNAM RECORD HOLDERS</div>
            <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 mb-5 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)]">
              {line1}
            </h1>
            <h2 className="text-2xl md:text-4xl text-yellow-200 font-semibold tracking-wider drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]">
              {line2}
            </h2>
          </div>
        )}

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
