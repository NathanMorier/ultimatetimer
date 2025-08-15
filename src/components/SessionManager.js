import React, { useState, useEffect } from 'react';
import { loadTimerSessions, saveTimerSessions } from '../utils/localStorage';
import { useCategories } from '../hooks/useCategories';
import { formatDurationHuman, formatDate, formatTime } from '../utils/timeUtils';

const SessionManager = () => {
  const { categories, getCategoryById } = useCategories();
  const [sessions, setSessions] = useState(loadTimerSessions());

  // Refresh sessions periodically to catch new countdown sessions
  useEffect(() => {
    const interval = setInterval(() => {
      const currentSessions = loadTimerSessions();
      setSessions(currentSessions);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    startTime: '',
    endTime: '',
    note: ''
  });

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this timer session?')) {
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      setSessions(updatedSessions);
      saveTimerSessions(updatedSessions);
    }
  };

  const handleEditSession = (session) => {
    setEditingSession(session.id);
    setEditForm({
      startTime: session.startTime.slice(0, 16), // Format for datetime-local input
      endTime: session.endTime.slice(0, 16),
      note: session.note || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editForm.startTime || !editForm.endTime) {
      alert('Please fill in both start and end times');
      return;
    }

    const startTime = new Date(editForm.startTime).toISOString();
    const endTime = new Date(editForm.endTime).toISOString();
    
    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    const duration = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
    
    const updatedSessions = sessions.map(session => 
      session.id === editingSession 
        ? { ...session, startTime, endTime, duration, note: editForm.note }
        : session
    );

    setSessions(updatedSessions);
    saveTimerSessions(updatedSessions);
    setEditingSession(null);
    setEditForm({ startTime: '', endTime: '', note: '' });
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setEditForm({ startTime: '', endTime: '', note: '' });
  };

  const sortedSessions = [...sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  return (
    <div className="session-manager">
      <div className="card">
        <h2>Timer Sessions ({sessions.length})</h2>
        {sessions.length === 0 ? (
          <p className="text-center">No timer sessions yet. Start some timers to see your history!</p>
        ) : (
          <div className="sessions-list">
            {sortedSessions.map(session => {
              const category = getCategoryById(session.categoryId);
              
              return (
                <div
                  key={session.id}
                  className="session-item"
                  style={{
                    borderLeft: `4px solid ${category?.color || '#ccc'}`,
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  {editingSession === session.id ? (
                    <div className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Start Time:</label>
                          <input
                            type="datetime-local"
                            className="input"
                            value={editForm.startTime}
                            onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>End Time:</label>
                          <input
                            type="datetime-local"
                            className="input"
                            value={editForm.endTime}
                            onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Note:</label>
                        <input
                          type="text"
                          className="input"
                          value={editForm.note}
                          onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                          placeholder="Add a note..."
                        />
                      </div>
                      <div className="flex">
                        <button className="btn btn-primary" onClick={handleSaveEdit}>
                          Save
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="session-content">
                      <div className="session-header">
                        <div className="session-info">
                          <h3 style={{ color: category?.color || '#333' }}>
                            {category?.title || 'Unknown Category'}
                          </h3>
                          <div className="session-duration">
                            {formatDurationHuman(session.duration)}
                          </div>
                        </div>
                        <div className="session-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEditSession(session)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="session-details">
                        <div className="detail-row">
                          <span>Started:</span>
                          <span>{formatDate(session.startTime)} at {formatTime(session.startTime)}</span>
                        </div>
                        <div className="detail-row">
                          <span>Ended:</span>
                          <span>{formatDate(session.endTime)} at {formatTime(session.endTime)}</span>
                        </div>
                        {session.note && (
                          <div className="detail-row">
                            <span>Note:</span>
                            <span className="session-note">{session.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;
