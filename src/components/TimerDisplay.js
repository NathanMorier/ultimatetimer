import React, { useState, useEffect } from 'react';
import { formatDuration } from '../utils/timeUtils';

const TimerDisplay = ({ duration, isPaused = false }) => {
  const [displayDuration, setDisplayDuration] = useState(duration);

  useEffect(() => {
    setDisplayDuration(duration);
  }, [duration]);

  return (
    <div className="timer-display">
      <div className="timer-time" style={{ 
        color: isPaused ? '#f44336' : '#4CAF50',
        opacity: isPaused ? 0.7 : 1
      }}>
        {formatDuration(displayDuration)}
      </div>
      <div className="timer-label">
        {isPaused ? 'Paused' : 'Running...'}
      </div>
    </div>
  );
};

export default TimerDisplay;
