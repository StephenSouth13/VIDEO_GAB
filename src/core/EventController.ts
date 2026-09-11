import { useEventStore, EventPhase } from '../stores/useEventStore';
import { EVENT_CONFIG } from '../config/eventConfig';

export class EventController {
  private static instance: EventController;
  private countdownTimer: number | null = null;

  private constructor() {}

  public static getInstance(): EventController {
    if (!EventController.instance) {
      EventController.instance = new EventController();
    }
    return EventController.instance;
  }

  public boot() {
    const store = useEventStore.getState();
    store.resetParticipants();
    store.setPhase(EventPhase.IDLE);
  }

  public startWaiting() {
    useEventStore.getState().setPhase(EventPhase.WAITING_FOR_PARTICIPANTS);
  }

  public confirmParticipant(id: number) {
    const store = useEventStore.getState();
    if (store.phase !== EventPhase.WAITING_FOR_PARTICIPANTS && store.phase !== EventPhase.PARTICIPANT_CONFIRMING) {
      return;
    }

    store.updateParticipant(id, { status: 'CONFIRMED', progress: 100 });
    
    // Check if all are confirmed
    const state = useEventStore.getState();
    let confirmedCount = 0;
    for (let i = 1; i <= state.requiredParticipants; i++) {
      if (state.participants[i]?.status === 'CONFIRMED') {
        confirmedCount++;
      }
    }
    
    if (confirmedCount === state.requiredParticipants) {
      this.allParticipantsReady();
    } else {
      store.setPhase(EventPhase.PARTICIPANT_CONFIRMING);
    }
  }

  public unconfirmParticipant(id: number) {
    const store = useEventStore.getState();
    if (store.phase === EventPhase.WAITING_FOR_PARTICIPANTS || store.phase === EventPhase.PARTICIPANT_CONFIRMING) {
       store.updateParticipant(id, { status: 'WAITING', progress: 0 });
    }
  }

  private allParticipantsReady() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.ALL_PARTICIPANTS_READY);
    
    // Auto start countdown after a short delay for synchronization visual
    setTimeout(() => {
      this.startCountdown();
    }, 1500);
  }

  public startCountdown() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.COUNTDOWN);
    
    // Countdown is visually handled by a component that watches phase, 
    // but the controller coordinates the next state
    if (this.countdownTimer) clearTimeout(this.countdownTimer);
    
    this.countdownTimer = window.setTimeout(() => {
      this.triggerReveal();
    }, EVENT_CONFIG.countdown.seconds * 1000 + 1000); // Wait for countdown to finish + 1 sec
  }

  public cancelCountdown() {
    if (this.countdownTimer) clearTimeout(this.countdownTimer);
    useEventStore.getState().setPhase(EventPhase.WAITING_FOR_PARTICIPANTS);
  }

  private triggerReveal() {
    useEventStore.getState().setPhase(EventPhase.GAB_REVEAL);
    setTimeout(() => this.triggerEnergyConvergence(), 3000);
  }

  private triggerEnergyConvergence() {
    useEventStore.getState().setPhase(EventPhase.ENERGY_CONVERGENCE);
    setTimeout(() => this.triggerCounterSequence(), 6000); // 6s of streams
  }
  
  private triggerCounterSequence() {
    useEventStore.getState().setPhase(EventPhase.COUNTER_SEQUENCE);
    setTimeout(() => this.triggerFinalCharge(), 8000); // 8s of counter
  }

  private triggerFinalCharge() {
    useEventStore.getState().setPhase(EventPhase.FINAL_CHARGE);
    setTimeout(() => this.triggerExplosion(), 2000); // 2s final hold
  }

  private triggerExplosion() {
    useEventStore.getState().setPhase(EventPhase.EXPLOSION);
    setTimeout(() => this.showFinalScreen(), 2000); // 2s explosion
  }

  public showFinalScreen() {
    useEventStore.getState().setPhase(EventPhase.SUCCESS);
  }
  
  public skipToNextPhase() {
    const currentPhase = useEventStore.getState().phase;
    const phases = Object.values(EventPhase);
    const idx = phases.indexOf(currentPhase);
    if (idx < phases.length - 1) {
      useEventStore.getState().setPhase(phases[idx + 1]);
    }
  }

  public activateAll() {
    const store = useEventStore.getState();
    if(store.phase === EventPhase.SUCCESS) return;
    
    for (let i = 1; i <= store.requiredParticipants; i++) {
      store.updateParticipant(i, { status: 'CONFIRMED', progress: 100 });
    }
    this.allParticipantsReady();
  }

  public resetEvent() {
    if (this.countdownTimer) clearTimeout(this.countdownTimer);
    const store = useEventStore.getState();
    store.setPhase(EventPhase.RESETTING);
    store.resetParticipants();
    setTimeout(() => {
      store.setPhase(EventPhase.IDLE);
    }, 1000);
  }
  
  public replayEvent() {
    this.resetEvent();
    setTimeout(() => {
      this.activateAll();
    }, 1500);
  }

  public runDemo() {
    this.boot();
    this.startWaiting();
    const store = useEventStore.getState();
    let current = 1;
    
    // Simulate people placing hands one by one
    const interval = setInterval(() => {
      if (current <= store.requiredParticipants) {
        this.confirmParticipant(current);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  }

  public toggleBlackout() {
    const store = useEventStore.getState();
    store.setBlackout(!store.isBlackout);
  }
}

export const eventController = EventController.getInstance();
