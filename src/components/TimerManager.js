import React, { useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useCategories } from '../hooks/useCategories';
import { formatDuration } from '../utils/timeUtils';
import TimerDisplay from './TimerDisplay';

const TimerManager = () => {
  const { activeTimers, startTimer, pauseTimer, resumeTimer, stopTimer, updateTimerNote, getTimerDuration } = useTimer();
  const { categories, getCategoryById } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote] = useState('');

  const handleStartTimer = () => {
    if (selectedCategory) {
      startTimer(selectedCategory, note);
      setNote('');
    }
  };

  const handleStopTimer = (timerId) => {
    stopTimer(timerId);
  };

  const handlePauseTimer = (timerId) => {
    pauseTimer(timerId);
  };

  const handleResumeTimer = (timerId) => {
    resumeTimer(timerId);
  };

  const handleUpdateNote = (timerId, newNote) => {
    updateTimerNote(timerId, newNote);
  };

  return (
    <div>
      <div className="card">
        <h2>Start New Timer</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category-select">Category</label>
            <select
              id="category-select"
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
            <label htmlFor="note-input">Note (optional)</label>
            <input
              id="note-input"
              type="text"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this timer..."
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary"
              onClick={handleStartTimer}
              disabled={!selectedCategory}
            >
              Start Timer
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Active Timers ({activeTimers.length})</h2>
        {activeTimers.length === 0 ? (
          <p className="text-center">No active timers. Start a timer to begin tracking!</p>
        ) : (
          <div className="grid grid-2">
            {activeTimers.map(timer => {
              const category = getCategoryById(timer.categoryId);
              const duration = getTimerDuration(timer);
              
              return (
                <div
                  key={timer.id}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${category?.color || '#ccc'}`,
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <div className="active-timer-item">
                    <div className="active-timer-info">
                      <h3 style={{ color: category?.color || '#333' }}>
                        {category?.title || 'Unknown Category'}
                        {timer.isPaused && (
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: '#f44336', 
                            marginLeft: '0.5rem',
                            fontStyle: 'italic'
                          }}>
                            (PAUSED)
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="active-timer-actions">
                      {timer.isPaused ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleResumeTimer(timer.id)}
                        >
                          Resume
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handlePauseTimer(timer.id)}
                        >
                          Pause
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStopTimer(timer.id)}
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                  
                  <TimerDisplay duration={duration} isPaused={timer.isPaused} showOverlay={timer.showOverlay} />
                  
                  <div className="form-group">
                    <label>Note:</label>
                    <input
                      type="text"
                      className="input"
                      value={timer.note || ''}
                      onChange={(e) => handleUpdateNote(timer.id, e.target.value)}
                      placeholder="Add a note..."
                    />
                  </div>
                  
                  <div className="text-center">
                    <small style={{ color: '#666' }}>
                      Started: {new Date(timer.startTime).toLocaleTimeString()}
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

export default TimerManager;
