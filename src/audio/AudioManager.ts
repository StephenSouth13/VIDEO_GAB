import { Howl, Howler } from 'howler';

class AudioManager {
  private static instance: AudioManager;
  
  private sounds: Record<string, Howl> = {};
  public isMuted = false;

  private constructor() {
    // Tạm thời để mảng rỗng hoặc load file trống để không lỗi
    // Fallback: app không crash nếu ko có file.
    this.loadSound('ambient', '/assets/audio/ambient.mp3', { loop: true, volume: 0.3 });
    this.loadSound('confirm', '/assets/audio/confirm.mp3');
    this.loadSound('countdown', '/assets/audio/countdown.mp3');
    this.loadSound('explosion', '/assets/audio/explosion.mp3');
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private loadSound(key: string, src: string, options: any = {}) {
    this.sounds[key] = new Howl({
      src: [src],
      onloaderror: () => console.warn(`Audio ${src} not found, silent fallback used.`),
      ...options
    });
  }

  public play(key: string) {
    if (this.isMuted) return;
    if (this.sounds[key]) {
      this.sounds[key].play();
    }
  }
  
  public stop(key: string) {
    if (this.sounds[key]) {
      this.sounds[key].stop();
    }
  }
  
  public setMute(mute: boolean) {
    this.isMuted = mute;
    Howler.mute(mute);
  }
}

export const audioManager = AudioManager.getInstance();
