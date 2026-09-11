import { useEffect, useState } from 'react';
import { useEventStore } from '../stores/useEventStore';

export default function LogoReveal() {
  const { phase, layout } = useEventStore();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Fade in after a short delay
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div 
      className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'} flex flex-col items-center absolute`}
      style={{
        transform: `translateY(${layout.logo.y}px) scale(${layout.logo.scale})`
      }}
    >
       {/* Use an img placeholder if gab.svg is missing */}
       <img 
         src="/logo/GAB.png" 
         alt="GAB Logo" 
         onError={(e) => {
            e.currentTarget.style.display = 'none';
            // Fallback text if image fails to load
            e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl font-bold text-gab-cyan-light font-mono shadow-[0_0_50px_rgba(91,192,190,0.8)] px-12 py-8 border-4 border-gab-cyan rounded-xl backdrop-blur-sm bg-gab-navy bg-opacity-50">GAB</div>';
         }}
         className="w-[60vw] max-w-[800px] object-contain drop-shadow-[0_0_50px_rgba(91,192,190,0.8)]"
       />
    </div>
  );
}
