import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function Counter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: EVENT_CONFIG.counter.finalValue,
      duration: 6,
      ease: "power2.inOut",
      onUpdate: () => {
        setValue(Math.floor(obj.val));
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl text-gab-cyan-light mb-4 tracking-[0.5em] uppercase">Global Activation</h2>
      <div className="text-[200px] font-bold text-white drop-shadow-[0_0_60px_rgba(91,192,190,1)] leading-none">
        {value}{EVENT_CONFIG.counter.suffix}
      </div>
    </div>
  );
}
