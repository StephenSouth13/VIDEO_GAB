import { useEffect, useState } from 'react';

export default function LogoReveal() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Fade in after a short delay
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'} flex flex-col items-center`}>
       {/* Use an img placeholder if gab.svg is missing */}
       <img 
         src="/assets/logos/gab.svg" 
         alt="GAB Logo" 
         onError={(e) => {
            e.currentTarget.style.display = 'none';
            document.getElementById('gab-placeholder')!.style.display = 'block';
         }}
         className="w-[600px] h-auto drop-shadow-[0_0_40px_rgba(0,240,255,0.6)]" 
       />
       <div id="gab-placeholder" className="hidden text-6xl font-bold text-gab-cyan-light border-4 border-gab-cyan-light p-8 rounded-lg shadow-[0_0_50px_rgba(91,192,190,0.5)]">
          [GAB LOGO PLACEHOLDER]
       </div>
    </div>
  );
}
