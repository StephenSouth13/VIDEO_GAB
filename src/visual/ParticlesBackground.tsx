import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticlesBackground() {
  const count = 2000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Dummy initialization for now
  const dummy = new THREE.Object3D();
  const particles = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 40;
    particles[i * 3 + 1] = (Math.random() - 0.5) * 20;
    particles[i * 3 + 2] = (Math.random() - 0.5) * 20;
    speeds[i] = Math.random() * 0.02 + 0.005;
  }

  useFrame(() => {
    if (mesh.current) {
      for (let i = 0; i < count; i++) {
        // Slow float up
        particles[i * 3 + 1] += speeds[i];
        if (particles[i * 3 + 1] > 10) {
          particles[i * 3 + 1] = -10;
        }
        
        dummy.position.set(particles[i * 3], particles[i * 3 + 1], particles[i * 3 + 2]);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#5BC0BE" transparent opacity={0.6} />
    </instancedMesh>
  );
}
