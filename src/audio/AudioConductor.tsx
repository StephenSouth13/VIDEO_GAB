import { useEffect, useMemo, useRef } from 'react';
import { audioManager } from './AudioManager';
import { EventPhase, useEventStore } from '../stores/useEventStore';

const phaseCue: Partial<Record<EventPhase, Parameters<typeof audioManager.play>[0]>> = {
  [EventPhase.ALL_PARTICIPANTS_READY]: 'ready',
  [EventPhase.GAB_REVEAL]: 'reveal',
  [EventPhase.ENERGY_CONVERGENCE]: 'energy',
  [EventPhase.COUNTER_SEQUENCE]: 'counter',
  [EventPhase.FINAL_CHARGE]: 'charge',
  [EventPhase.EXPLOSION]: 'explosion',
  [EventPhase.SUCCESS]: 'final',
};

export default function AudioConductor() {
  const {
    audioEnabled,
    audioVolume,
    phase,
    globalTime,
    timelineConfig,
    participants,
    isPaused,
    isBlackout,
  } = useEventStore();
  const previousPhase = useRef<EventPhase | null>(null);
  const previousConfirmed = useRef(0);
  const previousCountdownTick = useRef<number | null>(null);

  const confirmedCount = useMemo(
    () => Object.values(participants).filter((participant) => participant.status === 'CONFIRMED').length,
    [participants]
  );

  useEffect(() => {
    audioManager.setMute(!audioEnabled || isBlackout);
    audioManager.setVolume(audioVolume);
    if (!audioEnabled || isBlackout || isPaused) {
      audioManager.stopAll();
    }
  }, [audioEnabled, audioVolume, isBlackout, isPaused]);

  useEffect(() => {
    if (!audioEnabled || isPaused || isBlackout) return;
    if (confirmedCount > previousConfirmed.current) {
      audioManager.play('touch');
    }
    previousConfirmed.current = confirmedCount;
  }, [audioEnabled, confirmedCount, isBlackout, isPaused]);

  useEffect(() => {
    if (!audioEnabled || isPaused || isBlackout) return;
    if (previousPhase.current === phase) return;

    previousPhase.current = phase;
    previousCountdownTick.current = null;
    const cue = phaseCue[phase];
    if (cue) {
      audioManager.play(cue);
    }
  }, [audioEnabled, phase, isBlackout, isPaused]);

  useEffect(() => {
    if (!audioEnabled || isPaused || isBlackout || phase !== EventPhase.COUNTDOWN) return;
    const remaining = Math.max(0, Math.ceil(timelineConfig.countdown - globalTime));
    if (remaining !== previousCountdownTick.current) {
      previousCountdownTick.current = remaining;
      audioManager.play('countdown');
    }
  }, [audioEnabled, globalTime, isBlackout, isPaused, phase, timelineConfig.countdown]);

  return null;
}
