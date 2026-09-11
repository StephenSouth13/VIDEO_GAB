import { useEventStore, EventPhase } from '../stores/useEventStore';
import { eventController } from '../core/EventController';
import { useState, useRef, useEffect } from 'react';
import { translations } from '../locales/translations';
import { audioManager } from '../audio/AudioManager';

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
    backgroundVideoOpacity,
    setBackgroundVideoOpacity,
    backgroundVideoFit,
    setBackgroundVideoFit,
    backgroundVideoPlaybackRate,
    setBackgroundVideoPlaybackRate,
    backgroundVideoPaused,
    setBackgroundVideoPaused,
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
    nodeGlowStyle,
    setNodeGlowStyle,
    allReadyDelay,
    setAllReadyDelay,
    devicePreset,
    setDevicePreset,
    stageWidth,
    stageHeight,
    setStageSize,
    stageFit,
    setStageFit,
    stageOverscan,
    setStageOverscan,
    autoDirectorPreset,
    setAutoDirectorPreset,
    touchAutomationMode,
    setTouchAutomationMode,
    touchAutomationSpeed,
    setTouchAutomationSpeed,
    savedProfiles, 
    saveProfile, 
    loadProfile, 
    deleteProfile,
    scenarioNames,
    setScenarioName,
    audioEnabled,
    audioVolume,
    setAudioEnabled,
    setAudioVolume
  } = store;
  
  const t = translations[language || 'vi'];
  const [profileName, setProfileName] = useState('');
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewDim, setPreviewDim] = useState({ width: 640, height: 360, scale: 640 / 1920 });

  // Auto calculate scale for the configured virtual canvas in preview container via ResizeObserver
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;

    const calcSize = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth <= 0 || clientHeight <= 0) return;
      
      const padding = 24;
      const maxW = Math.max(300, clientWidth - padding);
      const maxH = Math.max(200, clientHeight - padding);
      const safeStageWidth = Math.max(1, stageWidth || 1920);
      const safeStageHeight = Math.max(1, stageHeight || 1080);
      const aspect = safeStageHeight / safeStageWidth;

      let targetW = maxW;
      let targetH = targetW * aspect;

      if (targetH > maxH) {
        targetH = maxH;
        targetW = targetH / aspect;
      }

      setPreviewDim({
        width: Math.floor(targetW),
        height: Math.floor(targetH),
        scale: targetW / safeStageWidth
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
  }, [stageWidth, stageHeight]);

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
    eventController.jumpToPhase(EventPhase.SUCCESS);
  };

  const applyAutoDirectorPreset = (preset: typeof autoDirectorPreset) => {
    setAutoDirectorPreset(preset);

    if (preset === 'premium-led') {
      setBackgroundType('aurora');
      setEnergyType('ribbon-weave');
      setExplosionType('aurora-flare');
      setTrailColor('#00F0FF');
      setExplosionColor('#FACC15');
      setBackgroundColor('#020617');
      setNodeGlowStyle('energy');
      setNodeShape('hand');
      setDevicePreset('led-fhd');
      setStageFit('fill');
      setStageOverscan(0);
      updateTimeline('countdown', 8);
      updateTimeline('reveal', 4);
      updateTimeline('energy', 10);
      updateTimeline('counter', 14);
      updateTimeline('finalCharge', 4);
      updateTimeline('explosion', 4);
    } else if (preset === 'high-energy') {
      setBackgroundType('light-tunnel');
      setEnergyType('heartbeat-pulse');
      setExplosionType('radial-strobe');
      setTrailColor('#FACC15');
      setExplosionColor('#00F0FF');
      setBackgroundColor('#030712');
      setNodeGlowStyle('blinding');
      setNodeShape('ring');
      setDevicePreset('led-fhd');
      setStageFit('cover');
      setStageOverscan(1.5);
      updateTimeline('countdown', 5);
      updateTimeline('reveal', 3);
      updateTimeline('energy', 7);
      updateTimeline('counter', 8);
      updateTimeline('finalCharge', 2);
      updateTimeline('explosion', 3);
    } else if (preset === 'ceremony') {
      setBackgroundType('prism');
      setEnergyType('orbital-rings');
      setExplosionType('golden-burst');
      setTrailColor('#FDE68A');
      setExplosionColor('#FACC15');
      setBackgroundColor('#09090B');
      setNodeGlowStyle('plasma');
      setNodeShape('shield');
      setDevicePreset('led-fhd');
      setStageFit('fill');
      setStageOverscan(0);
      updateTimeline('countdown', 10);
      updateTimeline('reveal', 6);
      updateTimeline('energy', 12);
      updateTimeline('counter', 18);
      updateTimeline('finalCharge', 5);
      updateTimeline('explosion', 5);
    } else if (preset === 'touch-fast') {
      setBackgroundType('scanlines');
      setEnergyType('rain-up');
      setExplosionType('data-burst');
      setTrailColor('#22D3EE');
      setExplosionColor('#38BDF8');
      setBackgroundColor('#000000');
      setNodeGlowStyle('neon');
      setNodeShape('hand');
      setDevicePreset('led-fhd');
      setStageFit('fill');
      setTouchAutomationMode('burst');
      setTouchAutomationSpeed(0.22);
      updateTimeline('countdown', 4);
      updateTimeline('reveal', 2);
      updateTimeline('energy', 5);
      updateTimeline('counter', 7);
      updateTimeline('finalCharge', 2);
      updateTimeline('explosion', 3);
    }
  };
  
  const handleSaveProfile = () => {
    if (profileName.trim()) {
      saveProfile(profileName.trim());
      setProfileName('');
    }
  };

  const applyBundledLogos = () => {
    setCustomLogo('customLogoCenter', '/logo/GAB.png');
    setCustomLogo('customLogoFly1', '/logo/vietkings.webp');
    setCustomLogo('customLogoFly2', '/logo/GAB.png');
    store.setShowCardVietkings(true);
    store.setShowCardGAB(true);
    store.setShowCenterLogoFinal(true);
  };

  const runFullLogoTest = () => {
    applyBundledLogos();
    store.setFinalTemplate('center-hero');
    setShowNodes(true);
    setStageFit('fill');
    setStageOverscan(0);
    setBackgroundVideoPaused(false);
    eventController.runDemo();
  };

  const hardResetLocalConfig = () => {
    window.localStorage.removeItem('gab-event-storage');
    window.location.reload();
  };

  const unlockAndTestAudio = async () => {
    await audioManager.unlock();
    audioManager.setMute(!audioEnabled);
    audioManager.setVolume(audioVolume);
    audioManager.play('ready');
  };

  const applyScenario1Ceremony = () => {
    applyBundledLogos();
    store.resetLayout();
    store.setFinalTemplate('center-hero');
    store.setShowCenterLogoFinal(true);
    store.updateCardConfig('vietkings', { scale: 0.95, rotate: -8 });
    store.updateCardConfig('gab', { scale: 0.95, rotate: 8 });
    updateLayout('finalMessage', {
      line1: 'CHUC MUNG CAC KY LUC GIA',
      line2: 'DA KICH HOAT THE GAB THANH CONG',
      x: 0,
      y: -50,
      scale: 1
    });
    updateLayout('logo', { x: 0, y: -45, scale: 1 });
    updateLayout('counter', { x: 0, y: -25, scale: 1 });
    updateLayout('cardVietkings', { endX: -520, endY: -210, scale: 1 });
    updateLayout('cardGAB', { endX: 520, endY: 185, scale: 1 });
    setStageSize(3840, 1355);
    setStageFit('fill');
    setStageOverscan(0);
    setBackgroundColor('#030712');
    setBackgroundType('digital-network');
    setEnergyType('expert-convergence');
    setExplosionType('cosmic-expansion');
    setTrailColor('#FACC15');
    setExplosionColor('#00F0FF');
    setNodeShape('hand');
    setNodeGlowStyle('energy');
    setCustomBackgroundVideo(null);
    setBackgroundVideoPaused(false);
    updateTimeline('countdown', 5);
    updateTimeline('reveal', 3);
    updateTimeline('energy', 6.5);
    updateTimeline('counter', 7.5);
    updateTimeline('finalCharge', 2);
    updateTimeline('explosion', 2);
    setShowNodes(true);
    setGlobalTime(0);
    useEventStore.setState({ phase: EventPhase.IDLE });
  };

  const runScenario1Ceremony = () => {
    applyScenario1Ceremony();
    eventController.runDemo();
  };

  const applyScenarioVideoShow = () => {
    applyScenario1Ceremony();
    setBackgroundType('aurora');
    setEnergyType('ribbon-weave');
    setExplosionType('aurora-flare');
    setCustomBackgroundVideo('/video-demo/0328(1).mp4');
    setBackgroundVideoOpacity(0.32);
    setBackgroundVideoFit('cover');
  };

  const applyScenarioPlaceCard = () => {
    applyScenario1Ceremony();
    store.setFinalTemplate('dual-cards');
    setBackgroundType('prism');
    setEnergyType('orbital-rings');
    setExplosionType('golden-burst');
    setCustomBackgroundVideo('/video-demo/Visual_PlaceCard.mp4');
    setBackgroundVideoOpacity(0.28);
    setBackgroundVideoFit('cover');
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
  const scenarioItems = [
    { key: 'ceremony' as const, apply: applyScenario1Ceremony, run: runScenario1Ceremony, desc: t.scenario1Desc },
    { key: 'videoEnergy' as const, apply: applyScenarioVideoShow, run: undefined, desc: t.scenario2Desc },
    { key: 'placeCard' as const, apply: applyScenarioPlaceCard, run: undefined, desc: t.scenario3Desc }
  ];

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
              <button onClick={runFullLogoTest} className="py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 shadow col-span-2">{t.fullLogoTest}</button>
              <button onClick={() => store.resetLayout()} className="py-2 bg-cyan-950/70 border border-cyan-700 text-gab-cyan text-xs font-bold rounded hover:bg-cyan-900 shadow col-span-2">{t.resetLayoutPositions}</button>
              <button onClick={hardResetLocalConfig} className="py-2 border border-orange-500 text-orange-300 text-xs font-bold rounded hover:bg-orange-500 hover:text-black col-span-2 transition">{t.hardResetLocalConfig}</button>
              <button onClick={handleReset} className="py-2 border border-red-500 text-red-500 text-xs font-bold rounded hover:bg-red-500 hover:text-white col-span-2 transition">{t.resetEvent}</button>
            </div>

            <div className="mt-3 bg-black/40 border border-yellow-700/50 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-bold text-yellow-300 uppercase">{t.scenarioLibraryReady}</h3>
                <span className="text-[9px] text-gray-500">{t.scenarioLoadRun}</span>
              </div>
              <p className="text-[9px] text-yellow-100/70 leading-tight mb-2">{t.scenarioLibraryHint}</p>
              <div className="space-y-1.5">
                {scenarioItems.map((item, index) => (
                  <div key={item.key} className="grid grid-cols-[1fr_auto_auto] gap-1.5 items-center">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">{index + 1}. {scenarioNames[item.key]}</p>
                      <p className="text-[9px] text-gray-500 truncate">{item.desc}</p>
                    </div>
                    <button onClick={item.apply} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-[10px] font-bold">{t.btnSetupScenario}</button>
                    <button onClick={item.run || (() => { item.apply(); eventController.runDemo(); })} className="px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-300 text-black text-[10px] font-bold">{t.btnRunScenario}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 bg-[#0E1217] border border-cyan-900/70 rounded-lg p-2.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-[11px] font-bold text-gab-cyan uppercase">{t.audioCueSystem}</h3>
                <button onClick={() => setAudioEnabled(!audioEnabled)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${audioEnabled ? 'bg-gab-cyan text-black' : 'bg-gray-700 text-gray-300'}`}>
                  {audioEnabled ? t.audioOn : t.audioOff}
                </button>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                <label className="block">
                  <span className="text-[9px] text-gray-500">{t.audioVolume} {Math.round(audioVolume * 100)}%</span>
                  <input type="range" min="0" max="1" step="0.01" value={audioVolume} onChange={(e) => setAudioVolume(Number(e.target.value))} className="w-full accent-gab-cyan" />
                </label>
                <button onClick={unlockAndTestAudio} className="px-2 py-1.5 rounded bg-cyan-950/80 border border-cyan-800 text-gab-cyan text-[10px] font-bold hover:bg-cyan-900">
                  {t.audioTest}
                </button>
              </div>
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

            <div className="mb-3">
              <label className="text-[10px] text-gray-400 font-medium block mb-1">Kiểu phát sáng node</label>
              <select 
                value={nodeGlowStyle} 
                onChange={(e) => setNodeGlowStyle(e.target.value as typeof nodeGlowStyle)} 
                className="w-full bg-[#0E1217] border border-gray-700 text-xs text-gab-cyan-light rounded px-2 py-1.5 focus:border-gab-cyan"
              >
                <option value="energy">Energy Cyan - sáng điện</option>
                <option value="blinding">Blinding White - sáng lóa</option>
                <option value="neon">Neon Magenta - cyber</option>
                <option value="plasma">Plasma Gold - nóng mạnh</option>
                <option value="halo">Halo Green - hào quang</option>
                <option value="classic">Classic Yellow - vàng gốc</option>
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
                   className="absolute left-0 top-0 origin-top-left"
                   style={{
                     width: `${stageWidth || 1920}px`,
                     height: `${stageHeight || 1080}px`,
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
          <div className="p-4 border-b border-gray-800 bg-[#10151d]">
             <div className="flex items-center justify-between mb-3">
               <h2 className="text-xs font-bold text-gab-cyan uppercase tracking-wider">{t.ledSyncTitle}</h2>
               <span className="text-[9px] text-gray-400 border border-gray-700 px-1.5 py-0.5 rounded">{t.previewEqualsLed}</span>
             </div>

             <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                {[
                  { id: 'premium-led', label: 'Premium LED', desc: 'Aurora + ribbon + flare' },
                  { id: 'high-energy', label: 'High Energy', desc: 'Tunnel + strobe nhanh' },
                  { id: 'ceremony', label: 'Ceremony', desc: 'Trang trong, cham sang' },
                  { id: 'touch-fast', label: 'Touch Fast', desc: 'Cam ung tu dong nhanh' }
                ].map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => applyAutoDirectorPreset(preset.id as typeof autoDirectorPreset)}
                    className={`p-2 rounded border text-left transition ${autoDirectorPreset === preset.id ? 'bg-gab-cyan/20 border-gab-cyan text-white shadow-lg' : 'bg-[#0E1217] border-gray-800 text-gray-400 hover:border-gray-600'}`}
                  >
                    <p className="text-[11px] font-bold text-white">{preset.label}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">{preset.desc}</p>
                  </button>
                ))}
             </div>

             <div className="bg-black/40 border border-yellow-700/50 rounded p-2.5 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-bold text-yellow-300 uppercase">{t.scenarioLibraryEditable}</h3>
                  <button onClick={runScenario1Ceremony} className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded font-bold">{t.btnRunCodeScenario}</button>
                </div>
                <p className="text-[9px] text-yellow-100/70 leading-tight mb-2">{t.scenarioLibraryHint}</p>
                {scenarioItems.map((item) => (
                  <div key={item.key} className="bg-[#0E1217] border border-gray-800 rounded p-2 mb-2 last:mb-0">
                    <input
                      value={scenarioNames[item.key]}
                      onChange={(e) => setScenarioName(item.key, e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded px-2 py-1 text-[11px] font-bold text-white mb-1"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[9px] text-gray-500 leading-tight">{item.desc}</p>
                      <div className="flex gap-1">
                        <button onClick={item.apply} className="text-[10px] bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded font-bold">{t.btnSetupScenario}</button>
                        <button onClick={item.run || (() => { item.apply(); eventController.runDemo(); })} className="text-[10px] bg-yellow-400 hover:bg-yellow-300 text-black px-2 py-1 rounded font-bold">{t.btnRunScenario}</button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="bg-[#0E1217] border border-cyan-900/70 rounded p-2.5 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-bold text-gab-cyan uppercase">{t.segmentControl}</h3>
                  <button onClick={runScenario1Ceremony} className="text-[10px] bg-gab-cyan-light text-black px-2 py-0.5 rounded font-bold">{t.runAll}</button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: t.segTouch, phase: EventPhase.WAITING_FOR_PARTICIPANTS },
                    { label: t.segReady, phase: EventPhase.ALL_PARTICIPANTS_READY },
                    { label: t.segCount, phase: EventPhase.COUNTDOWN },
                    { label: t.segLogo, phase: EventPhase.GAB_REVEAL },
                    { label: t.segEnergy, phase: EventPhase.ENERGY_CONVERGENCE },
                    { label: t.segCounter, phase: EventPhase.COUNTER_SEQUENCE },
                    { label: t.segBurst, phase: EventPhase.EXPLOSION },
                    { label: t.segFinal, phase: EventPhase.SUCCESS }
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => eventController.jumpToPhase(item.phase)}
                      className={`py-1.5 rounded text-[10px] font-bold border ${phase === item.phase ? 'bg-gab-cyan text-black border-gab-cyan' : 'bg-black border-gray-700 text-gray-300 hover:border-gab-cyan'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
             </div>

             <div className="bg-[#0E1217] border border-gray-800 rounded p-2.5 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="text-[10px] text-gray-400 block mb-1">{t.deviceLedPreset}</span>
                    <select value={devicePreset} onChange={(e) => setDevicePreset(e.target.value as typeof devicePreset)} className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-white">
                      <option value="led-fhd">LED FHD 1920x1080</option>
                      <option value="led-2k">LED 2K 2560x1440</option>
                      <option value="led-4k">LED 4K 3840x2160</option>
                      <option value="led-ultrawide">LED Wide 3840x1080</option>
                      <option value="laptop">Laptop 1440x900</option>
                      <option value="tablet">Tablet 1024x1366</option>
                      <option value="mobile">Mobile 390x844</option>
                      <option value="custom">Custom</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-gray-400 block mb-1">{t.stageFitLabel}</span>
                    <select value={stageFit} onChange={(e) => setStageFit(e.target.value as typeof stageFit)} className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-white">
                      <option value="fill">Fill viewport - het vien den</option>
                      <option value="stretch">Stretch - khop moi man</option>
                      <option value="cover">Cover - phu kin co crop</option>
                      <option value="contain">Contain - khong cat</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <label className="block">
                    <span className="text-[10px] text-gray-400 block mb-1">{t.stageWidthLabel}</span>
                    <input type="number" min="240" max="7680" value={stageWidth || 1920} onChange={(e) => setStageSize(Math.max(240, Number(e.target.value)), stageHeight || 1080)} className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-white" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-gray-400 block mb-1">{t.stageHeightLabel}</span>
                    <input type="number" min="240" max="4320" value={stageHeight || 1080} onChange={(e) => setStageSize(stageWidth || 1920, Math.max(240, Number(e.target.value)))} className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-white" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-gray-400 block mb-1">{t.overscanLed}: {stageOverscan.toFixed(1)}%</span>
                    <input type="range" min="-3" max="5" step="0.1" value={stageOverscan} onChange={(e) => setStageOverscan(Number(e.target.value))} className="w-full accent-gab-cyan" />
                  </label>
                </div>

                <div className="grid grid-cols-[1fr_92px] gap-2 items-end">
                  <label className="block">
                    <span className="text-[10px] text-gray-400 block mb-1">{t.touchAutomation}</span>
                    <select value={touchAutomationMode} onChange={(e) => setTouchAutomationMode(e.target.value as typeof touchAutomationMode)} className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-white">
                      <option value="manual">Manual - bam tung diem</option>
                      <option value="sequential">Sequential - tuan tu</option>
                      <option value="burst">Burst - theo cum</option>
                      <option value="instant">Instant - kich tat ca</option>
                    </select>
                  </label>
                  <button onClick={() => eventController.runTouchAutomation()} className="h-8 bg-gab-cyan-light text-black text-[10px] font-bold rounded hover:opacity-90">
                    {t.runTouch}
                  </button>
                </div>

                <label className="block">
                  <span className="text-[10px] text-gray-400 block mb-1">Toc do cam ung: {touchAutomationSpeed.toFixed(2)}s</span>
                  <input type="range" min="0.08" max="1.2" step="0.01" value={touchAutomationSpeed} onChange={(e) => setTouchAutomationSpeed(Number(e.target.value))} className="w-full accent-yellow-400" />
                </label>

                <div className="pt-1 border-t border-gray-800 text-[10px] leading-snug text-gray-500">
                  Cau hoi tu cau hinh: Man LED ti le nao? Muon khong cat hay phu kin? Nhip su kien nhanh hay trang trong? Cham tay tung nguoi, theo cum hay kich tat ca? Man ket can logo/text/card uu tien cai gi?
                </div>
             </div>
          </div>

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
                  <option value="aurora">Aurora Waves</option>
                  <option value="light-tunnel">LED Light Tunnel</option>
                  <option value="scanlines">Cyber Scanlines</option>
                  <option value="prism">Prism Ceremony</option>
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
                 <div className="grid grid-cols-2 gap-1.5 mb-2">
                   <button onClick={() => setCustomBackgroundVideo('/video-demo/0328(1).mp4')} className="bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-[10px] text-gab-cyan font-bold rounded py-1">
                     Demo 0328
                   </button>
                   <button onClick={() => setCustomBackgroundVideo('/video-demo/Visual_PlaceCard.mp4')} className="bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-[10px] text-gab-cyan font-bold rounded py-1">
                     PlaceCard
                   </button>
                 </div>
                 <input 
                   type="file" 
                   accept="video/*" 
                   onChange={handleVideoUpload} 
                   className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700" 
                 />
                 {customBackgroundVideo && (
                   <div className="mt-2 pt-2 border-t border-gray-800 space-y-2">
                     <div className="grid grid-cols-3 gap-2">
                       <label className="block">
                         <span className="text-[10px] text-gray-500">Fit</span>
                         <select value={backgroundVideoFit} onChange={(e) => setBackgroundVideoFit(e.target.value as typeof backgroundVideoFit)} className="w-full bg-black border border-gray-700 rounded px-1 py-1 text-[10px] text-white">
                           <option value="cover">Cover</option>
                           <option value="contain">Contain</option>
                           <option value="fill">Fill</option>
                         </select>
                       </label>
                       <label className="block">
                         <span className="text-[10px] text-gray-500">Speed</span>
                         <input type="number" min="0.25" max="3" step="0.05" value={backgroundVideoPlaybackRate} onChange={(e) => setBackgroundVideoPlaybackRate(Number(e.target.value))} className="w-full bg-black border border-gray-700 rounded px-1 py-1 text-[10px] text-white" />
                       </label>
                       <button onClick={() => setBackgroundVideoPaused(!backgroundVideoPaused)} className="self-end bg-gray-800 hover:bg-gray-700 text-[10px] font-bold rounded py-1.5">
                         {backgroundVideoPaused ? 'PLAY' : 'PAUSE'}
                       </button>
                     </div>
                     <label className="block">
                       <span className="text-[10px] text-gray-500">Opacity: {Math.round(backgroundVideoOpacity * 100)}%</span>
                       <input type="range" min="0" max="1" step="0.01" value={backgroundVideoOpacity} onChange={(e) => setBackgroundVideoOpacity(Number(e.target.value))} className="w-full accent-gab-cyan" />
                     </label>
                   </div>
                 )}
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
                     <option value="radial-strobe">Radial Strobe</option>
                     <option value="glass-shatter">Glass Shatter</option>
                     <option value="data-burst">Data Burst</option>
                     <option value="aurora-flare">Aurora Flare</option>
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
                     <option value="ribbon-weave">Ribbon Weave</option>
                     <option value="orbital-rings">Orbital Rings</option>
                     <option value="rain-up">Light Rain Up</option>
                     <option value="heartbeat-pulse">Heartbeat Pulse</option>
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
               <div className="bg-[#0E1217] p-3 rounded-lg border border-cyan-900/70">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gab-cyan">Bundled logo library</span>
                    <button onClick={applyBundledLogos} className="text-[10px] bg-gab-cyan-light text-black px-2 py-0.5 rounded font-bold">APPLY ALL</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/50 border border-gray-800 rounded p-2 flex items-center gap-2 min-h-14">
                      <img src="/logo/GAB.png" className="w-10 h-10 object-contain" alt="GAB bundled logo" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white truncate">GAB.png</p>
                        <p className="text-[9px] text-gray-500">Center / Card</p>
                      </div>
                    </div>
                    <div className="bg-black/50 border border-gray-800 rounded p-2 flex items-center gap-2 min-h-14">
                      <img src="/logo/vietkings.webp" className="w-10 h-10 object-contain bg-white rounded" alt="Vietkings bundled logo" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white truncate">vietkings.webp</p>
                        <p className="text-[9px] text-gray-500">Partner card</p>
                      </div>
                    </div>
                  </div>
               </div>
               
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
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <button onClick={() => setCustomLogo('customLogoFly1', '/logo/vietkings.webp')} className="bg-gray-800 hover:bg-gray-700 text-[10px] rounded py-1 font-bold">USE VIETKINGS</button>
                    <button onClick={() => setCustomLogo('customLogoFly1', '/logo/GAB.png')} className="bg-gray-800 hover:bg-gray-700 text-[10px] rounded py-1 font-bold">USE GAB</button>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly1')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700 mb-2"/>
                  <div className="h-12 mb-2 rounded border border-gray-800 bg-black/40 flex items-center justify-center">
                    <img src={store.customLogoFly1 || '/logo/vietkings.webp'} className="max-h-10 max-w-full object-contain" alt="Logo 1 preview" onError={(e: any) => e.currentTarget.style.display='none'} />
                  </div>
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
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <button onClick={() => setCustomLogo('customLogoFly2', '/logo/GAB.png')} className="bg-gray-800 hover:bg-gray-700 text-[10px] rounded py-1 font-bold">USE GAB</button>
                    <button onClick={() => setCustomLogo('customLogoFly2', '/logo/vietkings.webp')} className="bg-gray-800 hover:bg-gray-700 text-[10px] rounded py-1 font-bold">USE VIETKINGS</button>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoFly2')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700 mb-2"/>
                  <div className="h-12 mb-2 rounded border border-gray-800 bg-black/40 flex items-center justify-center">
                    <img src={store.customLogoFly2 || '/logo/GAB.png'} className="max-h-10 max-w-full object-contain" alt="Logo 2 preview" onError={(e: any) => e.currentTarget.style.display='none'} />
                  </div>
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
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <button onClick={() => setCustomLogo('customLogoCenter', '/logo/GAB.png')} className="bg-gray-800 hover:bg-gray-700 text-[10px] rounded py-1 font-bold">USE GAB</button>
                    <button onClick={() => setCustomLogo('customLogoCenter', '/logo/vietkings.webp')} className="bg-gray-800 hover:bg-gray-700 text-[10px] rounded py-1 font-bold">USE VIETKINGS</button>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'customLogoCenter')} className="w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-800 file:text-white hover:file:bg-gray-700"/>
                  <div className="h-12 mt-2 rounded border border-gray-800 bg-black/40 flex items-center justify-center">
                    <img src={store.customLogoCenter || '/logo/GAB.png'} className="max-h-10 max-w-full object-contain" alt="Center logo preview" onError={(e: any) => e.currentTarget.style.display='none'} />
                  </div>
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
