import { EVENT_CONFIG } from '../config/eventConfig';
import { useEventStore, EventPhase } from '../stores/useEventStore';

export default function FinalScreen() {
  const { phase, layout } = useEventStore();
  const visible = phase === EventPhase.SUCCESS;

  if (!visible) return null;

  const finalMessage = layout?.finalMessage || EVENT_CONFIG.finalMessage;

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center text-center animate-fade-in duration-1000"
      style={{
        transform: `translateY(${finalMessage.y}px) scale(${finalMessage.scale})`,
      }}
    >
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">
        {finalMessage.line1 || EVENT_CONFIG.finalMessage.line1}
      </h1>
      <h2 className="text-4xl md:text-6xl text-gab-cyan-light drop-shadow-[0_0_20px_rgba(91,192,190,0.5)]">
        {finalMessage.line2 || EVENT_CONFIG.finalMessage.line2}
      </h2>
      <div className="mt-16 opacity-50 flex items-center justify-center gap-8">
        <img src="/logo/vietkings.webp" alt="VietKings" className="h-16" onError={(e) => e.currentTarget.style.display='none'}/>
        <img src="/logo/GAB.png" alt="GAB Card" className="h-24" onError={(e) => e.currentTarget.style.display='none'}/>
      </div>
    </div>
  );
}
