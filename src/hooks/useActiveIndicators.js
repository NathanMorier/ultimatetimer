import { useState, useEffect } from 'react';
import { loadActiveTimers } from '../utils/localStorage';
import { loadActiveCountdowns } from '../utils/localStorage';

export const useActiveIndicators = () => {
  const [activeTimersCount, setActiveTimersCount] = useState(0);
  const [activeCountdownsCount, setActiveCountdownsCount] = useState(0);

  // Update counts every second to stay in sync
  useEffect(() => {
    const interval = setInterval(() => {
      const timers = loadActiveTimers();
      const countdowns = loadActiveCountdowns();
      
      setActiveTimersCount(timers.length);
      setActiveCountdownsCount(countdowns.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    activeTimersCount,
    activeCountdownsCount,
    hasActiveTimers: activeTimersCount > 0,
    hasActiveCountdowns: activeCountdownsCount > 0
  };
};
