import { useEffect } from 'react';
import { useEventStore, EventPhase } from '../stores/useEventStore';

export function getPhaseAtTime(time: number, config: any): EventPhase {
  let acc = 0;
  if (time < acc) return EventPhase.IDLE;
  acc += config.countdown;
  if (time < acc) return EventPhase.COUNTDOWN;
  acc += config.reveal;
  if (time < acc) return EventPhase.GAB_REVEAL;
  acc += config.energy;
  if (time < acc) return EventPhase.ENERGY_CONVERGENCE;
  acc += config.counter;
  if (time < acc) return EventPhase.COUNTER_SEQUENCE;
  acc += config.finalCharge;
  if (time < acc) return EventPhase.FINAL_CHARGE;
  acc += config.explosion;
  if (time < acc) return EventPhase.EXPLOSION;
  return EventPhase.SUCCESS;
}

export default function TimelineManager() {
  useEffect(() => {
    let lastTime = performance.now();
    let rafId: number;

    // If inside an embedded iframe in editor, don't run a second duplicate timer
    const isEmbeddedIframe = window !== window.top && window.location.search.includes('edit=true');
    if (isEmbeddedIframe) return;

    const loop = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // in seconds, clamp spike
      lastTime = currentTime;

      const state = useEventStore.getState();
      const isActivePhase = [
        EventPhase.COUNTDOWN,
        EventPhase.GAB_REVEAL,
        EventPhase.ENERGY_CONVERGENCE,
        EventPhase.COUNTER_SEQUENCE,
        EventPhase.FINAL_CHARGE,
        EventPhase.EXPLOSION,
        EventPhase.SUCCESS
      ].includes(state.phase as any);

      if (isActivePhase) {
        if (!state.isPaused && !state.isScrubbing) {
          const newTime = state.globalTime + delta;
          if (newTime <= state.totalDuration + 1) { // 1 sec buffer
            useEventStore.setState({ globalTime: newTime });
            const expectedPhase = getPhaseAtTime(newTime, state.timelineConfig);
            if (expectedPhase !== state.phase) {
              useEventStore.setState({ phase: expectedPhase });
            }
          }
        } else if (state.isScrubbing) {
          // While scrubbing, map the scrubber time to phase
          const expectedPhase = getPhaseAtTime(state.globalTime, state.timelineConfig);
          if (expectedPhase !== state.phase) {
             useEventStore.setState({ phase: expectedPhase });
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return null;
}
