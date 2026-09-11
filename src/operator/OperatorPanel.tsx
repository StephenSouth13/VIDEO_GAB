import { useEventStore } from '../stores/useEventStore';
import { eventController } from '../core/EventController';

export default function OperatorPanel() {
  const { phase, requiredParticipants, participants, isBlackout, customBackgroundHTML, setCustomBackgroundHTML, setRequiredParticipants, particleCount, setParticleCount, updateParticipant, nodeShape, setNodeShape, isPaused, backgroundType, setBackgroundType, explosionType, setExplosionType, layout, updateLayout } = useEventStore();
  
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Panel */}
        <div className="bg-gab-blue p-6 rounded-lg shadow-lg">
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
              <button 
                onClick={handleActivateAll}
                className="w-full py-2 bg-gab-cyan-light text-gab-navy font-bold rounded hover:bg-white transition"
              >
                ACTIVATE ALL (A)
              </button>
              
              <button 
                onClick={() => eventController.skipToNextPhase()}
                className="w-full py-2 bg-gab-cyan text-white font-bold rounded hover:bg-gab-cyan-light transition"
              >
                SKIP PHASE (Space)
              </button>
              
              <button 
                onClick={() => eventController.runDemo()}
                className="w-full py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition"
              >
                ▶ RUN AUTO DEMO
              </button>
              
              <button 
                onClick={handleReset}
                className="w-full py-2 border border-red-500 text-red-500 font-bold rounded hover:bg-red-500 hover:text-white transition"
              >
                RESET EVENT (Z)
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="bg-gab-blue p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Settings</h2>
          <div className="space-y-4">
             <div>
               <label className="block text-sm text-gray-400 mb-1">Số lượng người tham gia (8-15)</label>
               <input 
                 type="number" 
                 min="8" max="15" 
                 value={requiredParticipants}
                 onChange={(e) => setRequiredParticipants(Number(e.target.value))}
                 className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-2 text-white"
               />
             </div>
             <div>
               <label className="block text-sm text-gray-400 mb-1">Mật độ Particle (Sao bay)</label>
               <input 
                 type="range" 
                 min="100" max="5000" step="100"
                 value={particleCount}
                 onChange={(e) => setParticleCount(Number(e.target.value))}
                 className="w-full"
               />
               <div className="text-right text-xs text-gab-cyan-light">{particleCount} particles</div>
             </div>
             <div>
               <label className="block text-sm text-gray-400 mb-1">Kiểu dáng trạm (Node Shape)</label>
               <select 
                 value={nodeShape}
                 onChange={(e) => setNodeShape(e.target.value as 'circle' | 'rectangle')}
                 className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-2 text-white"
               >
                 <option value="circle">Hình tròn (Circle)</option>
                 <option value="rectangle">Hình chữ nhật đứng (Card)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm text-gray-400 mb-1">Hiệu ứng Background</label>
               <select 
                 value={backgroundType}
                 onChange={(e) => setBackgroundType(e.target.value as any)}
                 className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-2 text-white"
               >
                 <option value="particles">Sao bay cơ bản (Particles)</option>
                 <option value="starfield">Vũ trụ chuyển động (Starfield)</option>
                 <option value="digital-network">Lưới Cyber (Digital Network)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm text-gray-400 mb-1">Hiệu ứng Nổ (Explosion)</label>
               <select 
                 value={explosionType}
                 onChange={(e) => setExplosionType(e.target.value as any)}
                 className="w-full bg-gab-navy border border-gab-cyan rounded px-3 py-2 text-white"
               >
                 <option value="shockwave">Sóng xung kích trắng (Shockwave)</option>
                 <option value="golden-burst">Vàng nổ tung (Golden Burst)</option>
                 <option value="supernova">Supernova</option>
               </select>
             </div>
          </div>
        </div>

        {/* Studio Layout Editor */}
        <div className="bg-gab-blue p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Studio Layout Editor</h2>
          <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2">
            
            {/* Logo Layout */}
            <div className="border border-gray-700 p-3 rounded">
              <h3 className="font-bold text-sm mb-2 text-white">Logo GAB</h3>
              <label className="block text-xs text-gray-400">Vị trí dọc (Y Offset): {layout.logo.y}px</label>
              <input type="range" min="-500" max="500" value={layout.logo.y} onChange={(e) => updateLayout('logo', { y: Number(e.target.value) })} className="w-full mb-2"/>
              <label className="block text-xs text-gray-400">Kích thước (Scale): {layout.logo.scale}</label>
              <input type="range" min="0.1" max="3" step="0.1" value={layout.logo.scale} onChange={(e) => updateLayout('logo', { scale: Number(e.target.value) })} className="w-full"/>
            </div>

            {/* Counter Layout */}
            <div className="border border-gray-700 p-3 rounded">
              <h3 className="font-bold text-sm mb-2 text-white">Bộ đếm (Counter 400+)</h3>
              <label className="block text-xs text-gray-400">Vị trí dọc (Y Offset): {layout.counter.y}px</label>
              <input type="range" min="-500" max="500" value={layout.counter.y} onChange={(e) => updateLayout('counter', { y: Number(e.target.value) })} className="w-full mb-2"/>
              <label className="block text-xs text-gray-400">Kích thước (Scale): {layout.counter.scale}</label>
              <input type="range" min="0.1" max="3" step="0.1" value={layout.counter.scale} onChange={(e) => updateLayout('counter', { scale: Number(e.target.value) })} className="w-full"/>
            </div>

            {/* Final Screen Editor */}
            <div className="border border-gray-700 p-3 rounded">
              <h3 className="font-bold text-sm mb-2 text-white">Màn hình Cuối (Final Screen)</h3>
              
              <label className="block text-xs text-gray-400 mb-1">Dòng 1</label>
              <input type="text" value={layout.finalMessage.line1} onChange={(e) => updateLayout('finalMessage', { line1: e.target.value })} className="w-full bg-gab-navy border border-gab-cyan rounded px-2 py-1 mb-2 text-sm text-white"/>
              
              <label className="block text-xs text-gray-400 mb-1">Dòng 2</label>
              <input type="text" value={layout.finalMessage.line2} onChange={(e) => updateLayout('finalMessage', { line2: e.target.value })} className="w-full bg-gab-navy border border-gab-cyan rounded px-2 py-1 mb-3 text-sm text-white"/>
              
              <label className="block text-xs text-gray-400">Vị trí dọc (Y Offset): {layout.finalMessage.y}px</label>
              <input type="range" min="-500" max="500" value={layout.finalMessage.y} onChange={(e) => updateLayout('finalMessage', { y: Number(e.target.value) })} className="w-full mb-2"/>
              <label className="block text-xs text-gray-400">Kích thước (Scale): {layout.finalMessage.scale}</label>
              <input type="range" min="0.1" max="3" step="0.1" value={layout.finalMessage.scale} onChange={(e) => updateLayout('finalMessage', { scale: Number(e.target.value) })} className="w-full"/>
            </div>
            
          </div>
        </div>

        {/* Participants Panel */}
        <div className="md:col-span-3 bg-gab-blue p-6 rounded-lg shadow-lg">
           <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Sensors / Participants</h2>
           
           <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {participantsArray.map(p => (
                <div 
                  key={p.id} 
                  className={`p-4 rounded-lg text-center border-2 transition ${
                    p.status === 'CONFIRMED' 
                      ? 'bg-gab-cyan-light bg-opacity-20 border-gab-cyan-light text-gab-cyan-light' 
                      : 'bg-gab-navy border-gab-cyan text-gray-400'
                  }`}
                >
                  <input 
                    type="text"
                    value={p.name}
                    onChange={(e) => updateParticipant(p.id, { name: e.target.value })}
                    className="w-full bg-transparent border-b border-gray-600 text-center font-bold text-lg mb-2 focus:outline-none focus:border-white"
                  />
                  <p className="text-xs mb-3">{p.status}</p>
                  <button 
                    onClick={() => handleConfirm(p.id)}
                    disabled={p.status === 'CONFIRMED'}
                    className="text-xs px-3 py-1 bg-gab-cyan rounded hover:bg-gab-cyan-light text-white disabled:opacity-50"
                  >
                    ACTIVATE
                  </button>
                </div>
              ))}
           </div>
        </div>
        
        {/* Custom Background Embed Panel */}
        <div className="md:col-span-3 bg-gab-blue p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gab-cyan-light">Custom Background / Video Embed</h2>
          <p className="text-sm text-gray-400 mb-2">Nhúng mã HTML, Iframe hoặc Video (ví dụ: `&lt;video src="/video.mp4" autoPlay loop muted className="w-full h-full object-cover"&gt;&lt;/video&gt;`) để hiển thị làm background trên màn LED thay vì code cứng.</p>
          <textarea
            className="w-full h-32 bg-gab-navy border border-gab-cyan rounded p-3 text-sm font-mono text-white focus:outline-none focus:border-gab-cyan-light"
            placeholder="<!-- Paste your custom HTML or iframe here -->"
            value={customBackgroundHTML}
            onChange={(e) => setCustomBackgroundHTML(e.target.value)}
          ></textarea>
        </div>
        
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
         URL cho LED: <a href="/led" target="_blank" className="text-gab-cyan-light underline">http://localhost:5173/led</a>
         <p className="mt-2">Lưu ý: Bấm F11 để Fullscreen cửa sổ LED</p>
      </footer>
    </div>
  );
}
