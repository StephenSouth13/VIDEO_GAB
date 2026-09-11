import { EVENT_CONFIG } from '../config/eventConfig';

export default function FinalScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in duration-1000">
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">
        {EVENT_CONFIG.finalMessage.line1}
      </h1>
      <h2 className="text-4xl md:text-6xl text-gab-cyan-light drop-shadow-[0_0_20px_rgba(91,192,190,0.5)]">
        {EVENT_CONFIG.finalMessage.line2}
      </h2>
      <div className="mt-16 opacity-50 flex items-center justify-center gap-8">
        <img src="/assets/logos/vietkings.png" alt="VietKings" className="h-16" onError={(e) => e.currentTarget.style.display='none'}/>
        <img src="/assets/cards/gab-card.png" alt="GAB Card" className="h-24" onError={(e) => e.currentTarget.style.display='none'}/>
      </div>
    </div>
  );
}
