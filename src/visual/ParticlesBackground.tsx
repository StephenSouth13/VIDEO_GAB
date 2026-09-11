import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEventStore } from '../stores/useEventStore';

export default function ParticlesBackground() {
  const { particleCount, backgroundType } = useEventStore();
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Dummy initialization for now
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const { particles, speeds } = useMemo(() => {
    const p = new Float32Array(5000 * 3); // Max alloc
    const s = new Float32Array(5000);
    for (let i = 0; i < 5000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
      s[i] = Math.random() * 0.02 + 0.005;
    }
    return { particles: p, speeds: s };
  }, []);

  useFrame(() => {
    if (mesh.current) {
      for (let i = 0; i < particleCount; i++) {
        if (backgroundType === 'particles') {
          // Slow float up
          particles[i * 3 + 1] += speeds[i];
          if (particles[i * 3 + 1] > 10) particles[i * 3 + 1] = -10;
        } else if (backgroundType === 'starfield') {
          // Fast move toward camera (Z axis)
          particles[i * 3 + 2] += speeds[i] * 10;
          if (particles[i * 3 + 2] > 10) particles[i * 3 + 2] = -20;
        } else if (backgroundType === 'digital-network') {
          // Fast fall down (Matrix style)
          particles[i * 3 + 1] -= speeds[i] * 5;
          if (particles[i * 3 + 1] < -10) particles[i * 3 + 1] = 10;
        }
        
        dummy.position.set(particles[i * 3], particles[i * 3 + 1], particles[i * 3 + 2]);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.count = particleCount;
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 5000]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial 
        color={backgroundType === 'digital-network' ? '#00FF00' : '#5BC0BE'} 
        transparent 
        opacity={backgroundType === 'starfield' ? 0.8 : 0.6} 
      />
    </instancedMesh>
  );
}
