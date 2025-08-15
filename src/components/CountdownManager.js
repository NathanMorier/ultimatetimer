import React, { useState } from 'react';
import { useGlobalCountdown } from '../hooks/useGlobalCountdown';
import { useCategories } from '../hooks/useCategories';
import CountdownDisplay from './CountdownDisplay';

const CountdownManager = () => {
  const { 
    activeCountdowns, 
    startCountdown, 
    pauseCountdown, 
    resumeCountdown, 
    stopCountdown, 
    updateCountdownNote, 
    getCountdownRemaining,
    isCountdownComplete,
    removeCompletedCountdown
  } = useGlobalCountdown();
  const { categories, getCategoryById } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const handleStartCountdown = () => {
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    const secondsNum = parseInt(seconds) || 0;
    
    if (selectedCategory && (hoursNum > 0 || minutesNum > 0 || secondsNum > 0)) {
      const totalSeconds = (hoursNum * 3600) + (minutesNum * 60) + secondsNum;
      startCountdown(selectedCategory, totalSeconds, note);
      setNote('');
      setHours('');
      setMinutes('');
      setSeconds('');
    }
  };

  const handleStopCountdown = (countdownId) => {
    stopCountdown(countdownId);
  };

  const handlePauseCountdown = (countdownId) => {
    pauseCountdown(countdownId);
  };

  const handleResumeCountdown = (countdownId) => {
    resumeCountdown(countdownId);
  };

  const handleUpdateNote = (countdownId, newNote) => {
    updateCountdownNote(countdownId, newNote);
  };

  return (
    <div>
      <div className="card">
        <h2>Start New Countdown</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="countdown-category-select">Category</label>
            <select
              id="countdown-category-select"
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select a category...</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="countdown-note-input">Note (optional)</label>
            <input
              id="countdown-note-input"
              type="text"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this countdown..."
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hours-input">Hours</label>
                         <input
               id="hours-input"
               type="number"
               min="0"
               max="99"
               className="input"
               value={hours}
               onChange={(e) => setHours(e.target.value)}
             />
          </div>
          <div className="form-group">
            <label htmlFor="minutes-input">Minutes</label>
                         <input
               id="minutes-input"
               type="number"
               min="0"
               max="59"
               className="input"
               value={minutes}
               onChange={(e) => setMinutes(e.target.value)}
             />
          </div>
          <div className="form-group">
            <label htmlFor="seconds-input">Seconds</label>
                         <input
               id="seconds-input"
               type="number"
               min="0"
               max="59"
               className="input"
               value={seconds}
               onChange={(e) => setSeconds(e.target.value)}
             />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary"
              onClick={handleStartCountdown}
                             disabled={!selectedCategory || (parseInt(hours) || 0) === 0 && (parseInt(minutes) || 0) === 0 && (parseInt(seconds) || 0) === 0}
            >
              Start Countdown
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Active Countdowns ({activeCountdowns.length})</h2>
        {activeCountdowns.length === 0 ? (
          <p className="text-center">No active countdowns. Start a countdown to begin!</p>
        ) : (
          <div className="grid grid-2">
            {activeCountdowns.map(countdown => {
              const category = getCategoryById(countdown.categoryId);
              const remaining = getCountdownRemaining(countdown);
              const isComplete = isCountdownComplete(countdown);
              
              return (
                <div
                  key={countdown.id}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${category?.color || '#ccc'}`,
                    backgroundColor: isComplete ? '#fff3cd' : '#f8f9fa'
                  }}
                >
                  <div className="active-countdown-item">
                    <div className="active-countdown-info">
                      <h3 style={{ color: category?.color || '#333' }}>
                        {category?.title || 'Unknown Category'}
                        {countdown.isPaused && (
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: '#f44336', 
                            marginLeft: '0.5rem',
                            fontStyle: 'italic'
                          }}>
                            (PAUSED)
                          </span>
                        )}
                        {isComplete && (
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: '#FF9800', 
                            marginLeft: '0.5rem',
                            fontStyle: 'italic'
                          }}>
                            (COMPLETE)
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="active-countdown-actions">
                      {countdown.isPaused ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleResumeCountdown(countdown.id)}
                        >
                          Resume
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handlePauseCountdown(countdown.id)}
                        >
                          Pause
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStopCountdown(countdown.id)}
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                  
                  <CountdownDisplay 
                    remaining={remaining} 
                    isPaused={countdown.isPaused} 
                    showOverlay={countdown.showOverlay} 
                  />
                  
                  <div className="form-group">
                    <label>Note:</label>
                    <input
                      type="text"
                      className="input"
                      value={countdown.note || ''}
                      onChange={(e) => handleUpdateNote(countdown.id, e.target.value)}
                      placeholder="Add a note..."
                    />
                  </div>
                  
                  <div className="text-center">
                    <small style={{ color: '#666' }}>
                      Started: {new Date(countdown.startTime).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
                 )}
       </div>
     </div>
   );
 };

export default CountdownManager;
