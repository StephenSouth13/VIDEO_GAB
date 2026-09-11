import { useEventStore, EventPhase } from '../stores/useEventStore';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { EVENT_CONFIG } from '../config/eventConfig';
import { Suspense, useEffect, useRef, useState } from 'react';

// Components
import LogoReveal from './LogoReveal';
import Countdown from './Countdown';
import FinalScreen from './FinalScreen';
import Counter from './Counter';
import ParticlesBackground from './ParticlesBackground';
import ParticipantNodes from './ParticipantNodes';
import MeteorSystem from './MeteorSystem';
import EnergyTrailSystem from './EnergyTrailSystem';
import ExplosionSystem from './ExplosionSystem';
import CardSpawner from './CardSpawner';

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
    customBackgroundVideo, 
    backgroundVideoOpacity,
    backgroundVideoFit,
    backgroundVideoPlaybackRate,
    backgroundVideoPaused,
    backgroundColor,
    backgroundType,
    stageWidth,
    stageHeight,
    stageFit,
    stageOverscan
  } = useEventStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failedVideoUrl, setFailedVideoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEditPreview) return;
    // Prevent default scrolling on LED stage
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isEditPreview]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = backgroundVideoPlaybackRate || 1;
    if (backgroundVideoPaused) {
      video.pause();
    } else {
      void video.play().catch(() => undefined);
    }
  }, [backgroundVideoPaused, backgroundVideoPlaybackRate, customBackgroundVideo]);
  
  if (isBlackout) {
    return <div className="w-full h-screen bg-black"></div>;
  }

  const safeStageWidth = Math.max(1, stageWidth || 1920);
  const safeStageHeight = Math.max(1, stageHeight || 1080);
  const stageAspect = safeStageWidth / safeStageHeight;
  const safeStageOverscan = Number.isFinite(stageOverscan) ? stageOverscan : 0;
  const fillWidth = stageFit === 'stretch' || stageFit === 'fill';
  const fillHeight = stageFit === 'stretch' || stageFit === 'fill';
  const frameStyle = {
    width: isEditPreview 
      ? `${safeStageWidth}px`
      : fillWidth ? '100vw' : stageFit === 'cover' ? `max(100vw, calc(100vh * ${stageAspect}))` : `min(100vw, calc(100vh * ${stageAspect}))`,
    height: isEditPreview
      ? `${safeStageHeight}px`
      : fillHeight ? '100vh' : stageFit === 'cover' ? `max(100vh, calc(100vw / ${stageAspect}))` : `min(100vh, calc(100vw / ${stageAspect}))`,
    transform: `scale(${1 + safeStageOverscan / 100})`,
    transformOrigin: 'center center'
  };

  return (
    <div className={`${isEditPreview ? 'w-full h-full' : 'w-full h-screen'} overflow-hidden relative bg-black flex items-center justify-center`}>
      <div 
        className="relative overflow-hidden shrink-0"
        style={{ ...frameStyle, backgroundColor }}
      >
      
      {/* Background Video Layer */}
      {customBackgroundVideo && failedVideoUrl !== customBackgroundVideo && (
        <video 
          ref={videoRef}
          src={customBackgroundVideo} 
          autoPlay={!backgroundVideoPaused}
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{
            opacity: backgroundVideoOpacity,
            objectFit: backgroundVideoFit === 'fill' ? 'fill' : backgroundVideoFit
          }}
          onError={() => setFailedVideoUrl(customBackgroundVideo)}
        />
      )}

      {/* Custom Embedded Background Layer */}
      {customBackgroundHTML && (
        <div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          dangerouslySetInnerHTML={{ __html: customBackgroundHTML }}
        ></div>
      )}

      {/* 3D Scene Layer */}
      <div className={`absolute inset-0 ${(customBackgroundHTML || customBackgroundVideo) ? 'z-10' : 'z-0'}`}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }} 
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }} // alpha true for custom background
        >
          {/* Only render background color if no custom HTML is provided */}
          {!customBackgroundHTML && <color attach="background" args={[backgroundColor]} />}
          <ambientLight intensity={0.5} />
          
          <Suspense fallback={null}>
            <ParticlesBackground />
            <MeteorSystem />
          </Suspense>

          {EVENT_CONFIG.visual.enableBloom && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
            </EffectComposer>
          )}
        </Canvas>
      </div>

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
