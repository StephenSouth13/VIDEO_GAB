import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useEventStore, EventPhase } from '../stores/useEventStore';

export default function MeteorSystem() {
  const { phase, isPaused } = useEventStore();
  const groupRef = useRef<THREE.Group>(null);
  
  const isActive = phase === EventPhase.ENERGY_CONVERGENCE || phase === EventPhase.COUNTER_SEQUENCE;

  useFrame(() => {
    if (groupRef.current && isActive && !isPaused) {
      groupRef.current.rotation.z += 0.01;
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
       <mesh position={[5, 5, 0]}>
         <sphereGeometry args={[0.1, 16, 16]} />
         <meshBasicMaterial color="#00F0FF" />
       </mesh>
       {/* Simple placeholder for meteors */}
    </group>
  );
}
