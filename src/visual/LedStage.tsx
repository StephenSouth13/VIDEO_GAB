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

export default function LedStage() {
  const { phase, isBlackout } = useEventStore();
  
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
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }} 
          dpr={[1, 1.5]}
          gl={{ antialias: false }} // postprocessing deals with it
        >
          <color attach="background" args={['#050810']} />
          <ambientLight intensity={0.5} />
          
          <Suspense fallback={null}>
            <ParticlesBackground />
          </Suspense>

          {EVENT_CONFIG.visual.enableBloom && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
            </EffectComposer>
          )}
        </Canvas>
      </div>
      
      {/* HTML / 2D Overlay Layer */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
         
         {/* COUNTDOWN */}
         {phase === EventPhase.COUNTDOWN && <Countdown />}
         
         {/* PARTICIPANT NODES */}
         {(phase === EventPhase.IDLE || phase === EventPhase.WAITING_FOR_PARTICIPANTS || phase === EventPhase.PARTICIPANT_CONFIRMING || phase === EventPhase.ALL_PARTICIPANTS_READY) && (
           <ParticipantNodes />
         )}
         
         {/* LOGO REVEAL */}
         {(phase === EventPhase.GAB_REVEAL || phase === EventPhase.ENERGY_CONVERGENCE) && <LogoReveal />}
         
         {/* COUNTER */}
         {(phase === EventPhase.COUNTER_SEQUENCE || phase === EventPhase.FINAL_CHARGE) && <Counter />}
         
         {/* FINAL SCREEN */}
         {phase === EventPhase.SUCCESS && <FinalScreen />}
         
      </div>
    </div>
  );
}
