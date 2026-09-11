import { create } from 'zustand';
import { EVENT_CONFIG } from '../config/eventConfig';

export const EventPhase = {
  BOOT: 'BOOT',
  IDLE: 'IDLE',
  WAITING_FOR_PARTICIPANTS: 'WAITING_FOR_PARTICIPANTS',
  PARTICIPANT_CONFIRMING: 'PARTICIPANT_CONFIRMING',
  ALL_PARTICIPANTS_READY: 'ALL_PARTICIPANTS_READY',
  COUNTDOWN: 'COUNTDOWN',
  GAB_REVEAL: 'GAB_REVEAL',
  ENERGY_CONVERGENCE: 'ENERGY_CONVERGENCE',
  COUNTER_SEQUENCE: 'COUNTER_SEQUENCE',
  FINAL_CHARGE: 'FINAL_CHARGE',
  EXPLOSION: 'EXPLOSION',
  SUCCESS: 'SUCCESS',
  RESETTING: 'RESETTING'
} as const;

export type EventPhase = typeof EventPhase[keyof typeof EventPhase];

export interface ParticipantState {
  id: number;
  name: string;
  status: 'WAITING' | 'DETECTED' | 'CONFIRMING' | 'CONFIRMED';
  progress: number; // 0 to 100
}

interface EventState {
  phase: EventPhase;
  requiredParticipants: number;
  participants: Record<number, ParticipantState>;
  
  // Controls
  isBlackout: boolean;
  isPaused: boolean;
  customBackgroundHTML: string;
  particleCount: number;
  nodeShape: 'circle' | 'rectangle';
  backgroundType: 'particles' | 'starfield' | 'digital-network';
  explosionType: 'shockwave' | 'golden-burst' | 'supernova';
  trailColor: string;

  // Timeline & Scrubber State
  globalTime: number; // in seconds
  isScrubbing: boolean;
  totalDuration: number;
  
  timelineConfig: {
    countdown: number;
    reveal: number;
    energy: number;
    counter: number;
    finalCharge: number;
    explosion: number;
  };
  
  layout: {
    logo: { x: number; y: number; scale: number };
    counter: { x: number; y: number; scale: number };
    finalMessage: { line1: string; line2: string; x: number; y: number; scale: number };
    cardVietkings: { x: number; y: number; scale: number; endX: number; endY: number };
    cardGAB: { x: number; y: number; scale: number; endX: number; endY: number };
  };
  
  // Actions
  setPhase: (phase: EventPhase) => void;
  setRequiredParticipants: (count: number) => void;
  updateParticipant: (id: number, update: Partial<ParticipantState>) => void;
  resetParticipants: () => void;
  setBlackout: (val: boolean) => void;
  setCustomBackgroundHTML: (html: string) => void;
  setParticleCount: (count: number) => void;
  setNodeShape: (shape: 'circle' | 'rectangle') => void;
  setPaused: (val: boolean) => void;
  setBackgroundType: (type: EventState['backgroundType']) => void;
  setExplosionType: (type: EventState['explosionType']) => void;
  setTrailColor: (color: string) => void;
  setGlobalTime: (time: number) => void;
  setScrubbing: (val: boolean) => void;
  updateTimeline: (phase: keyof EventState['timelineConfig'], seconds: number) => void;
  updateLayout: (component: keyof EventState['layout'], props: any) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  phase: EventPhase.BOOT,
  requiredParticipants: EVENT_CONFIG.participants.required,
  participants: {},
  isBlackout: false,
  isPaused: false,
  customBackgroundHTML: '',
  particleCount: 2000,
  nodeShape: 'rectangle',
  backgroundType: 'particles',
  explosionType: 'shockwave',
  trailColor: '#FACC15', // Yellow
  
  globalTime: 0,
  isScrubbing: false,
  totalDuration: 6 + 3 + 6 + 8 + 2 + 2, // 27 seconds sum of default timelineConfig
  
  timelineConfig: {
    countdown: 6,
    reveal: 3,
    energy: 6,
    counter: 8,
    finalCharge: 2,
    explosion: 2,
  },
  
  layout: {
    logo: { x: 0, y: 0, scale: 1 },
    counter: { x: 0, y: 0, scale: 1 },
    finalMessage: { 
      line1: "CHÚC MỪNG CÁC KỶ LỤC GIA", 
      line2: "ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG", 
      x: 0,
      y: 0, 
      scale: 1 
    },
    cardVietkings: { x: -300, y: -100, scale: 1, endX: -400, endY: -150 },
    cardGAB: { x: 300, y: 100, scale: 1, endX: 400, endY: 150 }
  },
  
  setPhase: (phase) => set({ phase }),
  
  setRequiredParticipants: (count) => {
    set({ requiredParticipants: count });
    get().resetParticipants();
  },
  
  updateParticipant: (id, update) => set((state) => ({
    participants: {
      ...state.participants,
      [id]: {
        ...(state.participants[id] || { id, name: `KLG ${id.toString().padStart(2, '0')}`, status: 'WAITING', progress: 0 }),
        ...update
      }
    }
  })),
  
  resetParticipants: () => set((state) => {
    const newParticipants: Record<number, ParticipantState> = {};
    for(let i=1; i<=state.requiredParticipants; i++) {
      newParticipants[i] = { 
        id: i, 
        name: state.participants[i]?.name ?? `KLG ${i.toString().padStart(2, '0')}`,
        status: 'WAITING', 
        progress: 0 
      };
    }
    return { participants: newParticipants };
  }),
  
  setBlackout: (val) => set({ isBlackout: val }),
  setCustomBackgroundHTML: (html) => set({ customBackgroundHTML: html }),
  setParticleCount: (count) => set({ particleCount: count }),
  setNodeShape: (shape) => set({ nodeShape: shape }),
  setPaused: (val) => set({ isPaused: val }),
  setBackgroundType: (type) => set({ backgroundType: type }),
  setExplosionType: (type) => set({ explosionType: type }),
  setTrailColor: (color) => set({ trailColor: color }),
  setGlobalTime: (time) => set({ globalTime: time }),
  setScrubbing: (val) => set({ isScrubbing: val }),
  updateTimeline: (phase, seconds) => set((state) => {
    const newConfig = { ...state.timelineConfig, [phase]: seconds };
    const total = Object.values(newConfig).reduce((a, b) => a + b, 0);
    return {
      timelineConfig: newConfig,
      totalDuration: total
    };
  }),
  updateLayout: (component, props) => set((state) => ({
    layout: {
      ...state.layout,
      [component]: {
        ...state.layout[component],
        ...props
      }
    }
  }))
}));

const channel = new BroadcastChannel('gab-event-sync');
let isSyncing = false;

let syncTimeout: any;

useEventStore.subscribe((state) => {
  if (!isSyncing) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      channel.postMessage(JSON.stringify(state));
    }, 16); // ~60fps throttle
  }
});

channel.onmessage = (e) => {
  isSyncing = true;
  useEventStore.setState(JSON.parse(e.data));
  isSyncing = false;
};

