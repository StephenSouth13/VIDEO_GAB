import { useEventStore, EventPhase } from '../stores/useEventStore';
import { motion } from 'framer-motion';

export default function EnergyTrailSystem() {
  const { phase, trailColor, energyType, isPaused } = useEventStore();
  
  const isConvergenceActive = 
    phase === EventPhase.ENERGY_CONVERGENCE || 
    phase === EventPhase.GAB_REVEAL ||
    phase === EventPhase.COUNTER_SEQUENCE || 
    phase === EventPhase.FINAL_CHARGE;

  if (!isConvergenceActive) {
    return null;
  }

  // Generate 24 multi-directional converging beam angles (360 degrees around the screen)
  const beamCount = 28;
  const beams = Array.from({ length: beamCount }, (_, i) => {
    const angle = (i * (360 / beamCount));
    const rad = (angle * Math.PI) / 180;
    // Start far outside the screen bounds (800 - 1200px out)
    const distance = 950 + (i % 4) * 80;
    const startX = Math.cos(rad) * distance;
    const startY = Math.sin(rad) * distance;
    return { id: i, angle, startX, startY, delay: (i % 7) * 0.12, duration: 0.8 + (i % 3) * 0.25 };
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
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Streams of high-velocity photon rays zooming from perimeter to center */}
          {beams.map((b) => (
            <motion.div
              key={b.id}
              className="absolute h-1.5 rounded-full origin-right mix-blend-screen"
              style={{
                background: `linear-gradient(90deg, transparent, ${trailColor}, #FFFFFF)`,
                boxShadow: `0 0 15px ${trailColor}, 0 0 30px #FFFFFF`,
                width: '320px',
                transform: `rotate(${b.angle + 180}deg) translate(${b.distance || 600}px, 0)`
              }}
              animate={{
                transform: [
                  `rotate(${b.angle + 180}deg) translate(800px, 0)`,
                  `rotate(${b.angle + 180}deg) translate(0px, 0)`
                ],
                opacity: [0, 1, 0.9, 0],
                scaleX: [0.2, 1.4, 0.4]
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
              opacity: [0.6, 1, 0.7]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-48 h-48 rounded-full blur-xl mix-blend-screen"
            style={{
              background: `radial-gradient(circle, #FFFFFF 0%, ${trailColor} 50%, transparent 80%)`,
              boxShadow: `0 0 60px ${trailColor}`
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
              className="absolute w-64 h-64 rounded-full border-2 mix-blend-screen"
              style={{ borderColor: trailColor }}
            />
          ))}
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
    </div>
  );
}

