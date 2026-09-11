import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  backgroundType: 'particles' | 'starfield' | 'digital-network' | 'matrix' | 'nebula' | 'quantum';
  explosionType: 'cosmic-expansion' | 'vortex-spin' | 'supernova' | 'black-hole' | 'confetti' | 'cyber-ring' | 'golden-burst' | 'shockwave';
  energyType: 'expert-convergence' | 'laser-matrix' | 'cosmic-vortex' | 'golden-streams' | 'spiral-charge' | 'spirit-bomb' | 'default';
  trailColor: string;
  backgroundColor: string;
  explosionColor: string;
  
  // Custom Assets & Ending Layout
  customLogoCenter: string | null;
  customLogoFly1: string | null;
  customLogoFly2: string | null;
  showCardVietkings: boolean;
  showCardGAB: boolean;
  showCenterLogoFinal: boolean;
  finalTemplate: 'dual-cards' | 'center-hero' | 'top-sponsors' | 'cyber-hologram' | 'golden-prestige' | 'minimal-clean';
  finalCardVietkingsConfig: { scale: number; rotate: number };
  finalCardGABConfig: { scale: number; rotate: number };

  // Timeline & Scrubber State
  globalTime: number; // in seconds
  isScrubbing: boolean;
  totalDuration: number;
  
  // Display Options
  showNodes: boolean;

  // Profile Manager
  savedProfiles: Record<string, any>;
  
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
  setEnergyType: (type: EventState['energyType']) => void;
  setTrailColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setExplosionColor: (color: string) => void;
  setCustomLogo: (key: 'customLogoCenter' | 'customLogoFly1' | 'customLogoFly2', base64: string | null) => void;
  setShowCardVietkings: (val: boolean) => void;
  setShowCardGAB: (val: boolean) => void;
  setShowCenterLogoFinal: (val: boolean) => void;
  setFinalTemplate: (template: EventState['finalTemplate']) => void;
  updateCardConfig: (card: 'vietkings' | 'gab', config: { scale?: number; rotate?: number }) => void;
  setGlobalTime: (time: number) => void;
  setScrubbing: (val: boolean) => void;
  setShowNodes: (val: boolean) => void;
  saveProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
  updateTimeline: (phase: keyof EventState['timelineConfig'], seconds: number) => void;
  updateLayout: (component: keyof EventState['layout'], props: any) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      phase: EventPhase.BOOT,
  requiredParticipants: EVENT_CONFIG.participants.required,
  participants: {},
  isBlackout: false,
  isPaused: false,
  customBackgroundHTML: '',
  particleCount: 2000,
  nodeShape: 'rectangle',
  backgroundType: 'particles',
  explosionType: 'cosmic-expansion',
  energyType: 'expert-convergence',
  trailColor: '#FACC15', // Yellow
  backgroundColor: '#050810',
  explosionColor: '#00F0FF',
  
  customLogoCenter: null,
  customLogoFly1: null,
  customLogoFly2: null,
  showCardVietkings: true,
  showCardGAB: true,
  showCenterLogoFinal: false,
  finalTemplate: 'dual-cards',
  finalCardVietkingsConfig: { scale: 1, rotate: -15 },
  finalCardGABConfig: { scale: 1, rotate: 10 },
  
  globalTime: 0,
  isScrubbing: false,
  totalDuration: 6 + 3 + 6 + 8 + 2 + 2, // 27 seconds sum of default timelineConfig
  
  showNodes: true,
  savedProfiles: {},
  
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
  setEnergyType: (type) => set({ energyType: type }),
  setTrailColor: (color) => set({ trailColor: color }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setExplosionColor: (color) => set({ explosionColor: color }),
  setCustomLogo: (key, base64) => set({ [key]: base64 }),
  setShowCardVietkings: (val) => set({ showCardVietkings: val }),
  setShowCardGAB: (val) => set({ showCardGAB: val }),
  setShowCenterLogoFinal: (val) => set({ showCenterLogoFinal: val }),
  setFinalTemplate: (template) => set({ finalTemplate: template }),
  updateCardConfig: (card, config) => set((state) => ({
    ...(card === 'vietkings' 
      ? { finalCardVietkingsConfig: { ...state.finalCardVietkingsConfig, ...config } }
      : { finalCardGABConfig: { ...state.finalCardGABConfig, ...config } })
  })),
  setGlobalTime: (time) => set({ globalTime: time }),
  setScrubbing: (val) => set({ isScrubbing: val }),
  setShowNodes: (val) => set({ showNodes: val }),
  
  saveProfile: (name) => set((state) => {
    // Only save configurable properties
    const profileToSave = {
      requiredParticipants: state.requiredParticipants,
      particleCount: state.particleCount,
      nodeShape: state.nodeShape,
      backgroundType: state.backgroundType,
      explosionType: state.explosionType,
      energyType: state.energyType,
      trailColor: state.trailColor,
      backgroundColor: state.backgroundColor,
      explosionColor: state.explosionColor,
      timelineConfig: state.timelineConfig,
      layout: state.layout,
      customLogoCenter: state.customLogoCenter,
      customLogoFly1: state.customLogoFly1,
      customLogoFly2: state.customLogoFly2,
      showCardVietkings: state.showCardVietkings,
      showCardGAB: state.showCardGAB,
      showCenterLogoFinal: state.showCenterLogoFinal,
      finalTemplate: state.finalTemplate,
      finalCardVietkingsConfig: state.finalCardVietkingsConfig,
      finalCardGABConfig: state.finalCardGABConfig,
      showNodes: state.showNodes,
    };
    return {
      savedProfiles: {
        ...state.savedProfiles,
        [name]: profileToSave
      }
    };
  }),

  loadProfile: (name) => set((state) => {
    const profile = state.savedProfiles[name];
    if (profile) {
      // Recalculate duration
      const total = Object.values(profile.timelineConfig).reduce((a: any, b: any) => a + b, 0) as number;
      return {
        ...profile,
        totalDuration: total
      };
    }
    return state;
  }),

  deleteProfile: (name) => set((state) => {
    const newProfiles = { ...state.savedProfiles };
    delete newProfiles[name];
    return { savedProfiles: newProfiles };
  }),

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
}), {
  name: 'gab-event-storage',
  partialize: (state) => ({
    requiredParticipants: state.requiredParticipants,
    particleCount: state.particleCount,
    nodeShape: state.nodeShape,
    backgroundType: state.backgroundType,
    explosionType: state.explosionType,
    energyType: state.energyType,
    trailColor: state.trailColor,
    backgroundColor: state.backgroundColor,
    explosionColor: state.explosionColor,
    timelineConfig: state.timelineConfig,
    layout: state.layout,
    customLogoCenter: state.customLogoCenter,
    customLogoFly1: state.customLogoFly1,
    customLogoFly2: state.customLogoFly2,
    showCardVietkings: state.showCardVietkings,
    showCardGAB: state.showCardGAB,
    showCenterLogoFinal: state.showCenterLogoFinal,
    finalTemplate: state.finalTemplate,
    finalCardVietkingsConfig: state.finalCardVietkingsConfig,
    finalCardGABConfig: state.finalCardGABConfig,
    participants: state.participants,
    showNodes: state.showNodes,
    savedProfiles: state.savedProfiles
  })
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

