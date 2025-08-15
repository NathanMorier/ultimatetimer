import React, { useState, useEffect } from 'react';
import { formatDuration } from '../utils/timeUtils';

const CountdownDisplay = ({ remaining, isPaused = false, showOverlay = false }) => {
  const [displayRemaining, setDisplayRemaining] = useState(remaining);

  useEffect(() => {
    setDisplayRemaining(remaining);
  }, [remaining]);

  return (
    <div className="countdown-display" style={{ position: 'relative' }}>
      <div className="countdown-time" style={{ 
        color: isPaused ? '#f44336' : '#FF9800',
        opacity: isPaused ? 0.7 : 1
      }}>
        {formatDuration(displayRemaining)}
      </div>
      <div className="countdown-label">
        {isPaused ? 'Paused' : 'Counting Down...'}
      </div>
      
      {/* Loading overlay during resume transition */}
      {showOverlay && (
        <div className="countdown-loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Resuming...</div>
        </div>
      )}
    </div>
  );
};

export default CountdownDisplay;
