import { useState, useEffect, useCallback } from 'react';
import { getCurrentTime, calculateDuration } from '../utils/timeUtils';
import { loadActiveCountdowns, saveActiveCountdowns, addCountdownSession } from '../utils/localStorage';

// Singleton to ensure only one global countdown manager exists
let globalCountdownManager = null;

class GlobalCountdownManager {
  constructor() {
    this.activeCountdowns = [];
    this.listeners = new Set();
    this.interval = null;
    this.isInitialized = false;
    this.modalCallback = null;
  }

  initialize() {
    if (this.isInitialized) return;
    
    this.activeCountdowns = loadActiveCountdowns();
    this.startUpdateLoop();
    this.isInitialized = true;
  }

  startUpdateLoop() {
    if (this.interval) return;
    
    this.interval = setInterval(() => {
      this.updateCountdowns();
    }, 1000);
  }

  updateCountdowns() {
    const updated = this.activeCountdowns.map(countdown => {
      if (countdown.isPaused) {
        return countdown; // Don't update currentTime if paused
      }
      return {
        ...countdown,
        currentTime: getCurrentTime()
      };
    });

    // Check for completed countdowns and save sessions
    const finalUpdated = updated.map(countdown => {
      const totalDuration = calculateDuration(countdown.startTime, countdown.currentTime);
      const actualDuration = totalDuration - (countdown.pausedTime || 0);
      const remaining = countdown.duration - actualDuration;
      
      if (remaining <= 0 && !countdown.isComplete) {
        // Save the completed session
        const session = {
          id: countdown.id,
          categoryId: countdown.categoryId,
          startTime: countdown.startTime,
          endTime: countdown.currentTime,
          duration: actualDuration,
          note: countdown.note
        };
        
        addCountdownSession(session);
        
        // Play sound
        const audio = new Audio('/ultimatetimer/end-timer.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
        
        // Show modal if callback is available
        if (this.modalCallback) {
          this.modalCallback(countdown);
        }
        
        return { ...countdown, isComplete: true };
      }
      return countdown;
    });

    this.activeCountdowns = finalUpdated;
    saveActiveCountdowns(finalUpdated);
    this.notifyListeners();
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.activeCountdowns));
  }

  setModalCallback(callback) {
    this.modalCallback = callback;
  }

  startCountdown(categoryId, duration, note = '') {
    const newCountdown = {
      id: Date.now().toString(),
      categoryId,
      duration: duration,
      startTime: getCurrentTime(),
      currentTime: getCurrentTime(),
      note,
      isPaused: false,
      pausedTime: 0,
      lastPauseTime: null,
      showOverlay: false,
      isComplete: false
    };

    this.activeCountdowns = [...this.activeCountdowns, newCountdown];
    saveActiveCountdowns(this.activeCountdowns);
    this.notifyListeners();
  }

  pauseCountdown(countdownId) {
    this.activeCountdowns = this.activeCountdowns.map(countdown => {
      if (countdown.id === countdownId && !countdown.isPaused) {
        return {
          ...countdown,
          isPaused: true,
          lastPauseTime: getCurrentTime()
        };
      }
      return countdown;
    });
    saveActiveCountdowns(this.activeCountdowns);
    this.notifyListeners();
  }

  resumeCountdown(countdownId) {
    this.activeCountdowns = this.activeCountdowns.map(countdown => {
      if (countdown.id === countdownId && countdown.isPaused) {
        const pauseDuration = calculateDuration(countdown.lastPauseTime, getCurrentTime());
        
        return {
          ...countdown,
          isPaused: false,
          pausedTime: countdown.pausedTime + pauseDuration,
          lastPauseTime: null,
          showOverlay: true
        };
      }
      return countdown;
    });
    saveActiveCountdowns(this.activeCountdowns);
    this.notifyListeners();

    // Hide overlay after 1 second
    setTimeout(() => {
      this.activeCountdowns = this.activeCountdowns.map(countdown => 
        countdown.id === countdownId ? { ...countdown, showOverlay: false } : countdown
      );
      saveActiveCountdowns(this.activeCountdowns);
      this.notifyListeners();
    }, 1000);
  }

  stopCountdown(countdownId) {
    const countdown = this.activeCountdowns.find(c => c.id === countdownId);
    if (!countdown) return;

    const totalDuration = calculateDuration(countdown.startTime, countdown.currentTime);
    const actualDuration = totalDuration - countdown.pausedTime;

    const session = {
      id: countdownId,
      categoryId: countdown.categoryId,
      startTime: countdown.startTime,
      endTime: getCurrentTime(),
      duration: actualDuration,
      note: countdown.note
    };

    addCountdownSession(session);

    this.activeCountdowns = this.activeCountdowns.filter(c => c.id !== countdownId);
    saveActiveCountdowns(this.activeCountdowns);
    this.notifyListeners();
  }

  updateCountdownNote(countdownId, note) {
    this.activeCountdowns = this.activeCountdowns.map(countdown => 
      countdown.id === countdownId ? { ...countdown, note } : countdown
    );
    saveActiveCountdowns(this.activeCountdowns);
    this.notifyListeners();
  }

  getCountdownRemaining(countdown) {
    const totalDuration = calculateDuration(countdown.startTime, countdown.currentTime);
    const actualDuration = totalDuration - (countdown.pausedTime || 0);
    const remaining = countdown.duration - actualDuration;
    return Math.max(0, remaining);
  }

  isCountdownComplete(countdown) {
    return this.getCountdownRemaining(countdown) <= 0;
  }

  removeCompletedCountdown(countdownId) {
    this.activeCountdowns = this.activeCountdowns.filter(c => c.id !== countdownId);
    saveActiveCountdowns(this.activeCountdowns);
    this.notifyListeners();
  }

  getActiveCountdowns() {
    return this.activeCountdowns;
  }
}

// Get or create the singleton instance
export function getGlobalCountdownManager() {
  if (!globalCountdownManager) {
    globalCountdownManager = new GlobalCountdownManager();
    globalCountdownManager.initialize();
  }
  return globalCountdownManager;
}

export const useGlobalCountdown = () => {
  const [activeCountdowns, setActiveCountdowns] = useState([]);
  const manager = getGlobalCountdownManager();

  useEffect(() => {
    // Set initial state
    setActiveCountdowns(manager.getActiveCountdowns());

    // Add listener for updates
    const listener = (countdowns) => {
      setActiveCountdowns(countdowns);
    };
    
    manager.addListener(listener);
    
    return () => {
      manager.removeListener(listener);
    };
  }, [manager]);

  const startCountdown = useCallback((categoryId, duration, note = '') => {
    manager.startCountdown(categoryId, duration, note);
  }, [manager]);

  const pauseCountdown = useCallback((countdownId) => {
    manager.pauseCountdown(countdownId);
  }, [manager]);

  const resumeCountdown = useCallback((countdownId) => {
    manager.resumeCountdown(countdownId);
  }, [manager]);

  const stopCountdown = useCallback((countdownId) => {
    manager.stopCountdown(countdownId);
  }, [manager]);

  const updateCountdownNote = useCallback((countdownId, note) => {
    manager.updateCountdownNote(countdownId, note);
  }, [manager]);

  const getCountdownRemaining = useCallback((countdown) => {
    return manager.getCountdownRemaining(countdown);
  }, [manager]);

  const isCountdownComplete = useCallback((countdown) => {
    return manager.isCountdownComplete(countdown);
  }, [manager]);

  const removeCompletedCountdown = useCallback((countdownId) => {
    manager.removeCompletedCountdown(countdownId);
  }, [manager]);

  return {
    activeCountdowns,
    startCountdown,
    pauseCountdown,
    resumeCountdown,
    stopCountdown,
    updateCountdownNote,
    getCountdownRemaining,
    isCountdownComplete,
    removeCompletedCountdown
  };
};
