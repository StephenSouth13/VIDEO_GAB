import { EventPhase, useEventStore } from '../stores/useEventStore';

const ACTIVE_PHASES: EventPhase[] = [
  EventPhase.COUNTDOWN,
  EventPhase.GAB_REVEAL,
  EventPhase.ENERGY_CONVERGENCE,
  EventPhase.COUNTER_SEQUENCE,
  EventPhase.FINAL_CHARGE,
  EventPhase.EXPLOSION,
  EventPhase.SUCCESS
];

let rafId: number | null = null;
let intervalId: number | null = null;
let lastTime = 0;

export function getPhaseAtTime(time: number, config: ReturnType<typeof useEventStore.getState>['timelineConfig']): EventPhase {
  let acc = 0;
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

export function isShowClockPhase(phase: EventPhase) {
  return ACTIVE_PHASES.includes(phase);
}

export function advanceShowClock(currentTime = performance.now()) {
  if (lastTime <= 0) {
    lastTime = currentTime;
    return;
  }

  if (currentTime <= lastTime) return;

  const delta = Math.min((currentTime - lastTime) / 1000, 0.12);
  lastTime = currentTime;

  const state = useEventStore.getState();
  if (!isShowClockPhase(state.phase)) return;

  if (state.isPaused) return;

  if (state.isScrubbing) {
    const expectedPhase = getPhaseAtTime(state.globalTime, state.timelineConfig);
    if (expectedPhase !== state.phase) {
      useEventStore.setState({ phase: expectedPhase });
    }
    return;
  }

  const globalTime = Math.min(state.globalTime + delta, state.totalDuration);
  const expectedPhase = getPhaseAtTime(globalTime, state.timelineConfig);
  const nextState: { globalTime: number; phase?: EventPhase } = { globalTime };

  if (expectedPhase !== state.phase) {
    nextState.phase = expectedPhase;
  }

  useEventStore.setState(nextState);
}

export function startShowClock() {
  if (rafId !== null || intervalId !== null) return;

  lastTime = performance.now();
  const loop = (time: number) => {
    advanceShowClock(time);
    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);
  intervalId = window.setInterval(() => advanceShowClock(performance.now()), 100);
}

export function stopShowClock() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }

  lastTime = 0;
}
