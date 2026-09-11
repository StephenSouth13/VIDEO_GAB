import { useEventStore, EventPhase } from '../stores/useEventStore';
import { EVENT_CONFIG } from '../config/eventConfig';

class PausableTimer {
  private timerId: number | null = null;
  private start: number;
  private remaining: number;
  private callback: () => void;

  constructor(callback: () => void, delay: number) {
    this.callback = callback;
    this.remaining = delay;
    this.start = Date.now();
    this.resume();
  }

  pause() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
      this.remaining -= Date.now() - this.start;
    }
  }

  resume() {
    if (this.timerId === null && this.remaining > 0) {
      this.start = Date.now();
      this.timerId = window.setTimeout(this.callback, this.remaining);
    }
  }

  clear() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

export class EventController {
  private static instance: EventController;
  private currentTimer: PausableTimer | null = null;

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
    this.setTimer(() => {
      this.startCountdown();
    }, 1500);
  }

  private setTimer(cb: () => void, delay: number) {
    if (this.currentTimer) this.currentTimer.clear();
    this.currentTimer = new PausableTimer(cb, delay);
    
    // If we're already paused, pause the new timer immediately
    if (useEventStore.getState().isPaused) {
      this.currentTimer.pause();
    }
  }

  public startCountdown() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.COUNTDOWN);
    
    this.setTimer(() => {
      this.triggerReveal();
    }, store.timelineConfig.countdown * 1000);
  }

  public cancelCountdown() {
    if (this.currentTimer) this.currentTimer.clear();
    useEventStore.getState().setPhase(EventPhase.WAITING_FOR_PARTICIPANTS);
  }

  private triggerReveal() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.GAB_REVEAL);
    this.setTimer(() => this.triggerEnergyConvergence(), store.timelineConfig.reveal * 1000);
  }

  private triggerEnergyConvergence() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.ENERGY_CONVERGENCE);
    this.setTimer(() => this.triggerCounterSequence(), store.timelineConfig.energy * 1000);
  }
  
  private triggerCounterSequence() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.COUNTER_SEQUENCE);
    this.setTimer(() => this.triggerFinalCharge(), store.timelineConfig.counter * 1000);
  }

  private triggerFinalCharge() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.FINAL_CHARGE);
    this.setTimer(() => this.triggerExplosion(), store.timelineConfig.finalCharge * 1000);
  }

  private triggerExplosion() {
    const store = useEventStore.getState();
    store.setPhase(EventPhase.EXPLOSION);
    this.setTimer(() => this.showFinalScreen(), store.timelineConfig.explosion * 1000);
  }

  public showFinalScreen() {
    useEventStore.getState().setPhase(EventPhase.SUCCESS);
  }
  
  public skipToNextPhase() {
    if (this.currentTimer) this.currentTimer.clear();
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
    if (this.currentTimer) this.currentTimer.clear();
    const store = useEventStore.getState();
    store.setPhase(EventPhase.RESETTING);
    store.setPaused(false);
    store.resetParticipants();
    this.setTimer(() => {
      store.setPhase(EventPhase.IDLE);
    }, 1000);
  }
  
  public replayEvent() {
    this.resetEvent();
    this.setTimer(() => {
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
  
  public togglePause() {
    const store = useEventStore.getState();
    const isNowPaused = !store.isPaused;
    store.setPaused(isNowPaused);
    
    if (isNowPaused) {
      if (this.currentTimer) this.currentTimer.pause();
    } else {
      if (this.currentTimer) this.currentTimer.resume();
    }
  }
}

export const eventController = EventController.getInstance();
