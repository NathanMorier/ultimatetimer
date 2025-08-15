import { useState, useEffect, useCallback } from 'react';
import { getCurrentTime, calculateDuration } from '../utils/timeUtils';
import { loadActiveTimers, saveActiveTimers, addTimerSession, removeActiveTimer } from '../utils/localStorage';

export const useTimer = () => {
  const [activeTimers, setActiveTimers] = useState([]);

  // Load active timers from localStorage on mount
  useEffect(() => {
    const stored = loadActiveTimers();
    setActiveTimers(stored);
  }, []);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = prev.map(timer => {
          if (timer.isPaused) {
            return timer; // Don't update currentTime if paused
          }
          return {
            ...timer,
            currentTime: getCurrentTime()
          };
        });
        saveActiveTimers(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Start a new timer
  const startTimer = useCallback((categoryId, note = '') => {
    const newTimer = {
      id: Date.now().toString(),
      categoryId,
      startTime: getCurrentTime(),
      currentTime: getCurrentTime(),
      note,
      isPaused: false,
      pausedTime: 0, // Total time paused in seconds
      lastPauseTime: null // When the timer was last paused
    };

    const updated = [...activeTimers, newTimer];
    setActiveTimers(updated);
    saveActiveTimers(updated);
  }, [activeTimers]);

  // Pause a timer
  const pauseTimer = useCallback((timerId) => {
    const updated = activeTimers.map(timer => {
      if (timer.id === timerId && !timer.isPaused) {
        return {
          ...timer,
          isPaused: true,
          lastPauseTime: getCurrentTime()
        };
      }
      return timer;
    });
    setActiveTimers(updated);
    saveActiveTimers(updated);
  }, [activeTimers]);

  // Resume a timer
  const resumeTimer = useCallback((timerId) => {
    const updated = activeTimers.map(timer => {
      if (timer.id === timerId && timer.isPaused) {
        const pauseDuration = calculateDuration(timer.lastPauseTime, getCurrentTime());
        return {
          ...timer,
          isPaused: false,
          pausedTime: timer.pausedTime + pauseDuration,
          lastPauseTime: null
          // Don't update currentTime - let it continue from where it was paused
        };
      }
      return timer;
    });
    setActiveTimers(updated);
    saveActiveTimers(updated);
  }, [activeTimers]);

  // Stop a timer
  const stopTimer = useCallback((timerId) => {
    const timer = activeTimers.find(t => t.id === timerId);
    if (!timer) return;

    // Calculate actual running time (total time minus paused time)
    const totalDuration = calculateDuration(timer.startTime, timer.currentTime);
    const actualDuration = totalDuration - timer.pausedTime;

    const session = {
      id: timerId,
      categoryId: timer.categoryId,
      startTime: timer.startTime,
      endTime: getCurrentTime(),
      duration: actualDuration,
      note: timer.note
    };

    // Save the completed session
    addTimerSession(session);

    // Remove from active timers
    const updated = activeTimers.filter(t => t.id !== timerId);
    setActiveTimers(updated);
    saveActiveTimers(updated);
  }, [activeTimers]);

  // Update timer note
  const updateTimerNote = useCallback((timerId, note) => {
    const updated = activeTimers.map(timer => 
      timer.id === timerId ? { ...timer, note } : timer
    );
    setActiveTimers(updated);
    saveActiveTimers(updated);
  }, [activeTimers]);

  // Get timer duration (accounting for paused time)
  const getTimerDuration = useCallback((timer) => {
    const totalDuration = calculateDuration(timer.startTime, timer.currentTime);
    return totalDuration - (timer.pausedTime || 0);
  }, []);

  return {
    activeTimers,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateTimerNote,
    getTimerDuration
  };
};
