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
  language: 'vi' | 'en';
  isBlackout: boolean;
  isPaused: boolean;
  audioEnabled: boolean;
  audioVolume: number;
  showAudioUrl: string | null;
  showAudioVolume: number;
  showAudioLoop: boolean;
  showAudioDucksCues: boolean;
  customBackgroundHTML: string;
  customBackgroundVideo: string | null;
  backgroundVideoOpacity: number;
  backgroundVideoFit: 'cover' | 'contain' | 'fill';
  backgroundVideoPlaybackRate: number;
  backgroundVideoPaused: boolean;
  particleCount: number;
  nodeShape: 'rectangle' | 'circle' | 'hand' | 'card' | 'diamond' | 'hexagon' | 'shield' | 'star' | 'cylinder' | 'ring';
  nodeGlowStyle: 'classic' | 'energy' | 'blinding' | 'neon' | 'plasma' | 'halo';
  allReadyDelay: number; // delay in seconds before countdown starts after all nodes confirmed
  autoAdvanceEnabled: boolean;
  devicePreset: 'led-fhd' | 'led-2k' | 'led-4k' | 'led-ultrawide' | 'laptop' | 'tablet' | 'mobile' | 'custom';
  stageWidth: number;
  stageHeight: number;
  stageFit: 'fill' | 'contain' | 'cover' | 'stretch';
  stageOverscan: number;
  autoDirectorPreset: 'manual' | 'premium-led' | 'high-energy' | 'ceremony' | 'touch-fast';
  touchAutomationMode: 'manual' | 'sequential' | 'burst' | 'instant';
  touchAutomationSpeed: number;
  backgroundType: 'particles' | 'starfield' | 'digital-network' | 'matrix' | 'nebula' | 'quantum' | 'aurora' | 'light-tunnel' | 'scanlines' | 'prism';
  explosionType: 'cosmic-expansion' | 'vortex-spin' | 'supernova' | 'black-hole' | 'confetti' | 'cyber-ring' | 'golden-burst' | 'shockwave' | 'radial-strobe' | 'glass-shatter' | 'data-burst' | 'aurora-flare';
  energyType: 'expert-convergence' | 'laser-matrix' | 'cosmic-vortex' | 'golden-streams' | 'spiral-charge' | 'spirit-bomb' | 'ribbon-weave' | 'orbital-rings' | 'rain-up' | 'heartbeat-pulse' | 'default';
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
  scenarioNames: {
    ceremony: string;
    videoEnergy: string;
    placeCard: string;
  };
  
  timelineConfig: {
    countdown: number;
    reveal: number;
    energy: number;
    counter: number;
    finalCharge: number;
    explosion: number;
  };
  
  layout: {
    countdown: { x: number; y: number; scale: number };
    logo: { x: number; y: number; scale: number };
    counter: { x: number; y: number; scale: number };
    finalMessage: { line1: string; line2: string; x: number; y: number; scale: number };
    cardVietkings: { x: number; y: number; scale: number; endX: number; endY: number };
    cardGAB: { x: number; y: number; scale: number; endX: number; endY: number };
  };
  
  // Actions
  setLanguage: (lang: 'vi' | 'en') => void;
  setPhase: (phase: EventPhase) => void;
  setRequiredParticipants: (count: number) => void;
  updateParticipant: (id: number, update: Partial<ParticipantState>) => void;
  resetParticipants: () => void;
  setBlackout: (val: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setAudioVolume: (volume: number) => void;
  setShowAudioUrl: (url: string | null) => void;
  setShowAudioVolume: (volume: number) => void;
  setShowAudioLoop: (loop: boolean) => void;
  setShowAudioDucksCues: (enabled: boolean) => void;
  setCustomBackgroundHTML: (html: string) => void;
  setCustomBackgroundVideo: (url: string | null) => void;
  setBackgroundVideoOpacity: (opacity: number) => void;
  setBackgroundVideoFit: (fit: EventState['backgroundVideoFit']) => void;
  setBackgroundVideoPlaybackRate: (rate: number) => void;
  setBackgroundVideoPaused: (paused: boolean) => void;
  setParticleCount: (count: number) => void;
  setNodeShape: (shape: EventState['nodeShape']) => void;
  setNodeGlowStyle: (style: EventState['nodeGlowStyle']) => void;
  setAllReadyDelay: (seconds: number) => void;
  setAutoAdvanceEnabled: (enabled: boolean) => void;
  setPaused: (val: boolean) => void;
  setDevicePreset: (preset: EventState['devicePreset']) => void;
  setStageSize: (width: number, height: number) => void;
  setStageFit: (fit: EventState['stageFit']) => void;
  setStageOverscan: (percent: number) => void;
  setAutoDirectorPreset: (preset: EventState['autoDirectorPreset']) => void;
  setTouchAutomationMode: (mode: EventState['touchAutomationMode']) => void;
  setTouchAutomationSpeed: (seconds: number) => void;
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
  setScenarioName: (key: keyof EventState['scenarioNames'], name: string) => void;
  updateTimeline: (phase: keyof EventState['timelineConfig'], seconds: number) => void;
  updateLayout: (component: keyof EventState['layout'], props: any) => void;
  resetLayout: () => void;
}

const createDefaultLayout = (): EventState['layout'] => ({
  countdown: { x: 0, y: 0, scale: 1 },
  logo: { x: 0, y: -35, scale: 1 },
  counter: { x: 0, y: 0, scale: 1 },
  finalMessage: { 
    line1: "CHUC MUNG CAC KY LUC GIA", 
    line2: "DA KICH HOAT THE GAB THANH CONG", 
    x: 0,
    y: -40, 
    scale: 1 
  },
  cardVietkings: { x: -300, y: -100, scale: 1, endX: -430, endY: -170 },
  cardGAB: { x: 300, y: 100, scale: 1, endX: 430, endY: 170 }
});

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      language: 'vi',
      phase: EventPhase.BOOT,
  requiredParticipants: EVENT_CONFIG.participants.required,
  participants: {},
  isBlackout: false,
  isPaused: false,
  audioEnabled: true,
  audioVolume: 0.75,
  showAudioUrl: null,
  showAudioVolume: 0.65,
  showAudioLoop: false,
  showAudioDucksCues: true,
  customBackgroundHTML: '',
  customBackgroundVideo: null,
  backgroundVideoOpacity: 1,
  backgroundVideoFit: 'cover',
  backgroundVideoPlaybackRate: 1,
  backgroundVideoPaused: false,
  particleCount: 2000,
  nodeShape: 'rectangle',
  nodeGlowStyle: 'energy',
  allReadyDelay: 1.5,
  autoAdvanceEnabled: false,
  devicePreset: 'led-fhd',
  stageWidth: 1920,
  stageHeight: 1080,
  stageFit: 'fill',
  stageOverscan: 0,
  autoDirectorPreset: 'manual',
  touchAutomationMode: 'manual',
  touchAutomationSpeed: 0.35,
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
  scenarioNames: {
    ceremony: 'S1 GAB Ceremony Core',
    videoEnergy: 'S2 Video Energy 0328',
    placeCard: 'S3 PlaceCard Visual'
  },
  
  timelineConfig: {
    countdown: 6,
    reveal: 3,
    energy: 6,
    counter: 8,
    finalCharge: 2,
    explosion: 2,
  },
  
  layout: createDefaultLayout(),
  
  setLanguage: (lang) => set({ language: lang }),
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
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  setAudioVolume: (volume) => set({ audioVolume: Math.max(0, Math.min(1, volume)) }),
  setShowAudioUrl: (url) => set({ showAudioUrl: url }),
  setShowAudioVolume: (volume) => set({ showAudioVolume: Math.max(0, Math.min(1, volume)) }),
  setShowAudioLoop: (loop) => set({ showAudioLoop: loop }),
  setShowAudioDucksCues: (enabled) => set({ showAudioDucksCues: enabled }),
  setCustomBackgroundHTML: (html) => set({ customBackgroundHTML: html }),
  setCustomBackgroundVideo: (url) => set({ customBackgroundVideo: url }),
  setBackgroundVideoOpacity: (opacity) => set({ backgroundVideoOpacity: opacity }),
  setBackgroundVideoFit: (fit) => set({ backgroundVideoFit: fit }),
  setBackgroundVideoPlaybackRate: (rate) => set({ backgroundVideoPlaybackRate: rate }),
  setBackgroundVideoPaused: (paused) => set({ backgroundVideoPaused: paused }),
  setParticleCount: (count) => set({ particleCount: count }),
  setNodeShape: (shape) => set({ nodeShape: shape }),
  setNodeGlowStyle: (style) => set({ nodeGlowStyle: style }),
  setAllReadyDelay: (seconds) => set({ allReadyDelay: seconds }),
  setAutoAdvanceEnabled: (enabled) => set({ autoAdvanceEnabled: enabled }),
  setPaused: (val) => set({ isPaused: val }),
  setDevicePreset: (preset) => set(() => {
    const sizes: Record<EventState['devicePreset'], { width: number; height: number }> = {
      'led-fhd': { width: 1920, height: 1080 },
      'led-2k': { width: 2560, height: 1440 },
      'led-4k': { width: 3840, height: 2160 },
      'led-ultrawide': { width: 3840, height: 1080 },
      laptop: { width: 1440, height: 900 },
      tablet: { width: 1024, height: 1366 },
      mobile: { width: 390, height: 844 },
      custom: { width: get().stageWidth, height: get().stageHeight },
    };
    return { devicePreset: preset, ...sizes[preset] };
  }),
  setStageSize: (width, height) => set({ stageWidth: width, stageHeight: height, devicePreset: 'custom' }),
  setStageFit: (fit) => set({ stageFit: fit }),
  setStageOverscan: (percent) => set({ stageOverscan: percent }),
  setAutoDirectorPreset: (preset) => set({ autoDirectorPreset: preset }),
  setTouchAutomationMode: (mode) => set({ touchAutomationMode: mode }),
  setTouchAutomationSpeed: (seconds) => set({ touchAutomationSpeed: seconds }),
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
      language: state.language,
      requiredParticipants: state.requiredParticipants,
      particleCount: state.particleCount,
      nodeShape: state.nodeShape,
      nodeGlowStyle: state.nodeGlowStyle,
      allReadyDelay: state.allReadyDelay,
      autoAdvanceEnabled: state.autoAdvanceEnabled,
      devicePreset: state.devicePreset,
      stageWidth: state.stageWidth,
      stageHeight: state.stageHeight,
      stageFit: state.stageFit,
      stageOverscan: state.stageOverscan,
      autoDirectorPreset: state.autoDirectorPreset,
      touchAutomationMode: state.touchAutomationMode,
      touchAutomationSpeed: state.touchAutomationSpeed,
      backgroundType: state.backgroundType,
      explosionType: state.explosionType,
      energyType: state.energyType,
      trailColor: state.trailColor,
      backgroundColor: state.backgroundColor,
      explosionColor: state.explosionColor,
      customBackgroundVideo: state.customBackgroundVideo?.startsWith('blob:') ? null : state.customBackgroundVideo,
      backgroundVideoOpacity: state.backgroundVideoOpacity,
      backgroundVideoFit: state.backgroundVideoFit,
      backgroundVideoPlaybackRate: state.backgroundVideoPlaybackRate,
      backgroundVideoPaused: state.backgroundVideoPaused,
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
      audioEnabled: state.audioEnabled,
      audioVolume: state.audioVolume,
      showAudioUrl: state.showAudioUrl?.startsWith('blob:') ? null : state.showAudioUrl,
      showAudioVolume: state.showAudioVolume,
      showAudioLoop: state.showAudioLoop,
      showAudioDucksCues: state.showAudioDucksCues,
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
  setScenarioName: (key, name) => set((state) => ({
    scenarioNames: {
      ...state.scenarioNames,
      [key]: name
    }
  })),

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
  })),
  resetLayout: () => set({ layout: createDefaultLayout() })
}), {
  name: 'gab-event-storage',
  version: 4,
  migrate: (persistedState: any, version) => {
    if (version < 2) {
      return {
        ...persistedState,
        devicePreset: persistedState?.devicePreset ?? 'led-fhd',
        stageWidth: persistedState?.stageWidth ?? 1920,
        stageHeight: persistedState?.stageHeight ?? 1080,
        stageFit: persistedState?.stageFit === 'contain' ? 'fill' : (persistedState?.stageFit ?? 'fill'),
        stageOverscan: persistedState?.stageOverscan ?? 0,
        backgroundVideoOpacity: persistedState?.backgroundVideoOpacity ?? 1,
        backgroundVideoFit: persistedState?.backgroundVideoFit ?? 'cover',
        backgroundVideoPlaybackRate: persistedState?.backgroundVideoPlaybackRate ?? 1,
        backgroundVideoPaused: persistedState?.backgroundVideoPaused ?? false,
        nodeGlowStyle: persistedState?.nodeGlowStyle ?? 'energy',
        scenarioNames: persistedState?.scenarioNames ?? {
          ceremony: 'S1 GAB Ceremony Core',
          videoEnergy: 'S2 Video Energy 0328',
          placeCard: 'S3 PlaceCard Visual'
        },
        audioEnabled: persistedState?.audioEnabled ?? true,
        audioVolume: persistedState?.audioVolume ?? 0.75,
        showAudioUrl: persistedState?.showAudioUrl ?? null,
        showAudioVolume: persistedState?.showAudioVolume ?? 0.65,
        showAudioLoop: persistedState?.showAudioLoop ?? false,
        showAudioDucksCues: persistedState?.showAudioDucksCues ?? true,
      };
    }
    if (version < 3) {
      return {
        ...persistedState,
        audioEnabled: persistedState?.audioEnabled ?? true,
        audioVolume: persistedState?.audioVolume ?? 0.75,
        showAudioUrl: persistedState?.showAudioUrl ?? null,
        showAudioVolume: persistedState?.showAudioVolume ?? 0.65,
        showAudioLoop: persistedState?.showAudioLoop ?? false,
        showAudioDucksCues: persistedState?.showAudioDucksCues ?? true,
      };
    }
    if (version < 4) {
      return {
        ...persistedState,
        showAudioUrl: persistedState?.showAudioUrl ?? null,
        showAudioVolume: persistedState?.showAudioVolume ?? 0.65,
        showAudioLoop: persistedState?.showAudioLoop ?? false,
        showAudioDucksCues: persistedState?.showAudioDucksCues ?? true,
      };
    }
    return persistedState;
  },
  partialize: (state) => ({
    phase: state.phase,
    language: state.language,
    requiredParticipants: state.requiredParticipants,
    isBlackout: state.isBlackout,
    isPaused: state.isPaused,
    audioEnabled: state.audioEnabled,
    audioVolume: state.audioVolume,
    showAudioUrl: state.showAudioUrl?.startsWith('blob:') ? null : state.showAudioUrl,
    showAudioVolume: state.showAudioVolume,
    showAudioLoop: state.showAudioLoop,
    showAudioDucksCues: state.showAudioDucksCues,
    particleCount: state.particleCount,
    nodeShape: state.nodeShape,
    nodeGlowStyle: state.nodeGlowStyle,
    allReadyDelay: state.allReadyDelay,
    autoAdvanceEnabled: state.autoAdvanceEnabled,
    devicePreset: state.devicePreset,
    stageWidth: state.stageWidth,
    stageHeight: state.stageHeight,
    stageFit: state.stageFit,
    stageOverscan: state.stageOverscan,
    autoDirectorPreset: state.autoDirectorPreset,
    touchAutomationMode: state.touchAutomationMode,
    touchAutomationSpeed: state.touchAutomationSpeed,
    backgroundType: state.backgroundType,
    explosionType: state.explosionType,
    energyType: state.energyType,
    trailColor: state.trailColor,
    backgroundColor: state.backgroundColor,
    explosionColor: state.explosionColor,
    customBackgroundVideo: state.customBackgroundVideo?.startsWith('blob:') ? null : state.customBackgroundVideo,
    backgroundVideoOpacity: state.backgroundVideoOpacity,
    backgroundVideoFit: state.backgroundVideoFit,
    backgroundVideoPlaybackRate: state.backgroundVideoPlaybackRate,
    backgroundVideoPaused: state.backgroundVideoPaused,
    globalTime: state.globalTime,
    totalDuration: state.totalDuration,
    isScrubbing: false,
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
    savedProfiles: state.savedProfiles,
    scenarioNames: state.scenarioNames
  })
}));

// Efficient BroadcastChannel sync with senderId to eliminate ping-pong loops and lag
const myInstanceId = Math.random().toString(36).substring(2, 9);
const channel = new BroadcastChannel('gab-event-sync');
const isOperatorInstance = window.location.pathname.startsWith('/operator');
const isEditPreviewInstance = window.location.search.includes('edit=true');
let isReceivingExternalUpdate = false;
let syncTimeout: any;

const pickPreviewEditableState = (state: EventState) => ({
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
});

useEventStore.subscribe((state) => {
  if (isReceivingExternalUpdate) return;
  if (!isOperatorInstance && !isEditPreviewInstance) return;
  
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    try {
      channel.postMessage({
        senderId: myInstanceId,
        type: isOperatorInstance ? 'state-update' : 'preview-edit-update',
        source: isOperatorInstance ? 'operator' : 'preview',
        state: isOperatorInstance ? state : pickPreviewEditableState(state)
      });
    } catch {
      // Ignore serialization errors
    }
  }, isOperatorInstance ? 25 : 80);
});

channel.onmessage = (e) => {
  if (!e.data || e.data.senderId === myInstanceId) return;

  if (e.data.type === 'sync-request' && isOperatorInstance) {
    channel.postMessage({
      senderId: myInstanceId,
      type: 'state-update',
      source: 'operator',
      state: useEventStore.getState()
    });
    return;
  }
  
  if (e.data.type === 'preview-edit-update') {
    if (!isOperatorInstance || !e.data.state) return;
    isReceivingExternalUpdate = true;
    useEventStore.setState((state) => ({
      ...state,
      ...e.data.state
    }));
    setTimeout(() => {
      isReceivingExternalUpdate = false;
    }, 10);
    return;
  }

  if (e.data.type === 'state-update' && e.data.state) {
    if (e.data.source !== 'operator' && !isOperatorInstance) return;
    if (e.data.source !== 'operator' && isOperatorInstance) return;
    isReceivingExternalUpdate = true;
    useEventStore.setState(e.data.state);
    setTimeout(() => {
      isReceivingExternalUpdate = false;
    }, 10);
  }
};

window.addEventListener('storage', (event) => {
  if (event.key !== 'gab-event-storage' || !event.newValue) return;
  if (isReceivingExternalUpdate) return;
  if (isOperatorInstance || isEditPreviewInstance) return;

  try {
    const parsed = JSON.parse(event.newValue);
    if (!parsed?.state) return;

    isReceivingExternalUpdate = true;
    useEventStore.setState(parsed.state);
    window.setTimeout(() => {
      isReceivingExternalUpdate = false;
    }, 10);
  } catch {
    // Ignore malformed storage payloads.
  }
});

if (!isOperatorInstance) {
  window.setTimeout(() => {
    channel.postMessage({
      senderId: myInstanceId,
      type: 'sync-request',
      source: isEditPreviewInstance ? 'preview' : 'led'
    });
  }, 50);
}

