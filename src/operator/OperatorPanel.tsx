import { useEventStore } from '../stores/useEventStore';
import { eventController } from '../core/EventController';

export default function OperatorPanel() {
  const { phase, requiredParticipants, participants, isBlackout, customBackgroundHTML, setCustomBackgroundHTML, setRequiredParticipants, particleCount, setParticleCount, updateParticipant, nodeShape, setNodeShape, isPaused, backgroundType, setBackgroundType, explosionType, setExplosionType, layout, updateLayout, timelineConfig, updateTimeline, trailColor, setTrailColor } = useEventStore();
  
  const handleActivateAll = () => {
    eventController.activateAll();
  };
  
  const handleReset = () => {
    eventController.resetEvent();
  };
  
  const handleConfirm = (id: number) => {
    eventController.confirmParticipant(id);
  };
  
  const participantsArray = Object.values(participants);
  const confirmedCount = participantsArray.filter(p => p.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-gab-navy text-white p-6">
      <header className="mb-8 border-b border-gab-cyan pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gab-cyan-light">GAB Operator Control Panel</h1>
        <div className="flex gap-4">
           <button 
            onClick={() => eventController.togglePause()} 
            className={`px-6 py-2 font-bold rounded text-white ${isPaused ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gab-cyan hover:bg-gab-cyan-light'}`}
          >
            {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
           <button 
            onClick={() => eventController.toggleBlackout()} 
            className={`px-4 py-2 font-bold rounded ${isBlackout ? 'bg-red-600' : 'bg-gray-700'}`}
          >
            {isBlackout ? 'RESTORE LED' : 'BLACKOUT (B)'}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar - Status & Controls */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-gab-blue p-6 rounded-lg shadow-lg relative">
            {/* MINI PREVIEW WINDOW */}
            <div className="absolute top-4 right-4 w-32 md:w-48 aspect-video bg-black rounded border-2 border-gab-cyan overflow-hidden shadow-[0_0_15px_rgba(91,192,190,0.5)] group">
               <div className="absolute top-0 left-0 bg-gab-cyan text-[10px] font-bold px-1 py-0.5 rounded-br z-50">LIVE PREVIEW</div>
               <iframe src="/led" className="w-[1280px] h-[720px] scale-[0.1] md:scale-[0.15] origin-top-left pointer-events-none" />
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Event Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Current Phase</p>
                <p className="text-xl font-mono text-gab-electric">{phase}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Participants Ready</p>
                <p className="text-2xl font-bold">
                  {confirmedCount} <span className="text-gray-500">/ {requiredParticipants}</span>
                </p>
              </div>
              
              <div className="pt-4 flex flex-col gap-2 border-t border-gab-cyan">
                <button onClick={handleActivateAll} className="w-full py-2 bg-gab-cyan-light text-gab-navy font-bold rounded hover:bg-white transition">ACTIVATE ALL (A)</button>
                <button onClick={() => eventController.skipToNextPhase()} className="w-full py-2 bg-gab-cyan text-white font-bold rounded hover:bg-gab-cyan-light transition">SKIP PHASE (Space)</button>
                <button onClick={() => eventController.runDemo()} className="w-full py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition">▶ RUN AUTO DEMO</button>
                <button onClick={handleReset} className="w-full py-2 border border-red-500 text-red-500 font-bold rounded hover:bg-red-500 hover:text-white transition">RESET EVENT (Z)</button>
              </div>
            </div>
          </div>
          
          <div className="bg-gab-blue p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Timeline Editor</h2>
             <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Phase</span><span>Seconds</span></div>
                {[
                  { key: 'countdown', label: 'Countdown (5s...)' },
                  { key: 'reveal', label: 'Logo Reveal' },
                  { key: 'energy', label: 'Energy Convergence' },
                  { key: 'counter', label: 'Global Counter' },
                  { key: 'finalCharge', label: 'Final Charge' },
                  { key: 'explosion', label: 'Explosion' }
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-2">
                    <span className="text-sm w-32">{item.label}</span>
                    <input 
                      type="number" min="0" step="0.1" 
                      value={timelineConfig[item.key as keyof typeof timelineConfig]} 
                      onChange={(e) => updateTimeline(item.key as keyof typeof timelineConfig, Number(e.target.value))}
                      className="w-20 bg-gab-navy border border-gab-cyan rounded px-2 py-1 text-sm text-center" 
                    />
                    <span className="text-xs text-gray-500">s</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Dynamic Controls & FX */}
          <div className="bg-gab-blue p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Environment & FX</h2>
            <div className="space-y-4">
               <div className="flex gap-4">
                 <div className="w-1/2">
                   <label className="block text-sm text-gray-400 mb-1">Số trạm KLG</label>
                   <input type="number" min="8" max="15" value={requiredParticipants} onChange={(e) => setRequiredParticipants(Number(e.target.value))} className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-1.5 text-white" />
                 </div>
                 <div className="w-1/2">
                   <label className="block text-sm text-gray-400 mb-1">Kiểu dáng trạm</label>
                   <select value={nodeShape} onChange={(e) => setNodeShape(e.target.value as 'circle' | 'rectangle')} className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-1.5 text-white">
                     <option value="circle">Hình tròn</option>
                     <option value="rectangle">Thẻ chữ nhật</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-sm text-gray-400 mb-1">Màu tia năng lượng (Energy Trail)</label>
                 <div className="flex gap-2 items-center">
                    <input type="color" value={trailColor} onChange={(e) => setTrailColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent" />
                    <span className="font-mono text-sm">{trailColor}</span>
                 </div>
               </div>

               <div>
                 <label className="block text-sm text-gray-400 mb-1">Hiệu ứng Background</label>
                 <select value={backgroundType} onChange={(e) => setBackgroundType(e.target.value as any)} className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-2 text-white">
                   <option value="particles">Sao bay cơ bản (Particles)</option>
                   <option value="starfield">Vũ trụ chuyển động (Starfield)</option>
                   <option value="digital-network">Lưới Cyber (Digital Network)</option>
                 </select>
               </div>
               
               <div>
                 <label className="block text-sm text-gray-400 mb-1">Hiệu ứng Nổ (Explosion)</label>
                 <select value={explosionType} onChange={(e) => setExplosionType(e.target.value as any)} className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-2 text-white">
                   <option value="shockwave">Sóng xung kích trắng</option>
                   <option value="golden-burst">Vàng nổ tung (Golden)</option>
                   <option value="supernova">Supernova (Cyan)</option>
                 </select>
               </div>
            </div>
          </div>

          {/* Studio Layout Editor */}
          <div className="bg-gab-blue p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Studio Layout Editor</h2>
            <div className="space-y-6 overflow-y-auto max-h-[350px] pr-2">
              
              <div className="border border-gray-700 p-3 rounded">
                <h3 className="font-bold text-sm mb-2 text-white">Logo GAB</h3>
                <label className="block text-xs text-gray-400">X Offset: {layout.logo.x}px</label>
                <input type="range" min="-500" max="500" value={layout.logo.x} onChange={(e) => updateLayout('logo', { x: Number(e.target.value) })} className="w-full mb-1"/>
                <label className="block text-xs text-gray-400">Y Offset: {layout.logo.y}px</label>
                <input type="range" min="-500" max="500" value={layout.logo.y} onChange={(e) => updateLayout('logo', { y: Number(e.target.value) })} className="w-full mb-1"/>
                <label className="block text-xs text-gray-400">Scale: {layout.logo.scale}</label>
                <input type="range" min="0.1" max="3" step="0.1" value={layout.logo.scale} onChange={(e) => updateLayout('logo', { scale: Number(e.target.value) })} className="w-full"/>
              </div>

              <div className="border border-gray-700 p-3 rounded">
                <h3 className="font-bold text-sm mb-2 text-white">Counter (400+)</h3>
                <label className="block text-xs text-gray-400">X Offset: {layout.counter.x}px</label>
                <input type="range" min="-500" max="500" value={layout.counter.x} onChange={(e) => updateLayout('counter', { x: Number(e.target.value) })} className="w-full mb-1"/>
                <label className="block text-xs text-gray-400">Y Offset: {layout.counter.y}px</label>
                <input type="range" min="-500" max="500" value={layout.counter.y} onChange={(e) => updateLayout('counter', { y: Number(e.target.value) })} className="w-full mb-1"/>
                <label className="block text-xs text-gray-400">Scale: {layout.counter.scale}</label>
                <input type="range" min="0.1" max="3" step="0.1" value={layout.counter.scale} onChange={(e) => updateLayout('counter', { scale: Number(e.target.value) })} className="w-full"/>
              </div>

              <div className="border border-gray-700 p-3 rounded">
                <h3 className="font-bold text-sm mb-2 text-white">Final Screen</h3>
                <input type="text" value={layout.finalMessage.line1} onChange={(e) => updateLayout('finalMessage', { line1: e.target.value })} className="w-full bg-gab-navy border border-gray-600 rounded px-2 py-1 mb-2 text-sm text-white"/>
                <input type="text" value={layout.finalMessage.line2} onChange={(e) => updateLayout('finalMessage', { line2: e.target.value })} className="w-full bg-gab-navy border border-gray-600 rounded px-2 py-1 mb-2 text-sm text-white"/>
                <label className="block text-xs text-gray-400">X Offset: {layout.finalMessage.x}px</label>
                <input type="range" min="-500" max="500" value={layout.finalMessage.x} onChange={(e) => updateLayout('finalMessage', { x: Number(e.target.value) })} className="w-full mb-1"/>
                <label className="block text-xs text-gray-400">Y Offset: {layout.finalMessage.y}px</label>
                <input type="range" min="-500" max="500" value={layout.finalMessage.y} onChange={(e) => updateLayout('finalMessage', { y: Number(e.target.value) })} className="w-full mb-1"/>
                <label className="block text-xs text-gray-400">Scale: {layout.finalMessage.scale}</label>
                <input type="range" min="0.1" max="3" step="0.1" value={layout.finalMessage.scale} onChange={(e) => updateLayout('finalMessage', { scale: Number(e.target.value) })} className="w-full"/>
              </div>
            </div>
          </div>

          {/* Participants Panel */}
          <div className="md:col-span-2 bg-gab-blue p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Sensors / Participants</h2>
             <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {participantsArray.map(p => (
                  <div key={p.id} className={`p-2 rounded text-center border transition ${p.status === 'CONFIRMED' ? 'bg-gab-cyan-light bg-opacity-20 border-gab-cyan-light' : 'bg-gab-navy border-gray-700'}`}>
                    <input type="text" value={p.name} onChange={(e) => updateParticipant(p.id, { name: e.target.value })} className="w-full bg-transparent border-b border-gray-600 text-center font-bold text-xs mb-1 focus:outline-none focus:border-white text-white"/>
                    <button onClick={() => handleConfirm(p.id)} disabled={p.status === 'CONFIRMED'} className="text-[10px] px-2 py-1 bg-gab-cyan rounded hover:bg-gab-cyan-light text-white disabled:opacity-50 w-full truncate">
                      {p.status === 'CONFIRMED' ? 'OK' : 'ACTIVATE'}
                    </button>
                  </div>
                ))}
             </div>
          </div>
          
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
         URL cho LED: <a href="/led" target="_blank" className="text-gab-cyan-light underline">http://localhost:5173/led</a>
         <p className="mt-2">Lưu ý: Bấm F11 để Fullscreen cửa sổ LED</p>
      </footer>
    </div>
  );
}
