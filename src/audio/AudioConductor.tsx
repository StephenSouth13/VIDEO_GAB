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
    showAudioUrl,
    showAudioVolume,
    showAudioLoop,
  } = useEventStore();
  const previousPhase = useRef<EventPhase | null>(null);
  const previousConfirmed = useRef(0);
  const previousCountdownTick = useRef<number | null>(null);
  const trackRef = useRef<HTMLAudioElement | null>(null);
  const previousTrackUrl = useRef<string | null>(null);

  const confirmedCount = useMemo(
    () => Object.values(participants).filter((participant) => participant.status === 'CONFIRMED').length,
    [participants]
  );

  useEffect(() => {
    audioManager.setMute(!audioEnabled || isBlackout);
    audioManager.setVolume(audioVolume);
    if (!audioEnabled || isBlackout || isPaused) {
      audioManager.stopAll();
      trackRef.current?.pause();
    }
  }, [audioEnabled, audioVolume, isBlackout, isPaused]);

  useEffect(() => {
    if (previousTrackUrl.current === showAudioUrl) return;
    previousTrackUrl.current = showAudioUrl;
    trackRef.current?.pause();
    trackRef.current = null;

    if (!showAudioUrl) return;
    const audio = new Audio(showAudioUrl);
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audio.loop = showAudioLoop;
    audio.volume = showAudioVolume;
    audio.addEventListener('error', () => {
      audio.pause();
    });
    trackRef.current = audio;

    return () => {
      audio.pause();
    };
  }, [showAudioUrl, showAudioLoop, showAudioVolume]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.volume = showAudioVolume;
    track.loop = showAudioLoop;
  }, [showAudioLoop, showAudioVolume]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const shouldPlayTrack = audioEnabled && !isBlackout && !isPaused && [
      EventPhase.COUNTDOWN,
      EventPhase.GAB_REVEAL,
      EventPhase.ENERGY_CONVERGENCE,
      EventPhase.COUNTER_SEQUENCE,
      EventPhase.FINAL_CHARGE,
      EventPhase.EXPLOSION,
      EventPhase.SUCCESS,
    ].includes(phase as any);

    if (!shouldPlayTrack) {
      track.pause();
      return;
    }

    if (Number.isFinite(track.duration) && track.duration > 0) {
      const desiredTime = showAudioLoop ? globalTime % track.duration : Math.min(globalTime, track.duration - 0.05);
      if (Math.abs(track.currentTime - desiredTime) > 0.5) {
        track.currentTime = Math.max(0, desiredTime);
      }
    }

    void track.play().catch(() => undefined);
  }, [audioEnabled, globalTime, isBlackout, isPaused, phase, showAudioLoop]);

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
