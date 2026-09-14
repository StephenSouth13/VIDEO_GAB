import { useEventStore, EventPhase } from '../stores/useEventStore';
import { useEffect } from 'react';

// Components
import LogoReveal from './LogoReveal';
import Countdown from './Countdown';
import FinalScreen from './FinalScreen';
import Counter from './Counter';
import ParticipantNodes from './ParticipantNodes';
import EnergyTrailSystem from './EnergyTrailSystem';
import ExplosionSystem from './ExplosionSystem';
import CardSpawner from './CardSpawner';
import StageParticleOverlay from './StageParticleOverlay';

const isUrlEditPreview = new URLSearchParams(window.location.search).get('edit') === 'true';

interface LedStageProps {
  editPreview?: boolean;
}

export default function LedStage({ editPreview = false }: LedStageProps) {
  const isEditPreview = editPreview || isUrlEditPreview;
  const { 
    phase, 
    isBlackout, 
    customBackgroundHTML, 
    backgroundColor,
    backgroundType,
    stageWidth,
    stageHeight,
    stageFit,
    stageOverscan,
    showNodes,
    setShowNodes,
    participants,
    resetParticipants
  } = useEventStore();
  
  useEffect(() => {
    if (isEditPreview) return;
    // Prevent default scrolling on LED stage
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isEditPreview]);

  useEffect(() => {
    if (isEditPreview) return;
    const shouldShowNodes = [
      EventPhase.BOOT,
      EventPhase.IDLE,
      EventPhase.WAITING_FOR_PARTICIPANTS,
      EventPhase.PARTICIPANT_CONFIRMING,
      EventPhase.ALL_PARTICIPANTS_READY,
      EventPhase.RESETTING
    ].includes(phase as any);

    if (!shouldShowNodes) return;
    if (!showNodes) setShowNodes(true);
    if (Object.keys(participants).length === 0) resetParticipants();
  }, [isEditPreview, participants, phase, resetParticipants, setShowNodes, showNodes]);

  if (isBlackout) {
    return <div className="w-full h-screen bg-black"></div>;
  }

  const safeStageWidth = Math.max(1, stageWidth || 1920);
  const safeStageHeight = Math.max(1, stageHeight || 1080);
  const stageAspect = safeStageWidth / safeStageHeight;
  const safeStageOverscan = Number.isFinite(stageOverscan) ? stageOverscan : 0;
  const isStretchFit = stageFit === 'stretch';
  const isCoverFit = stageFit === 'cover' || stageFit === 'fill';
  const frameStyle = {
    width: isEditPreview 
      ? `${safeStageWidth}px`
      : isStretchFit ? '100vw' : isCoverFit ? `max(100vw, calc(100vh * ${stageAspect}))` : `min(100vw, calc(100vh * ${stageAspect}))`,
    height: isEditPreview
      ? `${safeStageHeight}px`
      : isStretchFit ? '100vh' : isCoverFit ? `max(100vh, calc(100vw / ${stageAspect}))` : `min(100vh, calc(100vw / ${stageAspect}))`,
    transform: `scale(${1 + safeStageOverscan / 100})`,
    transformOrigin: 'center center'
  };

  return (
    <div className={`${isEditPreview ? 'w-full h-full' : 'w-full h-screen'} overflow-hidden relative bg-black flex items-center justify-center`}>
      <div 
        className="relative overflow-hidden shrink-0"
        data-stage-frame="true"
        style={{ ...frameStyle, backgroundColor }}
      >
      
      {/* Custom Embedded Background Layer */}
      {customBackgroundHTML && (
        <div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          dangerouslySetInnerHTML={{ __html: customBackgroundHTML }}
        ></div>
      )}

      <StageParticleOverlay />

      <div className="stage-kinetic-light absolute inset-0 z-[7] pointer-events-none" aria-hidden="true" />

      {['aurora', 'light-tunnel', 'scanlines', 'prism'].includes(backgroundType) && (
        <div className={`led-atmosphere led-atmosphere-${backgroundType} absolute inset-0 z-[8] pointer-events-none mix-blend-screen`} />
      )}
      
      {/* HTML / 2D Overlay Layer */}
      <div className={`absolute inset-0 ${customBackgroundHTML ? 'z-20' : 'z-10'} flex flex-col items-center justify-center pointer-events-none`}>
         
         {/* COUNTDOWN */}
         {phase === EventPhase.COUNTDOWN && <Countdown />}
         
         {/* PARTICIPANT NODES */}
         {[
           EventPhase.BOOT,
           EventPhase.IDLE,
           EventPhase.WAITING_FOR_PARTICIPANTS,
           EventPhase.PARTICIPANT_CONFIRMING,
           EventPhase.ALL_PARTICIPANTS_READY
         ].includes(phase as any) && (
           <ParticipantNodes />
         )}
         
         {/* ENERGY TRAILS */}
         <EnergyTrailSystem />

         {/* LOGO REVEAL */}
         {(phase === EventPhase.GAB_REVEAL || phase === EventPhase.ENERGY_CONVERGENCE) && <LogoReveal />}
         
         {/* COUNTER */}
         {(phase === EventPhase.COUNTER_SEQUENCE || phase === EventPhase.FINAL_CHARGE) && <Counter />}
         
         {/* EXPLOSION */}
         <ExplosionSystem />
         
         {/* FINAL SCREEN */}
         <FinalScreen />
         
         {/* CARD SPAWNER */}
         <CardSpawner />
         
      </div>
      </div>
    </div>
  );
}
