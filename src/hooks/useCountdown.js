import { useState, useEffect, useCallback } from 'react';
import { getCurrentTime, calculateDuration } from '../utils/timeUtils';
import { loadActiveCountdowns, saveActiveCountdowns, addCountdownSession } from '../utils/localStorage';

export const useCountdown = () => {
  const [activeCountdowns, setActiveCountdowns] = useState([]);

  // Load active countdowns from localStorage on mount
  useEffect(() => {
    const stored = loadActiveCountdowns();
    setActiveCountdowns(stored);
  }, []);

  // Update countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCountdowns(prev => {
        const updated = prev.map(countdown => {
          if (countdown.isPaused) {
            return countdown; // Don't update currentTime if paused
          }
          return {
            ...countdown,
            currentTime: getCurrentTime()
          };
        });
        
        saveActiveCountdowns(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Start a new countdown
  const startCountdown = useCallback((categoryId, duration, note = '') => {
    const newCountdown = {
      id: Date.now().toString(),
      categoryId,
      duration: duration, // Total duration in seconds
      startTime: getCurrentTime(),
      currentTime: getCurrentTime(),
      note,
      isPaused: false,
      pausedTime: 0, // Total time paused in seconds
      lastPauseTime: null, // When the countdown was last paused
      showOverlay: false // Flag to show overlay during resume transition
    };

    const updated = [...activeCountdowns, newCountdown];
    setActiveCountdowns(updated);
    saveActiveCountdowns(updated);
  }, [activeCountdowns]);

  // Pause a countdown
  const pauseCountdown = useCallback((countdownId) => {
    const updated = activeCountdowns.map(countdown => {
      if (countdown.id === countdownId && !countdown.isPaused) {
        return {
          ...countdown,
          isPaused: true,
          lastPauseTime: getCurrentTime()
        };
      }
      return countdown;
    });
    setActiveCountdowns(updated);
    saveActiveCountdowns(updated);
  }, [activeCountdowns]);

  // Resume a countdown
  const resumeCountdown = useCallback((countdownId) => {
    const updated = activeCountdowns.map(countdown => {
      if (countdown.id === countdownId && countdown.isPaused) {
        const pauseDuration = calculateDuration(countdown.lastPauseTime, getCurrentTime());
        
        return {
          ...countdown,
          isPaused: false,
          pausedTime: countdown.pausedTime + pauseDuration,
          lastPauseTime: null,
          showOverlay: true // Show overlay to cover the transition
        };
      }
      return countdown;
    });
    setActiveCountdowns(updated);
    saveActiveCountdowns(updated);
    
    // Hide overlay after 1 second
    setTimeout(() => {
      setActiveCountdowns(prev => {
        const updated = prev.map(countdown => 
          countdown.id === countdownId ? { ...countdown, showOverlay: false } : countdown
        );
        saveActiveCountdowns(updated);
        return updated;
      });
    }, 1000);
  }, [activeCountdowns]);

  // Stop a countdown
  const stopCountdown = useCallback((countdownId) => {
    const countdown = activeCountdowns.find(c => c.id === countdownId);
    if (!countdown) return;

    // Calculate actual running time (total time minus paused time)
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

    // Save the completed session
    addCountdownSession(session);

    // Remove from active countdowns
    const updated = activeCountdowns.filter(c => c.id !== countdownId);
    setActiveCountdowns(updated);
    saveActiveCountdowns(updated);
  }, [activeCountdowns]);

  // Update countdown note
  const updateCountdownNote = useCallback((countdownId, note) => {
    const updated = activeCountdowns.map(countdown => 
      countdown.id === countdownId ? { ...countdown, note } : countdown
    );
    setActiveCountdowns(updated);
    saveActiveCountdowns(updated);
  }, [activeCountdowns]);

  // Get countdown remaining time (accounting for paused time)
  const getCountdownRemaining = useCallback((countdown) => {
    const totalDuration = calculateDuration(countdown.startTime, countdown.currentTime);
    const actualDuration = totalDuration - (countdown.pausedTime || 0);
    const remaining = countdown.duration - actualDuration;
    return Math.max(0, remaining); // Don't go below 0
  }, []);

  // Check if countdown is complete
  const isCountdownComplete = useCallback((countdown) => {
    return getCountdownRemaining(countdown) <= 0;
  }, [getCountdownRemaining]);

  // Remove a completed countdown (called after modal is shown)
  const removeCompletedCountdown = useCallback((countdownId) => {
    const updated = activeCountdowns.filter(c => c.id !== countdownId);
    setActiveCountdowns(updated);
    saveActiveCountdowns(updated);
  }, [activeCountdowns]);

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
