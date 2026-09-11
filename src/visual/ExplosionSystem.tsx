import { useEventStore, EventPhase } from '../stores/useEventStore';
import { useEffect, useState } from 'react';

export default function ExplosionSystem() {
  const { phase, explosionType } = useEventStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (phase === EventPhase.EXPLOSION) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
       {explosionType === 'shockwave' && (
         <div className="w-[100vw] h-[100vw] rounded-full bg-white animate-ping opacity-80 mix-blend-screen shadow-[0_0_200px_rgba(255,255,255,1)]"></div>
       )}
       {explosionType === 'golden-burst' && (
         <div className="w-[150vw] h-[150vw] rounded-full bg-yellow-400 animate-ping opacity-90 mix-blend-screen shadow-[0_0_300px_rgba(250,204,21,1)]"></div>
       )}
       {explosionType === 'supernova' && (
         <div className="w-[200vw] h-[200vw] rounded-full bg-gab-cyan animate-ping opacity-100 mix-blend-color-dodge shadow-[0_0_500px_rgba(0,255,255,1)]"></div>
       )}
    </div>
  );
}
