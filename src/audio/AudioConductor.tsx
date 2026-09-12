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

const activeShowPhases = [
  EventPhase.COUNTDOWN,
  EventPhase.GAB_REVEAL,
  EventPhase.ENERGY_CONVERGENCE,
  EventPhase.COUNTER_SEQUENCE,
  EventPhase.FINAL_CHARGE,
  EventPhase.EXPLOSION,
  EventPhase.SUCCESS,
];

function getYouTubeId(url: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v') || parsed.pathname.split('/').pop() || null;
    }
  } catch {
    return null;
  }

  return null;
}

function getLoopedTime(globalTime: number, start: number, end: number, loop: boolean) {
  if (end > start && loop) {
    return start + (globalTime % (end - start));
  }
  return start + globalTime;
}

function loadYouTubeApi() {
  const win = window as any;
  if (win.YT?.Player) return Promise.resolve(win.YT);

  return new Promise<any>((resolve) => {
    const previousReady = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(win.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  });
}

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
    showAudioDucksCues,
    showAudioStart,
    showAudioEnd,
  } = useEventStore();
  const previousPhase = useRef<EventPhase | null>(null);
  const previousConfirmed = useRef(0);
  const previousCountdownTick = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousTrackUrl = useRef<string | null>(null);
  const youtubeHostRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const youtubeVideoId = getYouTubeId(showAudioUrl);

  const confirmedCount = useMemo(
    () => Object.values(participants).filter((participant) => participant.status === 'CONFIRMED').length,
    [participants]
  );

  useEffect(() => {
    audioManager.setMute(!audioEnabled || isBlackout);
    audioManager.setVolume(audioVolume);
    if (!audioEnabled || isBlackout || isPaused) {
      audioManager.stopAll();
      audioRef.current?.pause();
      youtubePlayerRef.current?.pauseVideo?.();
    }
  }, [audioEnabled, audioVolume, isBlackout, isPaused]);

  useEffect(() => {
    if (previousTrackUrl.current === showAudioUrl) return;
    previousTrackUrl.current = showAudioUrl;

    audioRef.current?.pause();
    audioRef.current = null;
    youtubePlayerRef.current?.destroy?.();
    youtubePlayerRef.current = null;

    if (!showAudioUrl) return;

    if (youtubeVideoId) {
      let disposed = false;
      void loadYouTubeApi().then((YT) => {
        if (disposed || !youtubeHostRef.current) return;
        youtubePlayerRef.current = new YT.Player(youtubeHostRef.current, {
          width: '1',
          height: '1',
          videoId: youtubeVideoId,
          playerVars: {
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(Math.round(showAudioVolume * 100));
            },
          },
        });
      });

      return () => {
        disposed = true;
        youtubePlayerRef.current?.destroy?.();
        youtubePlayerRef.current = null;
      };
    }

    const audio = new Audio(showAudioUrl);
    audio.preload = 'auto';
    audio.addEventListener('error', () => audio.pause());
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, [showAudioUrl, showAudioVolume, youtubeVideoId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = showAudioVolume;
      audio.loop = showAudioLoop && showAudioEnd <= showAudioStart;
    }

    youtubePlayerRef.current?.setVolume?.(Math.round(showAudioVolume * 100));
  }, [showAudioEnd, showAudioLoop, showAudioStart, showAudioVolume]);

  useEffect(() => {
    const shouldPlayTrack = audioEnabled && !isBlackout && !isPaused && activeShowPhases.includes(phase as any);
    const desiredTime = getLoopedTime(globalTime, showAudioStart, showAudioEnd, showAudioLoop);

    if (showAudioEnd > showAudioStart && !showAudioLoop && desiredTime >= showAudioEnd) {
      audioRef.current?.pause();
      youtubePlayerRef.current?.pauseVideo?.();
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      if (!shouldPlayTrack) {
        audio.pause();
        return;
      }

      if (Number.isFinite(audio.duration) && audio.duration > 0 && Math.abs(audio.currentTime - desiredTime) > 0.45) {
        audio.currentTime = Math.max(0, Math.min(desiredTime, audio.duration - 0.05));
      }

      void audioManager.unlock()
        .then(() => audio.play())
        .catch(() => undefined);
      return;
    }

    const player = youtubePlayerRef.current;
    if (!player?.playVideo) return;

    if (!shouldPlayTrack) {
      player.pauseVideo?.();
      return;
    }

    const current = player.getCurrentTime?.() ?? 0;
    if (Math.abs(current - desiredTime) > 0.6) {
      player.seekTo?.(desiredTime, true);
    }
    player.setVolume?.(Math.round(showAudioVolume * 100));
    player.playVideo?.();
  }, [audioEnabled, globalTime, isBlackout, isPaused, phase, showAudioEnd, showAudioLoop, showAudioStart, showAudioVolume]);

  useEffect(() => {
    const shouldPlayCue = audioEnabled && !isPaused && !isBlackout && !(showAudioUrl && showAudioDucksCues);
    if (shouldPlayCue && confirmedCount > previousConfirmed.current) {
      audioManager.play('touch');
    }
    previousConfirmed.current = confirmedCount;
  }, [audioEnabled, confirmedCount, isBlackout, isPaused, showAudioDucksCues, showAudioUrl]);

  useEffect(() => {
    if (!audioEnabled || isPaused || isBlackout || (showAudioUrl && showAudioDucksCues)) return;
    if (previousPhase.current === phase) return;

    previousPhase.current = phase;
    previousCountdownTick.current = null;
    const cue = phaseCue[phase];
    if (cue) {
      audioManager.play(cue);
    }
  }, [audioEnabled, phase, isBlackout, isPaused, showAudioDucksCues, showAudioUrl]);

  useEffect(() => {
    if (!audioEnabled || isPaused || isBlackout || (showAudioUrl && showAudioDucksCues) || phase !== EventPhase.COUNTDOWN) return;
    const remaining = Math.max(0, Math.ceil(timelineConfig.countdown - globalTime));
    if (remaining !== previousCountdownTick.current) {
      previousCountdownTick.current = remaining;
      audioManager.play('countdown');
    }
  }, [audioEnabled, globalTime, isBlackout, isPaused, phase, showAudioDucksCues, showAudioUrl, timelineConfig.countdown]);

  useEffect(() => {
    const testTrack = () => {
      const start = Math.max(0, showAudioStart || 0);
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = start;
        audio.volume = showAudioVolume;
        void audio.play().catch(() => undefined);
        return;
      }

      const player = youtubePlayerRef.current;
      if (player?.playVideo) {
        player.setVolume?.(Math.round(showAudioVolume * 100));
        player.seekTo?.(start, true);
        player.playVideo?.();
      }
    };

    window.addEventListener('gab-test-show-audio', testTrack);
    return () => window.removeEventListener('gab-test-show-audio', testTrack);
  }, [showAudioStart, showAudioVolume]);

  return (
    <div
      ref={youtubeHostRef}
      className="fixed left-0 top-0 h-px w-px overflow-hidden opacity-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
