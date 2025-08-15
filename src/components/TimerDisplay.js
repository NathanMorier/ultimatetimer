import React, { useState, useEffect } from 'react';
import { formatDuration } from '../utils/timeUtils';

const TimerDisplay = ({ duration }) => {
  const [displayDuration, setDisplayDuration] = useState(duration);

  useEffect(() => {
    setDisplayDuration(duration);
  }, [duration]);

  return (
    <div className="timer-display">
      <div className="timer-time">
        {formatDuration(displayDuration)}
      </div>
      <div className="timer-label">
        Running...
      </div>
    </div>
  );
};

export default TimerDisplay;
