import { useEventStore, EventPhase } from '../stores/useEventStore';
import { eventController } from '../core/EventController';
import { useState } from 'react';

export default function OperatorPanel() {
  const store = useEventStore();
  const { phase, requiredParticipants, participants, isBlackout, setRequiredParticipants, updateParticipant, isPaused, backgroundType, setBackgroundType, explosionType, setExplosionType, energyType, setEnergyType, backgroundColor, setBackgroundColor, explosionColor, setExplosionColor, layout, updateLayout, timelineConfig, updateTimeline, trailColor, setTrailColor, globalTime, totalDuration, setGlobalTime, setScrubbing, setCustomLogo, customLogoCenter, customLogoFly1, customLogoFly2, showNodes, setShowNodes, savedProfiles, saveProfile, loadProfile, deleteProfile } = store;
  
  const [profileName, setProfileName] = useState('');

  const handleActivateAll = () => eventController.activateAll();
  const handleReset = () => eventController.resetEvent();
  const handleConfirm = (id: number) => eventController.confirmParticipant(id);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'customLogoCenter' | 'customLogoFly1' | 'customLogoFly2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTestExplosion = () => {
    const expTime = timelineConfig.countdown + timelineConfig.reveal + timelineConfig.energy + timelineConfig.counter + timelineConfig.finalCharge;
    setGlobalTime(expTime);
    useEventStore.setState({ phase: EventPhase.EXPLOSION });
  };
  
  const handleSaveProfile = () => {
    if (profileName.trim()) {
      saveProfile(profileName.trim());
      setProfileName('');
    }
  };

  const participantsArray = Object.values(participants);
  const confirmedCount = participantsArray.filter(p => p.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-[#0E1217] text-white flex flex-col font-sans h-screen">
      {/* HEADER */}
      <header className="h-14 border-b border-gray-800 bg-[#151921] flex justify-between items-center px-4 md:px-6 shrink-0 z-20">
        <h1 className="text-sm md:text-xl font-bold text-white tracking-wide uppercase">STEPHENSOUTH-VN-<span className="text-gab-cyan">STUDIO</span></h1>
        <div className="flex gap-2 md:gap-3">
           <button onClick={() => eventController.togglePause()} className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded ${isPaused ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
           <button onClick={() => eventController.toggleBlackout()} className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded ${isBlackout ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {isBlackout ? 'RESTORE LED' : 'BLACKOUT'}
          </button>
        </div>
      </header>

      {/* 3-COLUMN WORKSPACE - Responsive Stack */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COLUMN - NODES & STATUS */}
        <div className="w-full lg:w-[300px] border-r border-gray-800 bg-[#151921] flex flex-col shrink-0 overflow-y-auto max-h-[30vh] lg:max-h-full">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Event Status</h2>
            <div className="bg-[#0E1217] rounded p-3 mb-3 border border-gray-800 flex justify-between">
              <div>
                <p className="text-xs text-gray-400">Current Phase</p>
                <p className="text-sm font-mono text-gab-cyan-light break-all">{phase}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Ready</p>
                <p className="text-xl font-bold">{confirmedCount} <span className="text-gray-500 text-sm">/ {requiredParticipants}</span></p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleActivateAll} className="py-2 bg-gab-cyan-light text-black text-xs font-bold rounded hover:opacity-80">ACTIVATE ALL</button>
              <button onClick={() => eventController.runDemo()} className="py-2 bg-yellow-500 text-black text-xs font-bold rounded hover:opacity-80">AUTO DEMO</button>
              <button onClick={handleReset} className="py-2 border border-red-500 text-red-500 text-xs font-bold rounded hover:bg-red-500 hover:text-white col-span-2">RESET EVENT</button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sensors / Nodes</h2>
              <div className="flex items-center gap-2">
                 <button onClick={() => setShowNodes(!showNodes)} className={`text-[10px] px-2 py-0.5 rounded ${showNodes ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}>
                    {showNodes ? 'HIDE' : 'SHOW'}
                 </button>
                 <input type="number" min="8" max="15" value={requiredParticipants} onChange={(e) => setRequiredParticipants(Number(e.target.value))} className="w-10 bg-[#0E1217] border border-gray-700 text-xs px-1 py-1 rounded text-center"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
              {participantsArray.map(p => (
                <div key={p.id} className={`p-1.5 rounded text-center border text-xs flex justify-between items-center ${p.status === 'CONFIRMED' ? 'bg-gab-cyan/20 border-gab-cyan' : 'bg-[#0E1217] border-gray-800'}`}>
                  <span className="font-mono text-gray-400 w-4">{p.id}</span>
                  <input type="text" value={p.name} onChange={(e) => updateParticipant(p.id, { name: e.target.value })} className="w-14 bg-transparent border-b border-transparent focus:border-gray-500 text-center text-white" placeholder="Name"/>
                  <button onClick={() => handleConfirm(p.id)} disabled={p.status === 'CONFIRMED'} className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gab-cyan disabled:opacity-50 disabled:hover:bg-gray-700"></button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
             <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Timeline Duration (s)</h2>
             <div className="space-y-2">
                {[
                  { key: 'countdown', label: 'Countdown' },
                  { key: 'reveal', label: 'Logo Reveal' },
                  { key: 'energy', label: 'Energy Gather' },
                  { key: 'counter', label: 'Global Count' },
                  { key: 'finalCharge', label: 'Final Charge' },
                  { key: 'explosion', label: 'Explosion' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <input type="number" min="0" step="0.1" value={timelineConfig[item.key as keyof typeof timelineConfig]} onChange={(e) => updateTimeline(item.key as keyof typeof timelineConfig, Number(e.target.value))} className="w-16 bg-[#0E1217] border border-gray-700 rounded px-2 py-1 text-xs text-right" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* CENTER COLUMN - PREVIEW & TIMELINE */}
        <div className="flex-1 flex flex-col bg-[#080A0E] relative overflow-hidden min-h-[40vh] lg:min-h-full">
           <div className="flex-1 p-2 md:p-8 flex items-center justify-center relative w-full h-full">
              <div className="w-full h-full max-h-full aspect-video bg-black rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden group flex justify-center items-center">
                 {/* Iframe scale 100% to fit parent */}
                 <iframe src="/led?edit=true" className="w-full h-full absolute inset-0 pointer-events-auto" />
                 
                 <div className="absolute top-2 left-2 bg-gab-cyan/80 text-[10px] text-black font-bold px-2 py-1 rounded backdrop-blur">LIVE PREVIEW - DRAG ENABLED</div>
                 <button onClick={() => window.open('/led', '_blank')} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Pop Out</button>
              </div>
           </div>

           {/* MASTER SCRUBBER */}
           <div className="h-20 md:h-24 bg-[#151921] border-t border-gray-800 p-4 shrink-0 flex flex-col justify-center">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                 <span>0.0s</span>
                 <span className="font-mono text-gab-cyan-light">{globalTime.toFixed(1)}s / {totalDuration.toFixed(1)}s</span>
              </div>
              <input 
                 type="range" min="0" max={totalDuration} step="0.1" 
                 value={globalTime} 
                 onMouseDown={() => setScrubbing(true)} onMouseUp={() => setScrubbing(false)}
                 onTouchStart={() => setScrubbing(true)} onTouchEnd={() => setScrubbing(false)}
                 onChange={(e) => setGlobalTime(Number(e.target.value))} 
                 className="w-full accent-gab-cyan"
              />
           </div>
        </div>

        {/* RIGHT COLUMN - PROPERTIES & ASSETS */}
        <div className="w-full lg:w-[350px] border-l border-gray-800 bg-[#151921] flex flex-col shrink-0 overflow-y-auto max-h-[40vh] lg:max-h-full">
          
          <div className="p-4 border-b border-gray-800 bg-gray-900">
             <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex justify-between">
               Scenario Version Manager
               <span className="text-[9px] text-gab-cyan border border-gab-cyan px-1 rounded">PRO</span>
             </h2>
             <div className="flex gap-2 mb-2">
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Tên kịch bản..." className="flex-1 bg-[#0E1217] border border-gray-700 text-xs px-2 py-1 rounded text-white"/>
                <button onClick={handleSaveProfile} className="bg-gab-cyan-light text-black text-xs font-bold px-3 py-1 rounded hover:opacity-80">SAVE</button>
             </div>
             {Object.keys(savedProfiles).length > 0 && (
                <div className="flex gap-2 mt-2 items-center">
                   <select onChange={(e) => { if(e.target.value) loadProfile(e.target.value); }} className="flex-1 bg-[#0E1217] border border-gray-700 text-xs px-2 py-1.5 rounded text-white">
                      <option value="">-- Tải kịch bản đã lưu --</option>
                      {Object.keys(savedProfiles).map(name => <option key={name} value={name}>{name}</option>)}
                   </select>
                   {/* We could add delete button here if needed */}
                </div>
             )}
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">VFX / Environment</h2>
              <button onClick={handleTestExplosion} className="text-[10px] bg-red-900/50 text-red-400 hover:text-red-300 border border-red-800 px-2 py-0.5 rounded">TEST EXPLOSION</button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">Background Theme</label>
                <select value={backgroundType} onChange={(e) => setBackgroundType(e.target.value as any)} className="w-full bg-[#0E1217] border border-gray-700 rounded px-2 py-1.5 text-white">
                  <option value="particles">Particles (Sao bay)</option>
                  <option value="starfield">Starfield (Vũ trụ)</option>
                  <option value="digital-network">Digital Network</option>
                  <option value="matrix">Matrix Rain (Mưa Code)</option>
                  <option value="nebula">Nebula (Tinh vân)</option>
                  <option value="quantum">Quantum Field</option>
                </select>
              </div>
              <div className="flex gap-2">
                 <div className="flex-1">
                   <label className="text-gray-400 mb-1 block">Explosion</label>
                   <select value={explosionType} onChange={(e) => setExplosionType(e.target.value as any)} className="w-full bg-[#0E1217] border border-gray-700 rounded px-2 py-1.5 text-white">
                     <option value="shockwave">Shockwave</option>
                     <option value="golden-burst">Golden Burst</option>
                     <option value="supernova">Supernova</option>
                     <option value="black-hole">Black Hole</option>
                     <option value="confetti">Confetti</option>
                     <option value="cyber-ring">Cyber Ring</option>
                   </select>
                 </div>
                 <div className="w-1/3">
                   <label className="text-gray-400 mb-1 block">Color</label>
                   <input type="color" value={explosionColor} onChange={(e) => setExplosionColor(e.target.value)} className="w-full h-[26px] rounded bg-transparent cursor-pointer" />
                 </div>
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Energy Gathering</label>
                <select value={energyType} onChange={(e) => setEnergyType(e.target.value as any)} className="w-full bg-[#0E1217] border border-gray-700 rounded px-2 py-1.5 text-white">
                  <option value="default">Default Trail</option>
                  <option value="laser">Laser Beams</option>
                  <option value="spirit-bomb">Spirit Bomb</option>
                  <option value="hexagon">Hexagon Grid</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                 <div className="w-1/2">
                    <label className="text-gray-400 mb-1 block">BG Color</label>
                    <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-full h-8 rounded bg-transparent cursor-pointer" />
                 </div>
                 <div className="w-1/2">
                    <label className="text-gray-400 mb-1 block">Energy Color</label>
                    <input type="color" value={trailColor} onChange={(e) => setTrailColor(e.target.value)} className="w-full h-8 rounded bg-transparent cursor-pointer" />
                 </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Asset Manager (Uploads)</h2>
            <div className="space-y-3 text-xs">
               <div className="bg-[#0E1217] p-2 rounded border border-gray-800">
                  <label className="text-gray-400 mb-1 block">Center Logo (Logo GAB)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoCenter')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-white hover:file:bg-gray-600"/>
                  {customLogoCenter && <button onClick={() => setCustomLogo('customLogoCenter', null)} className="mt-1 text-red-500">Reset</button>}
               </div>
               <div className="bg-[#0E1217] p-2 rounded border border-gray-800">
                  <label className="text-gray-400 mb-1 block">Card 1 (Vietkings Logo)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly1')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-white hover:file:bg-gray-600"/>
                  {customLogoFly1 && <button onClick={() => setCustomLogo('customLogoFly1', null)} className="mt-1 text-red-500">Reset</button>}
               </div>
               <div className="bg-[#0E1217] p-2 rounded border border-gray-800">
                  <label className="text-gray-400 mb-1 block">Card 2 (GAB Card)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly2')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-white hover:file:bg-gray-600"/>
                  {customLogoFly2 && <button onClick={() => setCustomLogo('customLogoFly2', null)} className="mt-1 text-red-500">Reset</button>}
               </div>
            </div>
          </div>

          <div className="p-4">
             <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Layout Inspector</h2>
             <p className="text-[10px] text-gray-500 mb-3">You can also drag elements directly in the preview.</p>
             <div className="space-y-4 text-xs pb-10">
                {/* Simplified layout sliders for brevity */}
                <div className="bg-[#0E1217] p-2 rounded border border-gray-800">
                  <label className="text-gray-400 block mb-1">Final Screen - Line 1</label>
                  <input type="text" value={layout.finalMessage.line1} onChange={(e) => updateLayout('finalMessage', { line1: e.target.value })} className="w-full bg-transparent border-b border-gray-700 focus:border-gab-cyan text-white pb-1 mb-2"/>
                  <label className="text-gray-400 block mb-1">Final Screen - Line 2</label>
                  <input type="text" value={layout.finalMessage.line2} onChange={(e) => updateLayout('finalMessage', { line2: e.target.value })} className="w-full bg-transparent border-b border-gray-700 focus:border-gab-cyan text-white pb-1"/>
                  <div className="flex gap-2 mt-2">
                     <div className="w-1/2">
                       <label className="text-gray-500 text-[10px]">Scale</label>
                       <input type="range" min="0.1" max="3" step="0.1" value={layout.finalMessage.scale} onChange={(e) => updateLayout('finalMessage', { scale: Number(e.target.value) })} className="w-full"/>
                     </div>
                  </div>
                </div>
                
                <div className="bg-[#0E1217] p-2 rounded border border-gray-800">
                  <label className="text-gray-400 block mb-1">Center Logo Scale</label>
                  <input type="range" min="0.1" max="3" step="0.1" value={layout.logo.scale} onChange={(e) => updateLayout('logo', { scale: Number(e.target.value) })} className="w-full"/>
                </div>

                <div className="bg-[#0E1217] p-2 rounded border border-gray-800">
                  <label className="text-gray-400 block mb-1">Counter Scale</label>
                  <input type="range" min="0.1" max="3" step="0.1" value={layout.counter.scale} onChange={(e) => updateLayout('counter', { scale: Number(e.target.value) })} className="w-full"/>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
