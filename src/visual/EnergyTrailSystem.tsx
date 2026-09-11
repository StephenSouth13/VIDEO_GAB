import { useEventStore, EventPhase } from '../stores/useEventStore';
import { motion } from 'framer-motion';

export default function EnergyTrailSystem() {
  const { phase, trailColor, energyType, isPaused } = useEventStore();
  
  const isConvergenceActive = 
    phase === EventPhase.ENERGY_CONVERGENCE || 
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
    return { id: i, angle, distance, startX, startY, delay: (i % 7) * 0.12, duration: 0.8 + (i % 3) * 0.25 };
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
