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
  customBackgroundHTML: string;
  particleCount: number;
  nodeShape: 'circle' | 'rectangle';
  
  // Actions
  setPhase: (phase: EventPhase) => void;
  setRequiredParticipants: (count: number) => void;
  updateParticipant: (id: number, update: Partial<ParticipantState>) => void;
  resetParticipants: () => void;
  setBlackout: (val: boolean) => void;
  setCustomBackgroundHTML: (html: string) => void;
  setParticleCount: (count: number) => void;
  setNodeShape: (shape: 'circle' | 'rectangle') => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  phase: EventPhase.BOOT,
  requiredParticipants: EVENT_CONFIG.participants.required,
  participants: {},
  isBlackout: false,
  customBackgroundHTML: '',
  particleCount: 2000,
  nodeShape: 'rectangle',
  
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
        name: state.participants[i]?.name || `KLG ${i.toString().padStart(2, '0')}`,
        status: 'WAITING', 
        progress: 0 
      };
    }
    return { participants: newParticipants };
  }),
  
  setBlackout: (val) => set({ isBlackout: val }),
  setCustomBackgroundHTML: (html) => set({ customBackgroundHTML: html }),
  setParticleCount: (count) => set({ particleCount: count }),
  setNodeShape: (shape) => set({ nodeShape: shape })
}));

const channel = new BroadcastChannel('gab-event-sync');
let isSyncing = false;

useEventStore.subscribe((state) => {
  if (!isSyncing) {
    channel.postMessage(JSON.stringify(state));
  }
});

channel.onmessage = (e) => {
  isSyncing = true;
  useEventStore.setState(JSON.parse(e.data));
  isSyncing = false;
};

