import { useEventStore, EventPhase } from '../stores/useEventStore';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { EVENT_CONFIG } from '../config/eventConfig';
import { Suspense, useEffect } from 'react';

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

export default function LedStage() {
  const { phase, isBlackout, customBackgroundHTML } = useEventStore();
  
  useEffect(() => {
    // Prevent default scrolling on LED stage
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  if (isBlackout) {
    return <div className="w-full h-screen bg-black"></div>;
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      
      {/* Custom Embedded Background Layer */}
      {customBackgroundHTML && (
        <div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          dangerouslySetInnerHTML={{ __html: customBackgroundHTML }}
        ></div>
      )}

      {/* 3D Scene Layer */}
      <div className={`absolute inset-0 ${customBackgroundHTML ? 'z-10' : 'z-0'}`}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }} 
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }} // alpha true for custom background
        >
          {/* Only render background color if no custom HTML is provided */}
          {!customBackgroundHTML && <color attach="background" args={['#050810']} />}
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
      
      {/* HTML / 2D Overlay Layer */}
      <div className={`absolute inset-0 ${customBackgroundHTML ? 'z-20' : 'z-10'} flex flex-col items-center justify-center pointer-events-none`}>
         
         {/* COUNTDOWN */}
         {phase === EventPhase.COUNTDOWN && <Countdown />}
         
         {/* PARTICIPANT NODES */}
         {(phase === EventPhase.IDLE || phase === EventPhase.WAITING_FOR_PARTICIPANTS || phase === EventPhase.PARTICIPANT_CONFIRMING || phase === EventPhase.ALL_PARTICIPANTS_READY) && (
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
         {phase === EventPhase.SUCCESS && <FinalScreen />}
         
      </div>
    </div>
  );
}
