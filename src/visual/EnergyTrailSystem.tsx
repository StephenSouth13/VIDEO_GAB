import { useEventStore, EventPhase } from '../stores/useEventStore';
import { motion } from 'framer-motion';

export default function EnergyTrailSystem() {
  const { phase, trailColor, energyType, isPaused, layout } = useEventStore();
  
  const isConvergenceActive = 
    phase === EventPhase.ENERGY_CONVERGENCE || 
    phase === EventPhase.FINAL_CHARGE;

  if (!isConvergenceActive) {
    return null;
  }

  const logoTarget = layout?.revealLogo || layout?.logo || { x: 0, y: 0 };
  const targetStyle = {
    left: `calc(50% + ${logoTarget.x || 0}px)`,
    top: `calc(50% + ${logoTarget.y || 0}px)`,
  };

  const beamCount = 64;
  const beams = Array.from({ length: beamCount }, (_, i) => {
    const angle = (i * (360 / beamCount));
    const rad = (angle * Math.PI) / 180;
    const distance = 760 + (i % 5) * 90;
    const startX = Math.cos(rad) * distance;
    const startY = Math.sin(rad) * distance;
    return { id: i, angle, distance, startX, startY, delay: (i % 16) * 0.045, duration: 0.95 + (i % 5) * 0.06 };
  });
  
  return (
    <div 
      className="absolute inset-0 z-15 pointer-events-none flex justify-center items-center overflow-hidden"
      style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
    >
      {/* ============================================================ */}
      {/* 1. EXPERT CONVERGENCE (TIA CHUYÊN GIA TỰU HỢP VỀ LOGO)         */}
      {/* ============================================================ */}
      {(energyType === 'expert-convergence' || energyType === 'default') && (
        <div className="absolute w-0 h-0" style={targetStyle}>
          {/* Soft guidance rays: kept faint so the motion reads as stars flying into the logo, not a blinding laser burst. */}
          {beams.map((b) => (
            <motion.div
              key={b.id}
              className="absolute h-[2px] rounded-full mix-blend-screen"
              style={{
                left: 0,
                top: 0,
                width: 'clamp(300px, 27vw, 760px)',
                x: '-100%',
                y: '-50%',
                rotate: b.angle,
                transformOrigin: '100% 50%',
                background: `linear-gradient(90deg, transparent 0%, ${trailColor} 66%, rgba(255,255,255,0.85) 100%)`,
                boxShadow: `0 0 8px ${trailColor}`,
              }}
              animate={{
                opacity: [0, 0.28, 0.18, 0],
                scaleX: [0.04, 0.72, 0.18],
                filter: ['blur(2px)', 'blur(0.5px)', 'blur(1px)']
              }}
              transition={{
                duration: b.duration,
                repeat: Infinity,
                delay: b.delay,
                ease: "easeInOut"
              }}
            />
          ))}

          {beams.map((b) => (
            <motion.div
              key={`spark-${b.id}`}
              className="absolute rounded-full bg-white mix-blend-screen"
              style={{
                left: 0,
                top: 0,
                width: `${3 + (b.id % 4) * 1.2}px`,
                height: `${3 + (b.id % 4) * 1.2}px`,
                boxShadow: `0 0 10px #FFFFFF, 0 0 18px ${trailColor}`,
              }}
              animate={{
                x: [b.startX, b.startX * 0.58, b.startX * 0.2, 0],
                y: [b.startY, b.startY * 0.58, b.startY * 0.2, 0],
                opacity: [0, 1, 0],
                scale: [0.35, 1.25, 0.7, 0.05]
              }}
              transition={{
                duration: b.duration,
                repeat: Infinity,
                delay: b.delay,
                ease: "easeIn"
              }}
            />
          ))}

          {/* Glowing Nexus Core (Where all expert rays hit the center logo) */}
          <motion.div
            animate={{
              scale: [0.8, 1.4, 0.9],
              opacity: [0.22, 0.42, 0.22]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -left-20 -top-20 w-40 h-40 rounded-full blur-xl mix-blend-screen"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.7) 0%, ${trailColor} 46%, transparent 78%)`,
              boxShadow: `0 0 34px ${trailColor}`
            }}
          />

          {/* Central Charging Pulse Rings */}
          {[1, 2].map((ring) => (
            <motion.div
              key={ring}
              animate={{
                scale: [0.2, 2.2],
                opacity: [1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: ring * 0.7,
                ease: "easeOut"
              }}
              className="absolute -left-32 -top-32 w-64 h-64 rounded-full border-2 mix-blend-screen"
              style={{ borderColor: trailColor }}
            />
          ))}
        </div>
      )}

      {energyType === 'meteor-shower' && (
        <div className="absolute w-0 h-0" style={targetStyle}>
          {Array.from({ length: 96 }).map((_, i) => {
            const angle = (i * 137.5) % 360;
            const rad = (angle * Math.PI) / 180;
            const distance = 860 + (i % 7) * 95;
            const startX = Math.cos(rad) * distance;
            const startY = Math.sin(rad) * distance;
            const size = 3 + (i % 5);
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white mix-blend-screen"
                style={{
                  left: 0,
                  top: 0,
                  width: `${size}px`,
                  height: `${size}px`,
                  boxShadow: `0 0 12px #fff, 0 0 24px ${trailColor}`,
                }}
                animate={{
                  x: [startX, startX * 0.5, startX * 0.16, 0],
                  y: [startY, startY * 0.5, startY * 0.16, 0],
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.25, 1.25, 0.7, 0.05],
                }}
                transition={{ duration: 0.9 + (i % 6) * 0.08, repeat: Infinity, delay: (i % 24) * 0.045, ease: 'easeIn' }}
              />
            );
          })}
        </div>
      )}

      {energyType === 'star-crossfire' && (
        <div className="absolute w-0 h-0" style={targetStyle}>
          {Array.from({ length: 72 }).map((_, i) => {
            const side = i % 4;
            const lane = ((i * 73) % 100) - 50;
            const startX = side === 0 ? -1100 : side === 1 ? 1100 : lane * 18;
            const startY = side === 2 ? -620 : side === 3 ? 620 : lane * 10;
            const angle = Math.atan2(-startY, -startX) * 180 / Math.PI;
            return (
              <motion.div
                key={i}
                className="absolute h-[3px] w-28 rounded-full mix-blend-screen"
                style={{
                  left: 0,
                  top: 0,
                  background: `linear-gradient(90deg, transparent, #fff, ${trailColor})`,
                  boxShadow: `0 0 10px ${trailColor}`,
                }}
                animate={{
                  x: [startX, startX * 0.42, 0],
                  y: [startY, startY * 0.42, 0],
                  opacity: [0, 0.95, 0],
                  scaleX: [0.25, 1.1, 0.08],
                  rotate: [angle, angle, angle],
                }}
                transition={{ duration: 0.78 + (i % 5) * 0.06, repeat: Infinity, delay: (i % 18) * 0.055, ease: 'easeIn' }}
              />
            );
          })}
        </div>
      )}

      {energyType === 'comet-orbit' && (
        <div className="absolute w-0 h-0" style={targetStyle}>
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={`ring-${ring}`}
              className="absolute rounded-full border mix-blend-screen"
              style={{
                left: `${-260 - ring * 90}px`,
                top: `${-120 - ring * 46}px`,
                width: `${520 + ring * 180}px`,
                height: `${240 + ring * 92}px`,
                borderColor: ring % 2 ? 'rgba(255,255,255,0.22)' : `${trailColor}66`,
                boxShadow: `0 0 24px ${trailColor}55`,
              }}
              animate={{ rotate: ring % 2 ? -360 : 360, opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 4.5 + ring, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {Array.from({ length: 54 }).map((_, i) => {
            const angle = (i * 360) / 54;
            const rad = (angle * Math.PI) / 180;
            const startX = Math.cos(rad) * (520 + (i % 4) * 90);
            const startY = Math.sin(rad) * (230 + (i % 4) * 44);
            return (
              <motion.div
                key={`comet-${i}`}
                className="absolute w-3 h-3 rounded-full bg-white mix-blend-screen"
                style={{ left: 0, top: 0, boxShadow: `0 0 16px #fff, 0 0 30px ${trailColor}` }}
                animate={{ x: [startX, startX * 0.65, 0], y: [startY, startY * 0.65, 0], opacity: [0, 1, 0], scale: [0.35, 1.2, 0.1] }}
                transition={{ duration: 1.2 + (i % 4) * 0.12, repeat: Infinity, delay: (i % 18) * 0.07, ease: 'easeInOut' }}
              />
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. LASER MATRIX (MA TRẬN LASER CÔNG NGHỆ CAO)                 */}
      {/* ============================================================ */}
      {energyType === 'laser-matrix' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 w-[150vw] mix-blend-screen origin-center"
              style={{
                backgroundColor: trailColor,
                boxShadow: `0 0 20px ${trailColor}`,
                transform: `rotate(${i * 22.5}deg)`
              }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scaleY: [1, 3, 1]
              }}
              transition={{
                duration: 0.8 + (i % 3) * 0.3,
                repeat: Infinity,
                delay: i * 0.05
              }}
            />
          ))}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-[450px] h-[450px] rounded-full border-2 border-dashed mix-blend-screen"
            style={{ borderColor: trailColor }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. COSMIC VORTEX (XOÁY TỤ NĂNG LƯỢNG NGÂN HÀ)                 */}
      {/* ============================================================ */}
      {energyType === 'cosmic-vortex' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="w-[600px] h-[600px] rounded-full mix-blend-screen opacity-80"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${trailColor}, #FFFFFF, transparent)`
            }}
          />
          <motion.div
            animate={{ rotate: 720, scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[400px] h-[400px] rounded-full border-4 border-dotted mix-blend-screen"
            style={{ borderColor: trailColor }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. GOLDEN STREAMS (DÒNG CHẢY HOÀNG KIM)                       */}
      {/* ============================================================ */}
      {energyType === 'golden-streams' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {beams.map((b) => (
            <motion.div
              key={b.id}
              className="absolute w-3 h-3 rounded-full bg-yellow-200 mix-blend-screen"
              style={{
                boxShadow: `0 0 25px #FACC15, 0 0 50px #FFFFFF`
              }}
              animate={{
                x: [b.startX, 0],
                y: [b.startY, 0],
                scale: [0.2, 1.8, 0.4],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.0,
                repeat: Infinity,
                delay: b.delay,
                ease: "easeIn"
              }}
            />
          ))}
          <div 
            className="w-56 h-56 rounded-full blur-2xl animate-pulse"
            style={{ backgroundColor: '#FACC15' }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SPIRAL CHARGE (XOẮN ỐC NĂNG LƯỢNG KÉP)                     */}
      {/* ============================================================ */}
      {energyType === 'spiral-charge' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360, scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-[500px] h-[500px] rounded-full border-8 border-t-transparent border-b-transparent mix-blend-screen"
            style={{ borderColor: trailColor }}
          />
          <motion.div
            animate={{ rotate: -360, scale: [1.3, 0.8, 1.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute w-[350px] h-[350px] rounded-full border-8 border-l-transparent border-r-transparent mix-blend-screen"
            style={{ borderColor: '#FFFFFF' }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. SPIRIT BOMB (QUẢ CẦU NĂNG LƯỢNG KHỔNG LỒ)                 */}
      {/* ============================================================ */}
      {energyType === 'spirit-bomb' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[400px] h-[400px] rounded-full blur-2xl mix-blend-screen"
            style={{
              background: `radial-gradient(circle, #FFFFFF 0%, ${trailColor} 50%, transparent 80%)`,
              boxShadow: `0 0 100px ${trailColor}`
            }}
          />
        </div>
      )}

      {energyType === 'ribbon-weave' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-[120vw] rounded-full mix-blend-screen"
              style={{
                background: `linear-gradient(90deg, transparent, ${i % 2 ? '#FFFFFF' : trailColor}, transparent)`,
                boxShadow: `0 0 24px ${trailColor}`,
                transform: `rotate(${i * 18 - 80}deg)`
              }}
              animate={{
                x: ['-28vw', '28vw', '-28vw'],
                opacity: [0.1, 0.85, 0.1],
                scaleY: [0.5, 2.4, 0.5]
              }}
              transition={{ duration: 2.6 + i * 0.08, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
            />
          ))}
          <motion.div
            className="absolute w-72 h-72 rounded-full border-4 mix-blend-screen"
            style={{ borderColor: trailColor, boxShadow: `0 0 70px ${trailColor}` }}
            animate={{ scale: [0.8, 1.4, 0.8], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {energyType === 'orbital-rings' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {[0, 1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border-2 border-dashed mix-blend-screen"
              style={{
                width: `${360 + ring * 120}px`,
                height: `${160 + ring * 70}px`,
                borderColor: ring % 2 ? '#FFFFFF' : trailColor,
                boxShadow: `0 0 36px ${trailColor}`
              }}
              animate={{ rotate: ring % 2 ? -360 : 360, opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 5 + ring, repeat: Infinity, ease: "linear" }}
            />
          ))}
          {beams.slice(0, 16).map((b) => (
            <motion.div
              key={b.id}
              className="absolute w-4 h-4 rounded-full bg-white mix-blend-screen"
              style={{ boxShadow: `0 0 28px ${trailColor}` }}
              animate={{
                x: [Math.cos((b.angle * Math.PI) / 180) * 420, 0, Math.cos(((b.angle + 180) * Math.PI) / 180) * 120],
                y: [Math.sin((b.angle * Math.PI) / 180) * 230, 0, Math.sin(((b.angle + 180) * Math.PI) / 180) * 80],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 1.8, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {energyType === 'rain-up' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {Array.from({ length: 44 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-28 rounded-full mix-blend-screen"
              style={{
                left: `${(i * 7) % 100}%`,
                bottom: '-12%',
                background: `linear-gradient(to top, transparent, ${trailColor}, #FFFFFF)`,
                boxShadow: `0 0 20px ${trailColor}`
              }}
              animate={{ y: ['0vh', '-112vh'], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.4 + (i % 5) * 0.18, repeat: Infinity, delay: (i % 9) * 0.08, ease: "easeOut" }}
            />
          ))}
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-2xl mix-blend-screen"
            style={{ background: `radial-gradient(circle, #FFFFFF, ${trailColor}, transparent 75%)` }}
            animate={{ scale: [0.6, 1.35, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {energyType === 'heartbeat-pulse' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={ring}
              className="absolute w-80 h-80 rounded-full border-4 mix-blend-screen"
              style={{ borderColor: trailColor, boxShadow: `0 0 45px ${trailColor}` }}
              animate={{ scale: [0.2, 1.4 + ring * 0.5], opacity: [1, 0] }}
              transition={{ duration: 1.45, repeat: Infinity, delay: ring * 0.18, ease: "easeOut" }}
            />
          ))}
          {beams.slice(0, 20).map((b) => (
            <motion.div
              key={b.id}
              className="absolute h-1 w-52 rounded-full origin-right mix-blend-screen"
              style={{
                background: `linear-gradient(90deg, transparent, ${trailColor}, #FFFFFF)`,
                transform: `rotate(${b.angle + 180}deg) translate(520px, 0)`
              }}
              animate={{ scaleX: [0.2, 1.5, 0.2], opacity: [0.15, 1, 0.15] }}
              transition={{ duration: 0.72, repeat: Infinity, delay: b.delay * 0.5, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
