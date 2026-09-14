import { useEventStore, EventPhase } from '../stores/useEventStore';
import { isShowClockPhase, startShowClock, stopShowClock } from './ShowClock';

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
  private currentDemoInterval: number | null = null;

  private constructor() {}

  public static getInstance(): EventController {
    if (!EventController.instance) {
      EventController.instance = new EventController();
    }
    return EventController.instance;
  }

  public boot() {
    if (this.currentTimer) this.currentTimer.clear();
    this.clearDemoInterval();
    stopShowClock();
    const store = useEventStore.getState();
    store.setBlackout(false);
    store.setPaused(false);
    store.setShowNodes(true);
    store.setGlobalTime(0);
    store.setScrubbing(false);
    store.resetParticipants();
    store.setPhase(EventPhase.IDLE);
  }

  private getPhaseStartTime(phase: EventPhase) {
    const { timelineConfig } = useEventStore.getState();
    const starts: Partial<Record<EventPhase, number>> = {
      [EventPhase.COUNTDOWN]: 0,
      [EventPhase.GAB_REVEAL]: timelineConfig.countdown,
      [EventPhase.ENERGY_CONVERGENCE]: timelineConfig.countdown + timelineConfig.reveal,
      [EventPhase.COUNTER_SEQUENCE]: timelineConfig.countdown + timelineConfig.reveal + timelineConfig.energy,
      [EventPhase.FINAL_CHARGE]: timelineConfig.countdown + timelineConfig.reveal + timelineConfig.energy + timelineConfig.counter,
      [EventPhase.EXPLOSION]: timelineConfig.countdown + timelineConfig.reveal + timelineConfig.energy + timelineConfig.counter + timelineConfig.finalCharge,
      [EventPhase.SUCCESS]: timelineConfig.countdown + timelineConfig.reveal + timelineConfig.energy + timelineConfig.counter + timelineConfig.finalCharge + timelineConfig.explosion,
    };
    return starts[phase] ?? 0;
  }

  private confirmAllParticipants() {
    const store = useEventStore.getState();
    for (let i = 1; i <= store.requiredParticipants; i++) {
      store.updateParticipant(i, { status: 'CONFIRMED', progress: 100 });
    }
  }

  private clearDemoInterval() {
    if (this.currentDemoInterval !== null) {
      window.clearInterval(this.currentDemoInterval);
      this.currentDemoInterval = null;
    }
  }

  public prepareScenarioEdit() {
    if (this.currentTimer) this.currentTimer.clear();
    this.clearDemoInterval();
    stopShowClock();
    const store = useEventStore.getState();
    store.setBlackout(false);
    store.setPaused(false);
    store.setScrubbing(false);
    store.setAutoAdvanceEnabled(false);
    store.setShowNodes(true);
    store.setGlobalTime(0);
    store.resetParticipants();
    store.setPhase(EventPhase.IDLE);
  }

  public jumpToPhase(phase: EventPhase) {
    if (this.currentTimer) this.currentTimer.clear();
    this.clearDemoInterval();
    const store = useEventStore.getState();
    const isRestartingSamePhase = store.phase === phase && ![
      EventPhase.IDLE,
      EventPhase.WAITING_FOR_PARTICIPANTS,
      EventPhase.PARTICIPANT_CONFIRMING,
      EventPhase.ALL_PARTICIPANTS_READY
    ].includes(phase as any);
    store.setBlackout(false);
    store.setPaused(false);
    store.setScrubbing(false);
    store.setAutoAdvanceEnabled(false);
    store.setShowNodes([
      EventPhase.BOOT,
      EventPhase.IDLE,
      EventPhase.WAITING_FOR_PARTICIPANTS,
      EventPhase.PARTICIPANT_CONFIRMING,
      EventPhase.ALL_PARTICIPANTS_READY
    ].includes(phase as any));

    if (
      phase === EventPhase.IDLE ||
      phase === EventPhase.WAITING_FOR_PARTICIPANTS ||
      phase === EventPhase.PARTICIPANT_CONFIRMING ||
      phase === EventPhase.ALL_PARTICIPANTS_READY
    ) {
      store.setGlobalTime(0);
    } else {
      this.confirmAllParticipants();
      store.setGlobalTime(this.getPhaseStartTime(phase) + 0.05);
    }

    if (phase === EventPhase.WAITING_FOR_PARTICIPANTS) {
      store.resetParticipants();
    }
    if (phase === EventPhase.ALL_PARTICIPANTS_READY) {
      this.confirmAllParticipants();
    }

    if (isRestartingSamePhase) {
      store.setPhase(EventPhase.IDLE);
      window.setTimeout(() => {
        useEventStore.getState().setPhase(phase);
        if (isShowClockPhase(phase)) startShowClock();
      }, 20);
      return;
    }

    store.setPhase(phase);
    if (isShowClockPhase(phase)) startShowClock();
  }

  public startWaiting() {
    stopShowClock();
    const store = useEventStore.getState();
    store.setBlackout(false);
    store.setPaused(false);
    store.setShowNodes(true);
    store.setAutoAdvanceEnabled(true);
    store.setPhase(EventPhase.WAITING_FOR_PARTICIPANTS);
  }

  public confirmParticipant(id: number) {
    const store = useEventStore.getState();
    if (store.phase === EventPhase.IDLE || store.phase === EventPhase.BOOT) {
      store.setBlackout(false);
      store.setPaused(false);
      store.setShowNodes(true);
      store.setGlobalTime(0);
      store.setAutoAdvanceEnabled(true);
      store.setPhase(EventPhase.WAITING_FOR_PARTICIPANTS);
    }

    const activeStore = useEventStore.getState();
    if (activeStore.phase !== EventPhase.WAITING_FOR_PARTICIPANTS && activeStore.phase !== EventPhase.PARTICIPANT_CONFIRMING) {
      return;
    }

    activeStore.updateParticipant(id, { status: 'CONFIRMED', progress: 100 });
    
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
    if (!store.autoAdvanceEnabled) return;
    
    const delayMs = (store.allReadyDelay ?? 1.5) * 1000;
    // Auto start countdown after the configured delay
    this.setTimer(() => {
      this.startCountdown();
    }, delayMs);
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
    store.setPaused(false);
    store.setScrubbing(false);
    store.setGlobalTime(0);
    store.setPhase(EventPhase.COUNTDOWN);
    startShowClock();
  }

  public startShowNow() {
    if (this.currentTimer) this.currentTimer.clear();
    this.clearDemoInterval();
    const store = useEventStore.getState();
    store.setBlackout(false);
    store.setPaused(false);
    store.setScrubbing(false);
    store.setAutoAdvanceEnabled(false);
    store.setShowNodes(true);
    this.confirmAllParticipants();
    store.setGlobalTime(0);
    store.setPhase(EventPhase.COUNTDOWN);
    startShowClock();
  }

  public cancelCountdown() {
    const store = useEventStore.getState();
    store.setShowNodes(true);
    store.setGlobalTime(0);
    store.setPhase(EventPhase.WAITING_FOR_PARTICIPANTS);
  }

  public showFinalScreen() {
    useEventStore.getState().setPhase(EventPhase.SUCCESS);
  }
  
  public skipToNextPhase() {
    // Deprecated in favor of scrubbing
  }

  public activateAll() {
    const store = useEventStore.getState();
    if(store.phase === EventPhase.SUCCESS) return;

    store.setBlackout(false);
    store.setPaused(false);
    store.setShowNodes(true);
    store.setScrubbing(false);
    store.setAutoAdvanceEnabled(true);
    
    this.confirmAllParticipants();
    this.allParticipantsReady();
  }

  public resetEvent() {
    if (this.currentTimer) this.currentTimer.clear();
    this.clearDemoInterval();
    stopShowClock();
    const store = useEventStore.getState();
    store.setPhase(EventPhase.RESETTING);
    store.setBlackout(false);
    store.setPaused(false);
    store.setAutoAdvanceEnabled(false);
    store.setShowNodes(true);
    store.setGlobalTime(0);
    store.setScrubbing(false);
    store.resetParticipants();
    this.setTimer(() => {
      store.setShowNodes(true);
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
    store.setBlackout(false);
    store.setPaused(false);
    store.setShowNodes(true);
    store.setScrubbing(false);
    store.setGlobalTime(0);
    store.setAutoAdvanceEnabled(true);
    let current = 1;
    
    // Simulate people placing hands one by one
    this.currentDemoInterval = window.setInterval(() => {
      if (current <= store.requiredParticipants) {
        this.confirmParticipant(current);
        current++;
      } else {
        this.clearDemoInterval();
      }
    }, 400);
  }

  public runTouchAutomation() {
    this.boot();
    this.startWaiting();
    const store = useEventStore.getState();
    store.resetParticipants();
    store.setShowNodes(true);
    store.setAutoAdvanceEnabled(true);
    const mode = store.touchAutomationMode;
    const speedMs = Math.max(80, (store.touchAutomationSpeed ?? 0.35) * 1000);

    if (mode === 'manual') return;

    if (mode === 'instant') {
      this.activateAll();
      return;
    }

    if (mode === 'burst') {
      let current = 1;
      const burstSize = Math.max(2, Math.ceil(store.requiredParticipants / 4));
      this.currentDemoInterval = window.setInterval(() => {
        for (let i = 0; i < burstSize && current <= store.requiredParticipants; i++) {
          this.confirmParticipant(current);
          current++;
        }
        if (current > store.requiredParticipants) {
          this.clearDemoInterval();
        }
      }, speedMs);
      return;
    }

    let current = 1;
    this.currentDemoInterval = window.setInterval(() => {
      this.confirmParticipant(current);
      current++;
      if (current > store.requiredParticipants) {
        this.clearDemoInterval();
      }
    }, speedMs);
  }

  public toggleBlackout() {
    const store = useEventStore.getState();
    store.setBlackout(!store.isBlackout);
  }
  
  public togglePause() {
    const store = useEventStore.getState();
    store.setPaused(!store.isPaused);
    if (store.isPaused) {
      startShowClock();
    }
  }
}

export const eventController = EventController.getInstance();
