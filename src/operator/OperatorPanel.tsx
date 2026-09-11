import { useEventStore, EventPhase } from '../stores/useEventStore';
import { eventController } from '../core/EventController';
import { useState } from 'react';

export default function OperatorPanel() {
  const store = useEventStore();
  const { 
    phase, 
    requiredParticipants, 
    participants, 
    isBlackout, 
    setRequiredParticipants, 
    updateParticipant, 
    isPaused, 
    backgroundType, 
    setBackgroundType, 
    explosionType, 
    setExplosionType, 
    energyType, 
    setEnergyType, 
    backgroundColor, 
    setBackgroundColor, 
    explosionColor, 
    setExplosionColor, 
    layout, 
    updateLayout, 
    timelineConfig, 
    updateTimeline, 
    trailColor, 
    setTrailColor, 
    globalTime, 
    totalDuration, 
    setGlobalTime, 
    setScrubbing, 
    setCustomLogo, 
    showNodes, 
    setShowNodes, 
    savedProfiles, 
    saveProfile, 
    loadProfile, 
    deleteProfile 
  } = store;
  
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

  const handleTestEnergy = () => {
    const energyTime = timelineConfig.countdown + timelineConfig.reveal;
    setGlobalTime(energyTime);
    useEventStore.setState({ phase: EventPhase.ENERGY_CONVERGENCE });
  };

  const handleTestFinalScreen = () => {
    setGlobalTime(totalDuration);
    useEventStore.setState({ phase: EventPhase.SUCCESS });
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
           <div className="flex-1 p-2 md:p-6 flex items-center justify-center relative w-full h-full">
              <div className="w-full h-full max-h-full aspect-video bg-black rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden group flex justify-center items-center">
                 {/* Iframe scale 100% to fit parent */}
                 <iframe src="/led?edit=true" className="w-full h-full absolute inset-0 pointer-events-auto" />
                 
                 <div className="absolute top-2 left-2 bg-gab-cyan/80 text-[10px] text-black font-bold px-2 py-1 rounded backdrop-blur">LIVE PREVIEW - DRAG ENABLED</div>
                 <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                   <button onClick={handleTestEnergy} className="bg-yellow-500/80 hover:bg-yellow-400 text-black font-bold text-[10px] px-2 py-1 rounded">Tia Tụ Logo</button>
                   <button onClick={handleTestExplosion} className="bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] px-2 py-1 rounded">Nổ Vũ Trụ</button>
                   <button onClick={handleTestFinalScreen} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] px-2 py-1 rounded">Màn Kết</button>
                   <button onClick={() => window.open('/led', '_blank')} className="bg-white/10 hover:bg-white/20 text-white text-xs px-2 py-1 rounded">Pop Out</button>
                 </div>
              </div>
           </div>

           {/* MASTER SCRUBBER */}
           <div className="h-20 md:h-24 bg-[#151921] border-t border-gray-800 p-4 shrink-0 flex flex-col justify-center">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                 <span>0.0s (Bắt đầu)</span>
                 <span className="font-mono text-gab-cyan-light font-bold text-sm">{globalTime.toFixed(1)}s / {totalDuration.toFixed(1)}s</span>
                 <span>{totalDuration.toFixed(1)}s (Màn kết)</span>
              </div>
              <input 
                 type="range" min="0" max={totalDuration} step="0.1" 
                 value={globalTime} 
                 onMouseDown={() => setScrubbing(true)} onMouseUp={() => setScrubbing(false)}
                 onTouchStart={() => setScrubbing(true)} onTouchEnd={() => setScrubbing(false)}
                 onChange={(e) => setGlobalTime(Number(e.target.value))} 
                 className="w-full accent-gab-cyan cursor-pointer"
              />
           </div>
        </div>

        {/* RIGHT COLUMN - PROPERTIES & ASSETS */}
        <div className="w-full lg:w-[380px] border-l border-gray-800 bg-[#151921] flex flex-col shrink-0 overflow-y-auto max-h-[50vh] lg:max-h-full">
          
          {/* 1. SCENARIO MANAGER */}
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
                <div className="space-y-1.5 mt-2">
                   {Object.keys(savedProfiles).map(name => (
                     <div key={name} className="flex justify-between items-center bg-[#0E1217] border border-gray-800 px-2 py-1 rounded text-xs">
                        <span className="truncate max-w-[180px] text-gray-300 font-mono">{name}</span>
                        <div className="flex gap-1">
                          <button onClick={() => loadProfile(name)} className="px-2 py-0.5 bg-gab-cyan/20 text-gab-cyan text-[10px] rounded hover:bg-gab-cyan hover:text-black font-bold">LOAD</button>
                          <button onClick={() => deleteProfile(name)} className="px-1.5 py-0.5 text-red-400 hover:text-red-200 text-[10px] rounded" title="Xóa">✕</button>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

          {/* 2. MẪU MÀN HÌNH KẾT THÚC (ENDING TEMPLATES) */}
          <div className="p-4 border-b border-gray-800 bg-gradient-to-b from-[#181d26] to-[#151921]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>✦</span> Mẫu Màn Hình Lúc Kết (Templates)
              </h2>
              <button onClick={handleTestFinalScreen} className="text-[10px] bg-cyan-900/50 text-cyan-300 hover:text-cyan-200 border border-cyan-800 px-2 py-0.5 rounded font-bold">XEM MÀN KẾT</button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
               {[
                 { id: 'dual-cards', label: '2 Thẻ Đối Xứng (Classic)', desc: 'Vietkings góc trái + GAB góc phải' },
                 { id: 'center-hero', label: 'Logo Kim Cương Trọng Tâm', desc: 'Logo lớn trung tâm + Chúc mừng' },
                 { id: 'top-sponsors', label: 'Thanh Đối Tác Trên Cùng', desc: 'Dàn ngang logo phía trên' },
                 { id: 'cyber-hologram', label: 'Cyber 3D Hologram', desc: 'Khung Neon công nghệ viền sáng' },
                 { id: 'golden-prestige', label: 'Hoàng Kim Sang Trọng', desc: 'Viền vàng ánh kim hoàng gia' },
                 { id: 'minimal-clean', label: 'Tối Giản Hiện Đại', desc: 'Font chữ tinh tế, không nghiêng' }
               ].map(tpl => (
                 <button
                   key={tpl.id}
                   onClick={() => store.setFinalTemplate(tpl.id as any)}
                   className={`p-2 rounded text-left border transition ${store.finalTemplate === tpl.id ? 'bg-gab-cyan/20 border-gab-cyan text-white shadow-lg' : 'bg-[#0E1217] border-gray-800 text-gray-400 hover:border-gray-600'}`}
                 >
                   <p className="font-bold text-[11px] text-white flex items-center justify-between">
                     {tpl.label}
                     {store.finalTemplate === tpl.id && <span className="text-gab-cyan">✓</span>}
                   </p>
                   <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{tpl.desc}</p>
                 </button>
               ))}
            </div>
          </div>

          {/* 3. VFX NỔ & TỤ NĂNG LƯỢNG */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">VFX & Hiệu Ứng Trình Chiếu</h2>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">Không gian nền (Background Theme)</label>
                <select value={backgroundType} onChange={(e) => setBackgroundType(e.target.value as any)} className="w-full bg-[#0E1217] border border-gray-700 rounded px-2 py-1.5 text-white">
                  <option value="particles">Particles (Bụi sao bay lơ lửng)</option>
                  <option value="starfield">Starfield (Vũ trụ không gian sâu)</option>
                  <option value="digital-network">Digital Network (Mạng lưới kỹ thuật số)</option>
                  <option value="matrix">Matrix Rain (Mưa Mã Code)</option>
                  <option value="nebula">Nebula (Tinh vân vũ trụ huyền ảo)</option>
                  <option value="quantum">Quantum Field (Trường lượng tử)</option>
                </select>
              </div>

              {/* EXPLOSION SELECTOR */}
              <div className="bg-[#0E1217] p-2.5 rounded border border-gray-800">
                 <div className="flex justify-between items-center mb-1.5">
                    <label className="text-gray-300 font-bold text-[11px]">Kiểu Nổ (Explosion VFX)</label>
                    <button onClick={handleTestExplosion} className="text-[10px] bg-red-900/60 text-red-300 hover:bg-red-800 px-2 py-0.5 rounded font-bold">▶ Thử Nổ</button>
                 </div>
                 <div className="flex gap-2">
                   <select value={explosionType} onChange={(e) => setExplosionType(e.target.value as any)} className="flex-1 bg-black border border-gray-700 rounded px-2 py-1.5 text-white">
                     <option value="cosmic-expansion">🌌 Nổ Vũ Trụ Mở Ra (Cosmic Expansion)</option>
                     <option value="vortex-spin">🌪️ Bão Xoáy Ngân Hà (Vortex Spin)</option>
                     <option value="supernova">💥 Siêu Tân Tinh Chói Lòa (Supernova)</option>
                     <option value="black-hole">🕳️ Lỗ Đen & Tia Gamma (Black Hole)</option>
                     <option value="cyber-ring">⚡ Vòng Ma Trận Cyber (Cyber Ring)</option>
                     <option value="golden-burst">✨ Hoàng Kim Rực Rỡ (Golden Burst)</option>
                     <option value="confetti">🎉 Pháo Hoa Kim Tuyến (Confetti)</option>
                     <option value="shockwave">💫 Sóng Xung Kích (Shockwave)</option>
                   </select>
                   <input type="color" value={explosionColor} onChange={(e) => setExplosionColor(e.target.value)} title="Màu nổ" className="w-8 h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
              </div>

              {/* ENERGY GATHERING SELECTOR */}
              <div className="bg-[#0E1217] p-2.5 rounded border border-gray-800">
                 <div className="flex justify-between items-center mb-1.5">
                    <label className="text-gray-300 font-bold text-[11px]">Tia Sáng Tụ Về Logo (Energy Gather)</label>
                    <button onClick={handleTestEnergy} className="text-[10px] bg-yellow-900/60 text-yellow-300 hover:bg-yellow-800 px-2 py-0.5 rounded font-bold">▶ Thử Bắn Tia</button>
                 </div>
                 <div className="flex gap-2">
                   <select value={energyType} onChange={(e) => setEnergyType(e.target.value as any)} className="flex-1 bg-black border border-gray-700 rounded px-2 py-1.5 text-white">
                     <option value="expert-convergence">✨ Tia Chuyên Gia Tụ Hội (Expert Streams)</option>
                     <option value="laser-matrix">⚡ Ma Trận Tia Laser (Laser Matrix)</option>
                     <option value="cosmic-vortex">🌌 Xoáy Tụ Vũ Trụ (Cosmic Vortex)</option>
                     <option value="golden-streams">🌟 Dòng Chảy Hoàng Kim (Golden Streams)</option>
                     <option value="spiral-charge">🌀 Xoắn Ốc Sạc Năng Lượng (Spiral Charge)</option>
                     <option value="spirit-bomb">🔮 Quả Cầu Năng Lượng (Spirit Bomb)</option>
                   </select>
                   <input type="color" value={trailColor} onChange={(e) => setTrailColor(e.target.value)} title="Màu tia sáng" className="w-8 h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
              </div>

              <div className="flex gap-2 pt-1">
                 <div className="w-1/2">
                    <label className="text-gray-400 mb-1 block">Màu nền sân khấu</label>
                    <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-full h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
                 <div className="w-1/2">
                    <label className="text-gray-400 mb-1 block">Màu tia năng lượng</label>
                    <input type="color" value={trailColor} onChange={(e) => setTrailColor(e.target.value)} className="w-full h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
              </div>
            </div>
          </div>

          {/* 4. QUẢN LÝ & XÓA / CHỈNH SỬA TỪNG LOGO */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Quản Lý & Xóa Sửa Logo Màn Kết</h2>
            <div className="space-y-3 text-xs">
               
               {/* CARD 1 (VIETKINGS) */}
               <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-300">Logo 1: Thẻ Vietkings (Góc Trái)</span>
                     <div className="flex gap-1.5">
                        <button 
                          onClick={() => store.setShowCardVietkings(!store.showCardVietkings)} 
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${store.showCardVietkings ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}
                        >
                          {store.showCardVietkings ? '👁️ HIỆN' : '🚫 ẨN'}
                        </button>
                        <button 
                          onClick={() => {
                            store.setShowCardVietkings(false);
                            setCustomLogo('customLogoFly1', null);
                          }}
                          className="text-[10px] bg-red-900/60 hover:bg-red-800 text-red-300 px-2 py-0.5 rounded"
                          title="Xóa logo này khỏi màn kết"
                        >
                          🗑️ XÓA
                        </button>
                     </div>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly1')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700 mb-2"/>
                  {store.showCardVietkings && (
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
                       <div>
                         <label className="text-[10px] text-gray-500">Tỉ lệ kích thước (Scale)</label>
                         <input type="range" min="0.3" max="2.5" step="0.1" value={store.finalCardVietkingsConfig.scale} onChange={(e) => store.updateCardConfig('vietkings', { scale: Number(e.target.value) })} className="w-full" />
                       </div>
                       <div>
                         <label className="text-[10px] text-gray-500">Góc nghiêng (°)</label>
                         <input type="range" min="-45" max="45" step="1" value={store.finalCardVietkingsConfig.rotate} onChange={(e) => store.updateCardConfig('vietkings', { rotate: Number(e.target.value) })} className="w-full" />
                       </div>
                    </div>
                  )}
               </div>

               {/* CARD 2 (GAB CARD) */}
               <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-300">Logo 2: Thẻ GAB (Góc Phải)</span>
                     <div className="flex gap-1.5">
                        <button 
                          onClick={() => store.setShowCardGAB(!store.showCardGAB)} 
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${store.showCardGAB ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}
                        >
                          {store.showCardGAB ? '👁️ HIỆN' : '🚫 ẨN'}
                        </button>
                        <button 
                          onClick={() => {
                            store.setShowCardGAB(false);
                            setCustomLogo('customLogoFly2', null);
                          }}
                          className="text-[10px] bg-red-900/60 hover:bg-red-800 text-red-300 px-2 py-0.5 rounded"
                          title="Xóa logo này khỏi màn kết"
                        >
                          🗑️ XÓA
                        </button>
                     </div>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly2')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700 mb-2"/>
                  {store.showCardGAB && (
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
                       <div>
                         <label className="text-[10px] text-gray-500">Tỉ lệ kích thước (Scale)</label>
                         <input type="range" min="0.3" max="2.5" step="0.1" value={store.finalCardGABConfig.scale} onChange={(e) => store.updateCardConfig('gab', { scale: Number(e.target.value) })} className="w-full" />
                       </div>
                       <div>
                         <label className="text-[10px] text-gray-500">Góc nghiêng (°)</label>
                         <input type="range" min="-45" max="45" step="1" value={store.finalCardGABConfig.rotate} onChange={(e) => store.updateCardConfig('gab', { rotate: Number(e.target.value) })} className="w-full" />
                       </div>
                    </div>
                  )}
               </div>

               {/* CENTER LOGO */}
               <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-300">Logo Trung Tâm (Logo GAB)</span>
                     <button 
                       onClick={() => store.setShowCenterLogoFinal(!store.showCenterLogoFinal)} 
                       className={`text-[10px] px-2 py-0.5 rounded font-bold ${store.showCenterLogoFinal ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}
                     >
                       {store.showCenterLogoFinal ? '👁️ HIỆN Ở MÀN KẾT' : '🚫 ẨN Ở MÀN KẾT'}
                     </button>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoCenter')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700"/>
               </div>

            </div>
          </div>

          {/* 5. CĂN CHỈNH VĂN BẢN MÀN KẾT */}
          <div className="p-4">
             <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Căn Chỉnh Nội Dung Màn Kết</h2>
             <div className="space-y-3 text-xs pb-10">
                <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <label className="text-gray-400 block mb-1">Dòng chữ 1 (Tiêu đề chính)</label>
                  <input type="text" value={layout.finalMessage.line1} onChange={(e) => updateLayout('finalMessage', { line1: e.target.value })} className="w-full bg-transparent border-b border-gray-700 focus:border-gab-cyan text-white pb-1 mb-3"/>
                  
                  <label className="text-gray-400 block mb-1">Dòng chữ 2 (Nội dung thông điệp)</label>
                  <input type="text" value={layout.finalMessage.line2} onChange={(e) => updateLayout('finalMessage', { line2: e.target.value })} className="w-full bg-transparent border-b border-gray-700 focus:border-gab-cyan text-white pb-1 mb-3"/>
                  
                  <div>
                     <label className="text-gray-500 text-[10px]">Tỉ lệ chữ (Scale)</label>
                     <input type="range" min="0.3" max="2.5" step="0.05" value={layout.finalMessage.scale} onChange={(e) => updateLayout('finalMessage', { scale: Number(e.target.value) })} className="w-full"/>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

