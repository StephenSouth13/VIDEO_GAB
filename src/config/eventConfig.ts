export const EVENT_CONFIG = {
  eventName: "GAB Interactive Card Activation",

  participants: {
    required: 12, // Default
    min: 8,
    max: 15,
    holdTimeMs: 1200
  },

  countdown: {
    seconds: 5
  },

  counter: {
    finalValue: 400,
    suffix: "+"
  },

  activation: {
    mode: "confirm-once" // or "continuous-hold"
  },

  sensor: {
    mode: "mock" // "mock" | "keyboard" | "websocket"
  },

  visual: {
    showVietKings: true,
    showGabCard: true,
    enableBloom: true,
    enableParticles: true,
    enableMeteors: true,
    enableExplosion: true,
    quality: "HIGH" // LOW | MEDIUM | HIGH | ULTRA
  },

  finalMessage: {
    line1: "CHÚC MỪNG CÁC KỶ LỤC GIA",
    line2: "ĐÃ KÍCH HOẠT THẺ GAB THÀNH CÔNG"
  },
  
  holdFinalIndefinitely: true,
  useVideoBackground: false
};
