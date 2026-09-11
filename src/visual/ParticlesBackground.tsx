import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEventStore } from '../stores/useEventStore';

export default function ParticlesBackground() {
  const { particleCount, backgroundType, isPaused } = useEventStore();
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const { particles, speeds, phases } = useMemo(() => {
    const p = new Float32Array(5000 * 3);
    const s = new Float32Array(5000);
    const ph = new Float32Array(5000); // Random phases for oscillation
    for (let i = 0; i < 5000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
      s[i] = Math.random() * 0.02 + 0.005;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { particles: p, speeds: s, phases: ph };
  }, []);

  useFrame((state) => {
    if (isPaused) return; // FIX: Pause animations
    
    if (mesh.current) {
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        if (backgroundType === 'particles') {
          // Slow float up
          particles[i * 3 + 1] += speeds[i];
          if (particles[i * 3 + 1] > 10) particles[i * 3 + 1] = -10;
        } else if (backgroundType === 'starfield') {
          // Fast move toward camera (Z axis)
          particles[i * 3 + 2] += speeds[i] * 10;
          if (particles[i * 3 + 2] > 10) particles[i * 3 + 2] = -20;
        } else if (backgroundType === 'digital-network' || backgroundType === 'matrix') {
          // Fast fall down
          particles[i * 3 + 1] -= speeds[i] * (backgroundType === 'matrix' ? 8 : 5);
          if (particles[i * 3 + 1] < -10) particles[i * 3 + 1] = 10;
        } else if (backgroundType === 'nebula') {
          // Slow circular drift
          particles[i * 3] += Math.sin(time + phases[i]) * 0.01;
          particles[i * 3 + 1] += Math.cos(time + phases[i]) * 0.01;
        } else if (backgroundType === 'quantum') {
          // Erratic vibration
          particles[i * 3] += (Math.random() - 0.5) * 0.1;
          particles[i * 3 + 1] += (Math.random() - 0.5) * 0.1;
          particles[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
        }
        
        dummy.position.set(particles[i * 3], particles[i * 3 + 1], particles[i * 3 + 2]);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.count = particleCount;
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  const colorMap: Record<string, string> = {
    'particles': '#5BC0BE',
    'starfield': '#FFFFFF',
    'digital-network': '#00FFCC',
    'matrix': '#00FF00',
    'nebula': '#D946EF', // Fuchsia
    'quantum': '#38BDF8', // Sky
  };

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 5000]}>
      <sphereGeometry args={[backgroundType === 'quantum' ? 0.02 : 0.05, 8, 8]} />
      <meshBasicMaterial 
        color={colorMap[backgroundType] || '#5BC0BE'} 
        transparent 
        opacity={backgroundType === 'nebula' ? 0.3 : 0.6} 
      />
    </instancedMesh>
  );
}
