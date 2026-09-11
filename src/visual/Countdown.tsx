import { useEffect, useState } from 'react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function Countdown() {
  const [count, setCount] = useState(EVENT_CONFIG.countdown.seconds);

  useEffect(() => {
    if (count > 1) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <h1 
        key={count} 
        className="text-[300px] font-bold text-white drop-shadow-[0_0_50px_rgba(0,240,255,0.8)] animate-pulse"
      >
        {count}
      </h1>
    </div>
  );
}
