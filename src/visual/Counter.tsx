import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { EVENT_CONFIG } from '../config/eventConfig';
import { useEventStore, EventPhase } from '../stores/useEventStore';

export default function Counter() {
  const { phase, layout } = useEventStore();
  const [value, setValue] = useState(0);
  const visible = phase === EventPhase.COUNTER_SEQUENCE || phase === EventPhase.FINAL_CHARGE || phase === EventPhase.EXPLOSION || phase === EventPhase.SUCCESS;

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
    <div 
      className={`transition-all duration-1000 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} flex flex-col items-center absolute`}
      style={{
        transform: `translateY(${layout.counter.y}px) scale(${layout.counter.scale * (visible ? 1 : 0.5)})`
      }}
    >
      <h2 className="text-4xl text-gab-cyan-light mb-4 tracking-[0.5em] uppercase">Global Activation</h2>
      <div className="text-[200px] font-bold text-white drop-shadow-[0_0_60px_rgba(91,192,190,1)] leading-none">
        {value}{EVENT_CONFIG.counter.suffix}
      </div>
    </div>
  );
}
