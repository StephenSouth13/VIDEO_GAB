export interface SensorAdapter {
  connect(): Promise<void>;
  disconnect(): void;
}

// Lắng nghe Keyboard để test
import { eventController } from '../core/EventController';

export class KeyboardSensorAdapter implements SensorAdapter {
  private boundHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.boundHandler = this.handleKeyDown.bind(this);
  }

  async connect() {
    window.addEventListener('keydown', this.boundHandler);
  }

  disconnect() {
    window.removeEventListener('keydown', this.boundHandler);
  }

  private handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toUpperCase();
    
    // Map keys 1-9 to participants 1-9
    if (e.key >= '1' && e.key <= '9') {
      const id = parseInt(e.key);
      eventController.confirmParticipant(id);
    }
    // Map QWERTY for 10-15
    const extendedMap: Record<string, number> = {
      'Q': 10, 'W': 11, 'E': 12, 'R': 13, 'T': 14, 'Y': 15
    };
    if (extendedMap[key]) {
      eventController.confirmParticipant(extendedMap[key]);
    }

    if (e.code === 'Space') {
      eventController.skipToNextPhase();
    }
    if (key === 'A') {
      eventController.activateAll();
    }
    if (key === 'Z') {
      eventController.resetEvent();
    }
    if (key === 'B') {
      eventController.toggleBlackout();
    }
  }
}
