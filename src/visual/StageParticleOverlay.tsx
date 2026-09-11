import { useMemo } from 'react';
import { useEventStore } from '../stores/useEventStore';

const colorMap: Record<string, string> = {
  particles: '#5BC0BE',
  starfield: '#FFFFFF',
  'digital-network': '#00FFCC',
  matrix: '#00FF66',
  nebula: '#D946EF',
  quantum: '#38BDF8',
  aurora: '#7DD3FC',
  'light-tunnel': '#F8FAFC',
  scanlines: '#22D3EE',
  prism: '#F0ABFC',
};

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export default function StageParticleOverlay() {
  const { particleCount, backgroundType, isPaused } = useEventStore();
  const visibleCount = Math.min(520, Math.max(80, Math.round(particleCount / 4)));
  const particles = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, index) => {
        const large = index % 29 === 0;
        const medium = index % 11 === 0;
        return {
          id: index,
          left: seeded(index, 1) * 100,
          top: seeded(index, 2) * 100,
          size: large ? 9 + seeded(index, 3) * 12 : medium ? 4 + seeded(index, 4) * 6 : 1.5 + seeded(index, 5) * 2.8,
          opacity: large ? 0.65 : medium ? 0.52 : 0.42,
          delay: seeded(index, 6) * -12,
          duration: 7 + seeded(index, 7) * 9,
        };
      }),
    [visibleCount]
  );
  const color = colorMap[backgroundType] || colorMap.particles;

  return (
    <div
      className={`stage-particle-overlay stage-particle-${backgroundType} ${isPaused ? 'stage-particles-paused' : ''}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            backgroundColor: color,
            boxShadow: `0 0 ${Math.max(6, particle.size * 3)}px ${color}`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
