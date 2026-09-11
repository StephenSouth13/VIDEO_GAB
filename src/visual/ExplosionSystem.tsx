import { useEventStore, EventPhase } from '../stores/useEventStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExplosionSystem() {
  const { phase, explosionType, isPaused, explosionColor } = useEventStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (phase === EventPhase.EXPLOSION) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2400);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [phase]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div 
        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {/* ============================================================ */}
        {/* 1. COSMIC EXPANSION (NỔ VŨ TRỤ MỞ RA - BIG BANG COSMOS)       */}
        {/* ============================================================ */}
        {explosionType === 'cosmic-expansion' && (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Blinding Center Flash */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: [0.1, 8, 15], opacity: [1, 0.9, 0] }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute w-40 h-40 rounded-full bg-white blur-xl mix-blend-screen"
            />
            {/* Primary Cosmic Shockwave Ring */}
            <motion.div
              initial={{ scale: 0, opacity: 1, borderWidth: '40px' }}
              animate={{ scale: [0, 4, 9], opacity: [1, 0.8, 0], borderWidth: ['40px', '12px', '0px'] }}
              transition={{ duration: 2.0, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] rounded-full border-cyan-300 shadow-[0_0_120px_rgba(0,240,255,1)] mix-blend-screen"
              style={{ borderColor: explosionColor }}
            />
            {/* Secondary Golden Stardust Wave */}
            <motion.div
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: [0, 3, 7], opacity: [0.9, 0.6, 0] }}
              transition={{ duration: 2.2, delay: 0.1, ease: "easeOut" }}
              className="absolute w-[700px] h-[700px] rounded-full border-4 border-yellow-300 shadow-[0_0_80px_rgba(250,204,21,0.9)] mix-blend-screen"
            />
            {/* Spinning Cosmic Nebula Disc */}
            <motion.div
              initial={{ scale: 0, rotate: 0, opacity: 1 }}
              animate={{ scale: [0, 3.5, 6], rotate: 360, opacity: [1, 0.7, 0] }}
              transition={{ duration: 2.4, ease: "easeOut" }}
              className="absolute w-[800px] h-[800px] rounded-full opacity-80 mix-blend-color-dodge"
              style={{
                background: `radial-gradient(circle, ${explosionColor} 0%, rgba(147,51,234,0.6) 40%, rgba(59,130,246,0.3) 70%, transparent 85%)`
              }}
            />
            {/* 360° Cosmic Rays Burst */}
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: [0, 3, 5], opacity: [1, 0.8, 0] }}
                transition={{ duration: 1.8, delay: i * 0.02, ease: "easeOut" }}
                className="absolute w-2 h-[800px] origin-center mix-blend-screen blur-[1px]"
                style={{
                  transform: `rotate(${i * 22.5}deg)`,
                  background: `linear-gradient(to top, transparent, #FFFFFF 50%, ${explosionColor} 80%, transparent)`
                }}
              />
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. VORTEX SPIN (BÃO NĂNG LƯỢNG XOAY TRÒN NGÂN HÀ)           */}
        {/* ============================================================ */}
        {explosionType === 'vortex-spin' && (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Inner Hyper-Spinning Core */}
            <motion.div
              initial={{ scale: 0.2, rotate: 0, opacity: 1 }}
              animate={{ scale: [0.2, 4, 8], rotate: 1080, opacity: [1, 0.9, 0] }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute w-[500px] h-[500px] rounded-full mix-blend-screen"
              style={{
                background: `conic-gradient(from 0deg, ${explosionColor}, #EC4899, #8B5CF6, #3B82F6, ${explosionColor})`
              }}
            />
            {/* Multi-Layer Twisting Rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                initial={{ scale: 0, rotate: 0, opacity: 1 }}
                animate={{ scale: [0, ring * 2.5, ring * 5], rotate: ring % 2 === 0 ? 720 : -720, opacity: [1, 0.7, 0] }}
                transition={{ duration: 2.0 + ring * 0.2, ease: "easeOut" }}
                className="absolute w-[450px] h-[450px] rounded-full border-dashed border-8 mix-blend-screen"
                style={{
                  borderColor: explosionColor,
                  filter: `drop-shadow(0 0 40px ${explosionColor})`
                }}
              />
            ))}
            {/* Radiating Spiral Comets */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 2, 0.5],
                  x: Math.cos((i * 30 * Math.PI) / 180) * 800,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 800,
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="absolute w-6 h-6 rounded-full bg-white shadow-[0_0_30px_#FFFFFF] mix-blend-screen"
              />
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. SUPERNOVA (SIÊU TÂN TINH KHỔNG LỒ)                        */}
        {/* ============================================================ */}
        {explosionType === 'supernova' && (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Blinding Screen Whiteout Flash */}
            <motion.div
              initial={{ opacity: 0.95 }}
              animate={{ opacity: [0.95, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 bg-white mix-blend-color-dodge z-10"
            />
            {/* Massive Plasma Corona */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: [0.1, 5, 10], opacity: [1, 0.8, 0] }}
              transition={{ duration: 2.0, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] rounded-full blur-2xl mix-blend-screen"
              style={{
                background: `radial-gradient(circle, #FFFFFF 0%, ${explosionColor} 40%, rgba(255,255,255,0) 75%)`
              }}
            />
            {/* High-Velocity Shockwaves */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 6, 12], opacity: [1, 0.7, 0] }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute w-[500px] h-[500px] rounded-full border-[20px] border-white shadow-[0_0_150px_#FFFFFF] mix-blend-screen"
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. BLACK HOLE & GAMMA BURST (LỖ ĐEN & TIA GAMMA)             */}
        {/* ============================================================ */}
        {explosionType === 'black-hole' && (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Dark Core Event Horizon */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: [0.1, 2, 4], opacity: [1, 1, 0] }}
              transition={{ duration: 2.0, ease: "easeOut" }}
              className="absolute w-[350px] h-[350px] rounded-full bg-black shadow-[0_0_80px_rgba(139,92,246,0.9)] border-4 border-purple-500"
            />
            {/* Gravitational Accretion Disk */}
            <motion.div
              initial={{ scale: 0.2, rotate: 0 }}
              animate={{ scale: [0.2, 3, 6], rotate: 720 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] rounded-full mix-blend-screen opacity-90"
              style={{
                background: `radial-gradient(circle, transparent 30%, ${explosionColor} 50%, rgba(236,72,153,0.8) 70%, transparent 85%)`
              }}
            />
            {/* Relativistic Vertical Gamma-Ray Jets */}
            <motion.div
              initial={{ scaleY: 0, opacity: 1 }}
              animate={{ scaleY: [0, 4, 8], opacity: [1, 0.9, 0] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute w-12 h-[800px] bg-white shadow-[0_0_100px_#FFFFFF] blur-md mix-blend-screen"
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. CYBER RING (VÒNG CÔNG NGHỆ CYBER MATRIX)                  */}
        {/* ============================================================ */}
        {explosionType === 'cyber-ring' && (
          <div className="relative flex items-center justify-center w-full h-full font-mono">
            {/* Expanding Tech Rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                initial={{ scale: 0, opacity: 1, rotate: ring * 45 }}
                animate={{ scale: [0, ring * 2.5, ring * 5], opacity: [1, 0.8, 0], rotate: ring * 45 + 180 }}
                transition={{ duration: 1.8 + ring * 0.2, ease: "easeOut" }}
                className="absolute w-[400px] h-[400px] rounded-full border-4 border-dashed mix-blend-screen"
                style={{
                  borderColor: explosionColor,
                  boxShadow: `0 0 60px ${explosionColor}`
                }}
              />
            ))}
            {/* Hexagonal Tech Frame */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 3, 6], rotate: 120, opacity: [1, 0.8, 0] }}
              transition={{ duration: 2.0, ease: "easeOut" }}
              className="absolute w-[500px] h-[500px] border-8 border-cyan-400 mix-blend-screen [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
              style={{ borderColor: explosionColor }}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. GOLDEN BURST (HOÀNG KIM RỰC RỠ)                           */}
        {/* ============================================================ */}
        {explosionType === 'golden-burst' && (
          <div className="relative flex items-center justify-center w-full h-full">
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: [0.1, 4, 8], opacity: [1, 0.85, 0] }}
              transition={{ duration: 2.0, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] rounded-full mix-blend-screen"
              style={{
                background: `radial-gradient(circle, #FFFFFF 0%, #FACC15 40%, rgba(234,179,8,0.6) 70%, transparent 85%)`
              }}
            />
            {/* Golden Star Spikes */}
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: [0, 3, 6], opacity: [1, 0.8, 0] }}
                transition={{ duration: 1.8, delay: i * 0.015, ease: "easeOut" }}
                className="absolute w-1.5 h-[700px] bg-yellow-200 blur-[0.5px] mix-blend-screen shadow-[0_0_20px_#FACC15]"
                style={{ transform: `rotate(${i * 15}deg)` }}
              />
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. CONFETTI (PHÁO HOA KIM TUYẾN ĂN MỪNG)                     */}
        {/* ============================================================ */}
        {explosionType === 'confetti' && (
          <div className="relative flex items-center justify-center w-full h-full">
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 6 * Math.PI) / 180;
              const dist = 300 + (i % 5) * 120;
              const colors = ['#00F0FF', '#FACC15', '#EC4899', '#10B981', '#FFFFFF', '#A855F7'];
              const col = colors[i % colors.length];
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.5, 0.8],
                    x: Math.cos(angle) * dist + (Math.random() - 0.5) * 100,
                    y: Math.sin(angle) * dist + (Math.random() - 0.5) * 100 + 100,
                    rotate: Math.random() * 720,
                    opacity: [1, 1, 0]
                  }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                  className="absolute w-4 h-4 rounded-sm shadow-md"
                  style={{ backgroundColor: col }}
                />
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* 8. SHOCKWAVE (SÓNG XUNG KÍCH SIÊU THANH)                    */}
        {/* ============================================================ */}
        {explosionType === 'shockwave' && (
          <div className="relative flex items-center justify-center w-full h-full">
            {[1, 2, 3].map((wave) => (
              <motion.div
                key={wave}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, wave * 3, wave * 7], opacity: [1, 0.6, 0] }}
                transition={{ duration: 1.8 + wave * 0.15, ease: "easeOut" }}
                className="absolute w-[500px] h-[500px] rounded-full border-[15px] mix-blend-screen"
                style={{
                  borderColor: explosionColor,
                  boxShadow: `0 0 80px ${explosionColor}`
                }}
              />
            ))}
          </div>
        )}

        {explosionType === 'radial-strobe' && (
          <div className="relative flex items-center justify-center w-full h-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0.2, 0.85, 0] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute inset-0 bg-white mix-blend-screen"
            />
            {Array.from({ length: 32 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: [0, 4.5, 0.3], opacity: [1, 0.85, 0] }}
                transition={{ duration: 1.7, delay: i * 0.012, ease: "easeOut" }}
                className="absolute w-1.5 h-[900px] origin-center mix-blend-screen"
                style={{
                  transform: `rotate(${i * 11.25}deg)`,
                  background: `linear-gradient(to top, transparent, ${explosionColor}, #FFFFFF, transparent)`,
                  boxShadow: `0 0 28px ${explosionColor}`
                }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 5.5, 9], opacity: [1, 0.5, 0] }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute w-[520px] h-[520px] rounded-full border-[18px] mix-blend-screen"
              style={{ borderColor: explosionColor }}
            />
          </div>
        )}

        {explosionType === 'glass-shatter' && (
          <div className="relative flex items-center justify-center w-full h-full">
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: [0.2, 2.8, 4], opacity: [1, 0.75, 0] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute w-[460px] h-[460px] rounded-full blur-xl mix-blend-screen"
              style={{ background: `radial-gradient(circle, #FFFFFF, ${explosionColor}, transparent 70%)` }}
            />
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const distance = 340 + (i % 6) * 90;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 0.95, scale: 0.4 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    rotate: i % 2 ? 220 : -260,
                    opacity: [0.95, 0.8, 0],
                    scale: [0.4, 1.4, 0.9]
                  }}
                  transition={{ duration: 2.1, delay: (i % 8) * 0.025, ease: "easeOut" }}
                  className="absolute w-20 h-12 border border-white/70 bg-white/15 mix-blend-screen backdrop-blur-sm"
                  style={{
                    clipPath: 'polygon(12% 0%, 100% 18%, 72% 100%, 0% 65%)',
                    boxShadow: `0 0 22px ${explosionColor}`
                  }}
                />
              );
            })}
          </div>
        )}

        {explosionType === 'data-burst' && (
          <div className="relative flex items-center justify-center w-full h-full font-mono">
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.6, 1.2, 0.8],
                  x: Math.cos((i * 16.36 * Math.PI) / 180) * (360 + (i % 5) * 85),
                  y: Math.sin((i * 16.36 * Math.PI) / 180) * (220 + (i % 4) * 70)
                }}
                transition={{ duration: 1.9, delay: (i % 6) * 0.035, ease: "easeOut" }}
                className="absolute text-2xl md:text-5xl font-black mix-blend-screen"
                style={{ color: i % 3 ? explosionColor : '#FFFFFF', textShadow: `0 0 24px ${explosionColor}` }}
              >
                {i % 4 === 0 ? 'GAB' : i % 4 === 1 ? '400+' : i % 4 === 2 ? 'KLG' : 'SYNC'}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0, rotate: 0, opacity: 1 }}
              animate={{ scale: [0, 3.2, 6.5], rotate: 180, opacity: [1, 0.7, 0] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-[520px] h-[520px] border-4 border-dashed rounded-full mix-blend-screen"
              style={{ borderColor: explosionColor, boxShadow: `0 0 70px ${explosionColor}` }}
            />
          </div>
        )}

        {explosionType === 'aurora-flare' && (
          <div className="relative flex items-center justify-center w-full h-full">
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
              animate={{ scale: [0.4, 3.2, 6.8], opacity: [0, 0.9, 0], rotate: 80 }}
              transition={{ duration: 2.35, ease: "easeOut" }}
              className="absolute w-[700px] h-[700px] rounded-full mix-blend-screen blur-xl"
              style={{
                background: `conic-gradient(from 90deg, transparent, ${explosionColor}, #FACC15, #EC4899, transparent)`
              }}
            />
            {[0, 1, 2].map((wave) => (
              <motion.div
                key={wave}
                initial={{ y: 180, opacity: 0, scaleX: 0.4 }}
                animate={{ y: [-120, -260 - wave * 120], opacity: [0, 0.85, 0], scaleX: [0.4, 1.6, 2.2] }}
                transition={{ duration: 1.8 + wave * 0.2, delay: wave * 0.18, ease: "easeOut" }}
                className="absolute w-[110vw] h-24 rounded-full blur-2xl mix-blend-screen"
                style={{ background: `linear-gradient(90deg, transparent, ${explosionColor}, #FFFFFF, transparent)` }}
              />
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
