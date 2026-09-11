import { useEventStore, EventPhase } from '../stores/useEventStore';
import { useEffect, useState } from 'react';

export default function ExplosionSystem() {
  const { phase, explosionType, isPaused, explosionColor } = useEventStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (phase === EventPhase.EXPLOSION) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [phase]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
       {explosionType === 'shockwave' && (
         <div className="w-[100vw] h-[100vw] rounded-full animate-ping opacity-80 mix-blend-screen" style={{ backgroundColor: explosionColor, animationPlayState: isPaused ? 'paused' : 'running' }}></div>
       )}
       {explosionType === 'golden-burst' && (
         <div className="w-[150vw] h-[150vw] rounded-full animate-ping opacity-90 mix-blend-screen" style={{ backgroundColor: explosionColor, animationPlayState: isPaused ? 'paused' : 'running' }}></div>
       )}
       {explosionType === 'supernova' && (
         <div className="w-[200vw] h-[200vw] rounded-full animate-ping opacity-100 mix-blend-color-dodge shadow-[0_0_500px_rgba(255,255,255,0.8)]" style={{ backgroundColor: explosionColor, animationPlayState: isPaused ? 'paused' : 'running' }}></div>
       )}
       {explosionType === 'black-hole' && (
         <div className="w-[200vw] h-[200vw] rounded-full bg-black animate-ping opacity-100" style={{ animationPlayState: isPaused ? 'paused' : 'running', boxShadow: `inset 0 0 100px ${explosionColor}` }}></div>
       )}
       {explosionType === 'confetti' && (
         <div className="w-full h-full flex flex-wrap gap-2 animate-pulse mix-blend-screen" style={{ backgroundColor: explosionColor, animationPlayState: isPaused ? 'paused' : 'running' }}></div>
       )}
       {explosionType === 'cyber-ring' && (
         <div className="w-[150vw] h-[150vw] rounded-full border-[100px] animate-ping opacity-100 mix-blend-screen" style={{ borderColor: explosionColor, animationPlayState: isPaused ? 'paused' : 'running' }}></div>
       )}
    </div>
  );
}
