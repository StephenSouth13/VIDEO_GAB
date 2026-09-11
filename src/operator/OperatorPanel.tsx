import { useEventStore, EventPhase } from '../stores/useEventStore';
import { eventController } from '../core/EventController';
import { useState, useRef, useEffect } from 'react';
import { translations } from '../locales/translations';

export default function OperatorPanel() {
  const store = useEventStore();
  const { 
    language,
    setLanguage,
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
    customBackgroundVideo,
    setCustomBackgroundVideo,
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
    nodeShape,
    setNodeShape,
    allReadyDelay,
    setAllReadyDelay,
    savedProfiles, 
    saveProfile, 
    loadProfile, 
    deleteProfile 
  } = store;
  
  const t = translations[language || 'vi'];
  const [profileName, setProfileName] = useState('');
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewDim, setPreviewDim] = useState({ width: 640, height: 360, scale: 640 / 1920 });

  // Auto calculate scale for 1920x1080 virtual canvas in preview container via ResizeObserver
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;

    const calcSize = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth <= 0 || clientHeight <= 0) return;
      
      const padding = 24;
      const maxW = Math.max(300, clientWidth - padding);
      const maxH = Math.max(200, clientHeight - padding);

      let targetW = maxW;
      let targetH = targetW * (9 / 16);

      if (targetH > maxH) {
        targetH = maxH;
        targetW = targetH * (16 / 9);
      }

      setPreviewDim({
        width: Math.floor(targetW),
        height: Math.floor(targetH),
        scale: targetW / 1920
      });
    };

    calcSize();

    const observer = new ResizeObserver(() => {
      calcSize();
    });

    observer.observe(el);
    window.addEventListener('resize', calcSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calcSize);
    };
  }, []);

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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBackgroundVideo(reader.result as string);
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

  const setPresetTimeline = (seconds: number) => {
    if (seconds === 30) {
      updateTimeline('countdown', 6);
      updateTimeline('reveal', 3);
      updateTimeline('energy', 6);
      updateTimeline('counter', 9);
      updateTimeline('finalCharge', 3);
      updateTimeline('explosion', 3);
    } else if (seconds === 60) {
      updateTimeline('countdown', 10);
      updateTimeline('reveal', 6);
      updateTimeline('energy', 12);
      updateTimeline('counter', 20);
      updateTimeline('finalCharge', 6);
      updateTimeline('explosion', 6);
    }
  };

  const participantsArray = Object.values(participants);
  const confirmedCount = participantsArray.filter(p => p.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-[#0E1217] text-white flex flex-col font-sans h-screen select-none">
      {/* HEADER */}
      <header className="h-14 border-b border-gray-800 bg-[#151921] flex justify-between items-center px-4 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-sm md:text-xl font-bold text-white tracking-wide uppercase">
            STEPHENSOUTH-VN-<span className="text-gab-cyan">{t.brandSubtitle}</span>
          </h1>
          <span className="text-[10px] bg-cyan-950 text-gab-cyan border border-cyan-800 px-2 py-0.5 rounded font-mono hidden sm:inline">
            v7.0 LIVE SYNC
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* LANGUAGE SWITCHER */}
          <button 
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1217] hover:bg-gray-800 border border-gray-700 rounded text-xs font-bold transition"
            title="Đổi ngôn ngữ / Switch Language"
          >
            <span>{language === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}</span>
            <span className="text-gray-500 text-[10px]">⇄ {t.langSwitch}</span>
          </button>

          <button onClick={() => eventController.togglePause()} className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded transition ${isPaused ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {isPaused ? t.resume : t.pause}
          </button>
          <button onClick={() => eventController.toggleBlackout()} className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded transition ${isBlackout ? 'bg-red-600 shadow-lg shadow-red-600/30' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {isBlackout ? t.restoreLed : t.blackout}
          </button>
        </div>
      </header>

      {/* 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COLUMN - NODES & STATUS & TIMELINE CONFIG */}
        <div className="w-full lg:w-[320px] border-r border-gray-800 bg-[#151921] flex flex-col shrink-0 overflow-y-auto max-h-[35vh] lg:max-h-full">
          
          {/* EVENT STATUS */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">{t.eventStatus}</h2>
            <div className="bg-[#0E1217] rounded-lg p-3 mb-3 border border-gray-800 flex justify-between items-center shadow-inner">
              <div>
                <p className="text-[11px] text-gray-400">{t.currentPhase}</p>
                <p className="text-sm font-mono font-bold text-gab-cyan-light">{phase}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400">{t.ready}</p>
                <p className="text-xl font-bold font-mono">{confirmedCount} <span className="text-gray-500 text-xs">/ {requiredParticipants}</span></p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleActivateAll} className="py-2 bg-gab-cyan-light text-black text-xs font-bold rounded hover:opacity-90 shadow">{t.activateAll}</button>
              <button onClick={() => eventController.runDemo()} className="py-2 bg-yellow-500 text-black text-xs font-bold rounded hover:opacity-90 shadow">{t.autoDemo}</button>
              <button onClick={handleReset} className="py-2 border border-red-500 text-red-500 text-xs font-bold rounded hover:bg-red-500 hover:text-white col-span-2 transition">{t.resetEvent}</button>
            </div>
          </div>

          {/* PARTICIPANT NODES */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.nodes}</h2>
              <div className="flex items-center gap-2">
                 <button onClick={() => setShowNodes(!showNodes)} className={`text-[10px] px-2 py-0.5 rounded font-bold ${showNodes ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}>
                    {showNodes ? t.hide : t.show}
                 </button>
                 <input type="number" min="8" max="15" value={requiredParticipants} onChange={(e) => setRequiredParticipants(Number(e.target.value))} className="w-10 bg-[#0E1217] border border-gray-700 text-xs px-1 py-1 rounded text-center" title="Số lượng người tham gia"/>
              </div>
            </div>

            {/* NODE SHAPE SELECTOR (10 SHAPES) */}
            <div className="mb-3">
              <label className="text-[10px] text-gray-400 font-medium block mb-1">{t.nodeShape}</label>
              <select 
                value={nodeShape} 
                onChange={(e) => setNodeShape(e.target.value as any)} 
                className="w-full bg-[#0E1217] border border-gray-700 text-xs text-gab-cyan-light rounded px-2 py-1.5 focus:border-gab-cyan"
              >
                <option value="rectangle">📱 {t.shapeRectangle}</option>
                <option value="circle">⚪ {t.shapeCircle}</option>
                <option value="hand">✋ {t.shapeHand}</option>
                <option value="card">💳 {t.shapeCard}</option>
                <option value="diamond">💎 {t.shapeDiamond}</option>
                <option value="hexagon">🔷 {t.shapeHexagon}</option>
                <option value="shield">🛡️ {t.shapeShield}</option>
                <option value="star">⭐ {t.shapeStar}</option>
                <option value="cylinder">🏛️ {t.shapeCylinder}</option>
                <option value="ring">⭕ {t.shapeRing}</option>
              </select>
            </div>

            {/* ALL-READY TO COUNTDOWN DELAY SETTING */}
            <div className="mb-3 bg-[#0E1217] p-2 rounded border border-gray-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-gray-400" title={t.readyDelayHint}>{t.readyDelayLabel}</span>
                <span className="text-[11px] font-mono font-bold text-yellow-400">{allReadyDelay}s</span>
              </div>
              <input 
                type="range" min="0" max="5" step="0.5" 
                value={allReadyDelay} 
                onChange={(e) => setAllReadyDelay(Number(e.target.value))} 
                className="w-full accent-yellow-400 cursor-pointer h-1.5 bg-gray-700 rounded" 
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto">
              {participantsArray.map(p => (
                <div key={p.id} className={`p-1.5 rounded text-center border text-xs flex justify-between items-center ${p.status === 'CONFIRMED' ? 'bg-gab-cyan/20 border-gab-cyan text-white' : 'bg-[#0E1217] border-gray-800 text-gray-400'}`}>
                  <span className="font-mono text-gray-400 w-4">{p.id}</span>
                  <input type="text" value={p.name} onChange={(e) => updateParticipant(p.id, { name: e.target.value })} className="w-16 bg-transparent border-b border-transparent focus:border-gray-500 text-center text-white" placeholder="Name"/>
                  <button onClick={() => handleConfirm(p.id)} disabled={p.status === 'CONFIRMED'} className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gab-cyan disabled:opacity-50 disabled:hover:bg-gray-700" title="Chạm tay"></button>
                </div>
              ))}
            </div>
          </div>

          {/* TIMELINE DURATION SETTINGS (UP TO 60s / 1 MIN) */}
          <div className="p-4">
             <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.timelineDuration}</h2>
                <span className="text-[10px] font-mono text-gab-cyan">{totalDuration.toFixed(1)}s</span>
             </div>

             <div className="flex gap-1.5 mb-3">
                <button onClick={() => setPresetTimeline(30)} className="flex-1 py-1 bg-[#0E1217] hover:bg-gray-800 border border-gray-700 text-[10px] font-bold rounded">
                   30s Preset
                </button>
                <button onClick={() => setPresetTimeline(60)} className="flex-1 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-[10px] text-gab-cyan font-bold rounded">
                   60s (1 Phút)
                </button>
             </div>

             <div className="space-y-2 text-xs">
                {[
                  { key: 'countdown', label: t.phaseCountdown },
                  { key: 'reveal', label: t.phaseReveal },
                  { key: 'energy', label: t.phaseEnergy },
                  { key: 'counter', label: t.phaseCounter },
                  { key: 'finalCharge', label: t.phaseFinalCharge },
                  { key: 'explosion', label: t.phaseExplosion }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{item.label}</span>
                    <input 
                      type="number" min="0" max="60" step="0.5" 
                      value={timelineConfig[item.key as keyof typeof timelineConfig]} 
                      onChange={(e) => updateTimeline(item.key as keyof typeof timelineConfig, Math.max(0, Number(e.target.value)))} 
                      className="w-16 bg-[#0E1217] border border-gray-700 rounded px-2 py-1 text-xs text-right font-mono" 
                    />
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* CENTER COLUMN - PIXEL-PERFECT 1920x1080 PREVIEW & MASTER SCRUBBER */}
        <div className="flex-1 flex flex-col bg-[#080A0E] relative overflow-hidden min-h-[40vh] lg:min-h-full">
           
           {/* 1920x1080 Virtual Canvas Scaled Container */}
           <div ref={previewContainerRef} className="flex-1 p-2 md:p-4 flex items-center justify-center relative w-full h-full overflow-hidden">
              <div 
                className="bg-black rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden group flex justify-center items-center transition-all"
                style={{
                  width: `${previewDim.width}px`,
                  height: `${previewDim.height}px`,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                 {/* 1920x1080 Iframe scaled smoothly to guarantee 1:1 match with LED */}
                 <div 
                   className="absolute origin-top-left"
                   style={{
                     width: '1920px',
                     height: '1080px',
                     transform: `scale(${previewDim.scale})`,
                     transformOrigin: '0 0'
                   }}
                 >
                   <iframe src="/led?edit=true" className="w-full h-full border-0 pointer-events-auto" />
                 </div>
                 
                 <div className="absolute top-2 left-2 bg-gab-cyan/90 text-[10px] text-black font-bold px-2 py-1 rounded backdrop-blur z-30 shadow">
                   {t.livePreview}
                 </div>

                 <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition z-30">
                   <button onClick={handleTestEnergy} className="bg-yellow-500/90 hover:bg-yellow-400 text-black font-bold text-[10px] px-2 py-1 rounded shadow">
                     {t.btnTestEnergy}
                   </button>
                   <button onClick={handleTestExplosion} className="bg-red-600/90 hover:bg-red-500 text-white font-bold text-[10px] px-2 py-1 rounded shadow">
                     {t.btnTestExplosion}
                   </button>
                   <button onClick={handleTestFinalScreen} className="bg-cyan-600/90 hover:bg-cyan-500 text-white font-bold text-[10px] px-2 py-1 rounded shadow">
                     {t.btnTestFinal}
                   </button>
                   <button onClick={() => window.open('/led', '_blank')} className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded shadow">
                     {t.popOut}
                   </button>
                 </div>
              </div>
           </div>

           {/* MASTER SCRUBBER & DRAG HINT */}
           <div className="h-20 md:h-24 bg-[#151921] border-t border-gray-800 p-4 shrink-0 flex flex-col justify-center">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                 <span>0.0s ({t.start})</span>
                 <span className="font-mono text-gab-cyan-light font-bold text-sm">{globalTime.toFixed(1)}s / {totalDuration.toFixed(1)}s</span>
                 <span>{totalDuration.toFixed(1)}s ({t.ending})</span>
              </div>
              <input 
                 type="range" min="0" max={totalDuration} step="0.1" 
                 value={globalTime} 
                 onMouseDown={() => setScrubbing(true)} onMouseUp={() => setScrubbing(false)}
                 onTouchStart={() => setScrubbing(true)} onTouchEnd={() => setScrubbing(false)}
                 onChange={(e) => setGlobalTime(Number(e.target.value))} 
                 className="w-full accent-gab-cyan cursor-pointer"
              />
              <p className="text-[10px] text-gray-500 mt-1 truncate">{t.dragPausedHint}</p>
           </div>
        </div>

        {/* RIGHT COLUMN - PROPERTIES, PRESETS & ASSETS */}
        <div className="w-full lg:w-[390px] border-l border-gray-800 bg-[#151921] flex flex-col shrink-0 overflow-y-auto max-h-[50vh] lg:max-h-full">
          
          {/* 1. SCENARIO VERSION MANAGER */}
          <div className="p-4 border-b border-gray-800 bg-gray-900">
             <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex justify-between">
               {t.scenarioManager}
               <span className="text-[9px] text-gab-cyan border border-gab-cyan px-1 rounded">PRO</span>
             </h2>
             <div className="flex gap-2 mb-2">
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder={t.scenarioNamePlaceholder} className="flex-1 bg-[#0E1217] border border-gray-700 text-xs px-2 py-1 rounded text-white"/>
                <button onClick={handleSaveProfile} className="bg-gab-cyan-light text-black text-xs font-bold px-3 py-1 rounded hover:opacity-90">{t.btnSave}</button>
             </div>
              {Object.keys(savedProfiles).length > 0 && (
                <div className="space-y-1.5 mt-2">
                   {Object.keys(savedProfiles).map(name => (
                     <div key={name} className="flex justify-between items-center bg-[#0E1217] border border-gray-800 px-2 py-1 rounded text-xs">
                        <span className="truncate max-w-[190px] text-gray-300 font-mono">{name}</span>
                        <div className="flex gap-1">
                          <button onClick={() => loadProfile(name)} className="px-2 py-0.5 bg-gab-cyan/20 text-gab-cyan text-[10px] rounded hover:bg-gab-cyan hover:text-black font-bold">{t.btnLoad}</button>
                          <button onClick={() => deleteProfile(name)} className="px-1.5 py-0.5 text-red-400 hover:text-red-200 text-[10px] rounded" title="Delete">✕</button>
                        </div>
                     </div>
                   ))}
                </div>
              )}
          </div>

          {/* 2. MẪU MÀN HÌNH LÚC KẾT (ENDING TEMPLATES) */}
          <div className="p-4 border-b border-gray-800 bg-gradient-to-b from-[#181d26] to-[#151921]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>✦</span> {t.endingTemplates}
              </h2>
              <button onClick={handleTestFinalScreen} className="text-[10px] bg-cyan-900/50 text-cyan-300 hover:text-cyan-200 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                {t.viewEnding}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
               {[
                 { id: 'dual-cards', label: t.tplDualCards, desc: t.tplDualCardsDesc },
                 { id: 'center-hero', label: t.tplCenterHero, desc: t.tplCenterHeroDesc },
                 { id: 'top-sponsors', label: t.tplTopSponsors, desc: t.tplTopSponsorsDesc },
                 { id: 'cyber-hologram', label: t.tplCyberHologram, desc: t.tplCyberHologramDesc },
                 { id: 'golden-prestige', label: t.tplGoldenPrestige, desc: t.tplGoldenPrestigeDesc },
                 { id: 'minimal-clean', label: t.tplMinimalClean, desc: t.tplMinimalCleanDesc }
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

          {/* 3. VFX NỔ, TỤ NĂNG LƯỢNG & VIDEO BACKGROUND */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t.vfxEnvironment}</h2>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">{t.bgTheme}</label>
                <select value={backgroundType} onChange={(e) => setBackgroundType(e.target.value as any)} className="w-full bg-[#0E1217] border border-gray-700 rounded px-2 py-1.5 text-white">
                  <option value="particles">{t.bgParticles}</option>
                  <option value="starfield">{t.bgStarfield}</option>
                  <option value="digital-network">{t.bgDigitalNetwork}</option>
                  <option value="matrix">{t.bgMatrix}</option>
                  <option value="nebula">{t.bgNebula}</option>
                  <option value="quantum">{t.bgQuantum}</option>
                </select>
              </div>

              {/* VIDEO BACKGROUND EMBED */}
              <div className="bg-[#0E1217] p-2.5 rounded border border-gray-800">
                 <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-300 font-bold text-[11px]">{t.videoBg}</label>
                    {customBackgroundVideo && (
                      <button onClick={() => setCustomBackgroundVideo(null)} className="text-[10px] text-red-400 hover:underline">Reset</button>
                    )}
                 </div>
                 <input 
                   type="text" 
                   value={customBackgroundVideo || ''} 
                   onChange={(e) => setCustomBackgroundVideo(e.target.value || null)} 
                   placeholder={t.videoUrlPlaceholder} 
                   className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-white text-[11px] mb-2 font-mono" 
                 />
                 <input 
                   type="file" 
                   accept="video/*" 
                   onChange={handleVideoUpload} 
                   className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700" 
                 />
              </div>

              {/* EXPLOSION SELECTOR */}
              <div className="bg-[#0E1217] p-2.5 rounded border border-gray-800">
                 <div className="flex justify-between items-center mb-1.5">
                    <label className="text-gray-300 font-bold text-[11px]">{t.explosionVfx}</label>
                    <button onClick={handleTestExplosion} className="text-[10px] bg-red-900/60 text-red-300 hover:bg-red-800 px-2 py-0.5 rounded font-bold">{t.testExplosion}</button>
                 </div>
                 <div className="flex gap-2">
                   <select value={explosionType} onChange={(e) => setExplosionType(e.target.value as any)} className="flex-1 bg-black border border-gray-700 rounded px-2 py-1.5 text-white">
                     <option value="cosmic-expansion">{t.expCosmic}</option>
                     <option value="vortex-spin">{t.expVortex}</option>
                     <option value="supernova">{t.expSupernova}</option>
                     <option value="black-hole">{t.expBlackHole}</option>
                     <option value="cyber-ring">{t.expCyberRing}</option>
                     <option value="golden-burst">{t.expGoldenBurst}</option>
                     <option value="confetti">{t.expConfetti}</option>
                     <option value="shockwave">{t.expShockwave}</option>
                   </select>
                   <input type="color" value={explosionColor} onChange={(e) => setExplosionColor(e.target.value)} title="Color" className="w-8 h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
              </div>

              {/* ENERGY GATHERING SELECTOR */}
              <div className="bg-[#0E1217] p-2.5 rounded border border-gray-800">
                 <div className="flex justify-between items-center mb-1.5">
                    <label className="text-gray-300 font-bold text-[11px]">{t.energyGathering}</label>
                    <button onClick={handleTestEnergy} className="text-[10px] bg-yellow-900/60 text-yellow-300 hover:bg-yellow-800 px-2 py-0.5 rounded font-bold">{t.testEnergy}</button>
                 </div>
                 <div className="flex gap-2">
                   <select value={energyType} onChange={(e) => setEnergyType(e.target.value as any)} className="flex-1 bg-black border border-gray-700 rounded px-2 py-1.5 text-white">
                     <option value="expert-convergence">{t.engExpert}</option>
                     <option value="laser-matrix">{t.engLaser}</option>
                     <option value="cosmic-vortex">{t.engCosmic}</option>
                     <option value="golden-streams">{t.engGolden}</option>
                     <option value="spiral-charge">{t.engSpiral}</option>
                     <option value="spirit-bomb">{t.engSpiritBomb}</option>
                   </select>
                   <input type="color" value={trailColor} onChange={(e) => setTrailColor(e.target.value)} title="Color" className="w-8 h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
              </div>

              <div className="flex gap-2 pt-1">
                 <div className="w-1/2">
                    <label className="text-gray-400 mb-1 block">{t.bgColor}</label>
                    <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-full h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
                 <div className="w-1/2">
                    <label className="text-gray-400 mb-1 block">{t.energyColor}</label>
                    <input type="color" value={trailColor} onChange={(e) => setTrailColor(e.target.value)} className="w-full h-8 rounded bg-transparent cursor-pointer border border-gray-700" />
                 </div>
              </div>
            </div>
          </div>

          {/* 4. QUẢN LÝ & XÓA / CHỈNH SỬA TỪNG LOGO */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.assetManager}</h2>
            <div className="space-y-3 text-xs">
               
               {/* CARD 1 (VIETKINGS) */}
               <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-300">{t.card1Title}</span>
                     <div className="flex gap-1.5">
                        <button 
                          onClick={() => store.setShowCardVietkings(!store.showCardVietkings)} 
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${store.showCardVietkings ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}
                        >
                          {store.showCardVietkings ? t.btnShow : t.btnHide}
                        </button>
                        <button 
                          onClick={() => {
                            store.setShowCardVietkings(false);
                            setCustomLogo('customLogoFly1', null);
                          }}
                          className="text-[10px] bg-red-900/60 hover:bg-red-800 text-red-300 px-2 py-0.5 rounded"
                          title="Delete"
                        >
                          {t.btnDeleteLogo}
                        </button>
                     </div>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly1')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700 mb-2"/>
                  {store.showCardVietkings && (
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
                       <div>
                         <label className="text-[10px] text-gray-500">{t.scaleSlider}</label>
                         <input type="range" min="0.3" max="2.5" step="0.1" value={store.finalCardVietkingsConfig.scale} onChange={(e) => store.updateCardConfig('vietkings', { scale: Number(e.target.value) })} className="w-full" />
                       </div>
                       <div>
                         <label className="text-[10px] text-gray-500">{t.rotateSlider}</label>
                         <input type="range" min="-45" max="45" step="1" value={store.finalCardVietkingsConfig.rotate} onChange={(e) => store.updateCardConfig('vietkings', { rotate: Number(e.target.value) })} className="w-full" />
                       </div>
                    </div>
                  )}
               </div>

               {/* CARD 2 (GAB CARD) */}
               <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-300">{t.card2Title}</span>
                     <div className="flex gap-1.5">
                        <button 
                          onClick={() => store.setShowCardGAB(!store.showCardGAB)} 
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${store.showCardGAB ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}
                        >
                          {store.showCardGAB ? t.btnShow : t.btnHide}
                        </button>
                        <button 
                          onClick={() => {
                            store.setShowCardGAB(false);
                            setCustomLogo('customLogoFly2', null);
                          }}
                          className="text-[10px] bg-red-900/60 hover:bg-red-800 text-red-300 px-2 py-0.5 rounded"
                          title="Delete"
                        >
                          {t.btnDeleteLogo}
                        </button>
                     </div>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly2')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700 mb-2"/>
                  {store.showCardGAB && (
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
                       <div>
                         <label className="text-[10px] text-gray-500">{t.scaleSlider}</label>
                         <input type="range" min="0.3" max="2.5" step="0.1" value={store.finalCardGABConfig.scale} onChange={(e) => store.updateCardConfig('gab', { scale: Number(e.target.value) })} className="w-full" />
                       </div>
                       <div>
                         <label className="text-[10px] text-gray-500">{t.rotateSlider}</label>
                         <input type="range" min="-45" max="45" step="1" value={store.finalCardGABConfig.rotate} onChange={(e) => store.updateCardConfig('gab', { rotate: Number(e.target.value) })} className="w-full" />
                       </div>
                    </div>
                  )}
               </div>

               {/* CENTER LOGO */}
               <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-300">{t.centerLogoTitle}</span>
                     <button 
                       onClick={() => store.setShowCenterLogoFinal(!store.showCenterLogoFinal)} 
                       className={`text-[10px] px-2 py-0.5 rounded font-bold ${store.showCenterLogoFinal ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-400'}`}
                     >
                       {store.showCenterLogoFinal ? t.btnShowEnding : t.btnHideEnding}
                     </button>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoCenter')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700"/>
               </div>

            </div>
          </div>

          {/* 5. CĂN CHỈNH VĂN BẢN MÀN KẾT */}
          <div className="p-4">
             <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.finalInspector}</h2>
             <div className="space-y-3 text-xs pb-10">
                <div className="bg-[#0E1217] p-3 rounded-lg border border-gray-800">
                  <label className="text-gray-400 block mb-1">{t.line1Label}</label>
                  <input type="text" value={layout.finalMessage.line1} onChange={(e) => updateLayout('finalMessage', { line1: e.target.value })} className="w-full bg-transparent border-b border-gray-700 focus:border-gab-cyan text-white pb-1 mb-3"/>
                  
                  <label className="text-gray-400 block mb-1">{t.line2Label}</label>
                  <input type="text" value={layout.finalMessage.line2} onChange={(e) => updateLayout('finalMessage', { line2: e.target.value })} className="w-full bg-transparent border-b border-gray-700 focus:border-gab-cyan text-white pb-1 mb-3"/>
                  
                  <div>
                     <label className="text-gray-500 text-[10px]">{t.textSize}</label>
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
