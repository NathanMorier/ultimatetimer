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
        const updated = prev.map(timer => ({
          ...timer,
          currentTime: getCurrentTime()
        }));
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
      note
    };

    const updated = [...activeTimers, newTimer];
    setActiveTimers(updated);
    saveActiveTimers(updated);
  }, [activeTimers]);

  // Stop a timer
  const stopTimer = useCallback((timerId) => {
    const timer = activeTimers.find(t => t.id === timerId);
    if (!timer) return;

    const session = {
      id: timerId,
      categoryId: timer.categoryId,
      startTime: timer.startTime,
      endTime: getCurrentTime(),
      duration: calculateDuration(timer.startTime, getCurrentTime()),
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

  // Get timer duration
  const getTimerDuration = useCallback((timer) => {
    return calculateDuration(timer.startTime, timer.currentTime);
  }, []);

  return {
    activeTimers,
    startTimer,
    stopTimer,
    updateTimerNote,
    getTimerDuration
  };
};
