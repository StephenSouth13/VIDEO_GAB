type CueName =
  | 'touch'
  | 'ready'
  | 'countdown'
  | 'reveal'
  | 'energy'
  | 'counter'
  | 'charge'
  | 'explosion'
  | 'final';

class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private hum: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private muted = false;
  private volume = 0.75;

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public async unlock() {
    const context = this.getContext();
    if (context.state === 'suspended') {
      await context.resume();
    }
  }

  public setMute(mute: boolean) {
    this.muted = mute;
    this.updateMaster();
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.updateMaster();
  }

  public stopAll() {
    this.stopHum();
  }

  public play(cue: CueName) {
    if (this.muted) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    if (cue === 'touch') {
      this.tone(760, 0.06, 0.16, 'sine');
      this.tone(1140, 0.08, 0.08, 'triangle', 0.015);
    } else if (cue === 'ready') {
      this.tone(440, 0.18, 0.18, 'sine');
      this.tone(660, 0.22, 0.14, 'sine', 0.08);
      this.tone(990, 0.25, 0.11, 'triangle', 0.16);
    } else if (cue === 'countdown') {
      this.kick(0.42, 82);
      this.tone(220, 0.11, 0.18, 'square');
      this.noise(0.08, 0.08, 'highpass', 900);
    } else if (cue === 'reveal') {
      this.sweep(160, 880, 1.2, 0.16);
      this.tone(523.25, 0.35, 0.12, 'sine', 0.3);
      this.tone(783.99, 0.45, 0.1, 'sine', 0.42);
    } else if (cue === 'energy') {
      this.startHum(96, 0.09);
      this.sweep(320, 1200, 1.8, 0.08);
    } else if (cue === 'counter') {
      this.tone(330, 0.1, 0.13, 'triangle');
      this.tone(660, 0.12, 0.08, 'triangle', 0.05);
    } else if (cue === 'charge') {
      this.startHum(128, 0.14);
      this.sweep(120, 1800, 2.0, 0.16);
    } else if (cue === 'explosion') {
      this.stopHum();
      this.kick(1.2, 48);
      this.noise(1.0, 0.5, 'lowpass', 1200);
      this.sweep(900, 70, 0.8, 0.18);
    } else if (cue === 'final') {
      this.stopHum();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        this.tone(freq, 0.55, 0.11, 'sine', i * 0.11);
      });
    }

    // Keep the context referenced so browser does not garbage collect short graphs too early.
    void now;
  }

  private getContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      this.updateMaster();
    }
    return this.ctx;
  }

  private updateMaster() {
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
  }

  private tone(freq: number, duration: number, gainValue: number, type: OscillatorType, delay = 0) {
    const ctx = this.getContext();
    if (!this.master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.04);
  }

  private sweep(start: number, end: number, duration: number, gainValue: number) {
    const ctx = this.getContext();
    if (!this.master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(start, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(end, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  private kick(duration: number, startFreq: number) {
    const ctx = this.getContext();
    if (!this.master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq * 3, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.03);
  }

  private noise(duration: number, gainValue: number, filterType: BiquadFilterType, freq: number) {
    const ctx = this.getContext();
    if (!this.master) return;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start();
  }

  private startHum(freq: number, gainValue: number) {
    const ctx = this.getContext();
    if (!this.master) return;
    if (!this.hum) {
      this.hum = ctx.createOscillator();
      this.humGain = ctx.createGain();
      this.hum.type = 'sawtooth';
      this.hum.connect(this.humGain);
      this.humGain.connect(this.master);
      this.hum.start();
    }
    this.hum.frequency.setTargetAtTime(freq, ctx.currentTime, 0.12);
    this.humGain?.gain.setTargetAtTime(gainValue, ctx.currentTime, 0.2);
  }

  private stopHum() {
    if (!this.ctx || !this.humGain) return;
    this.humGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
  }
}

export const audioManager = AudioManager.getInstance();
