import { useEventStore, EventPhase } from '../stores/useEventStore';
import { useEffect, useState } from 'react';

export default function ExplosionSystem() {
  const { phase } = useEventStore();
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
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
       <div className="w-[100vw] h-[100vw] rounded-full bg-white animate-ping opacity-80 mix-blend-screen shadow-[0_0_200px_rgba(255,255,255,1)]"></div>
    </div>
  );
}
