import React from 'react';
import { getTimerSessionsForDay } from '../utils/localStorage';
import { useCategories } from '../hooks/useCategories';
import { formatDurationHuman, formatDate, formatTime, calculatePercentage, calculatePercentageOfDay } from '../utils/timeUtils';

const DailyAnalytics = ({ selectedDate }) => {
  const { categories, getCategoryById } = useCategories();
  
  if (!selectedDate) return null;
  
  // Get timer sessions for the selected day
  const sessions = getTimerSessionsForDay(selectedDate);
  
  if (sessions.length === 0) {
    return (
      <div className="card">
        <h3>No activity on {formatDate(selectedDate)}</h3>
        <p>No timer sessions were recorded on this day.</p>
      </div>
    );
  }
  
  // Calculate total time for the day
  const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
  
  // Group sessions by category
  const sessionsByCategory = {};
  sessions.forEach(session => {
    const categoryId = session.categoryId;
    if (!sessionsByCategory[categoryId]) {
      sessionsByCategory[categoryId] = {
        sessions: [],
        totalSeconds: 0
      };
    }
    sessionsByCategory[categoryId].sessions.push(session);
    sessionsByCategory[categoryId].totalSeconds += session.duration;
  });
  
  // Convert to array and sort by total time
  const categoryStats = Object.entries(sessionsByCategory)
    .map(([categoryId, stats]) => {
      const category = getCategoryById(categoryId);
      return {
        category,
        sessions: stats.sessions,
        totalSeconds: stats.totalSeconds,
        percentage: calculatePercentage(stats.totalSeconds, totalSeconds),
        percentageOfDay: calculatePercentageOfDay(stats.totalSeconds, selectedDate)
      };
    })
    .filter(item => item.category) // Filter out any categories that don't exist
    .sort((a, b) => b.totalSeconds - a.totalSeconds);
  
  return (
    <div className="daily-analytics">
      <div className="card">
        <h3>Daily Analytics - {formatDate(selectedDate)}</h3>
        
        <div className="daily-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <h4>Total Time</h4>
              <div className="stat-value">{formatDurationHuman(totalSeconds)}</div>
            </div>
            <div className="stat-item">
              <h4>Sessions</h4>
              <div className="stat-value">{sessions.length}</div>
            </div>
            <div className="stat-item">
              <h4>Categories</h4>
              <div className="stat-value">{categoryStats.length}</div>
            </div>
          </div>
        </div>
        
        <div className="daily-breakdown">
          <h4>Breakdown by Category</h4>
          <div className="category-breakdown-list">
            {categoryStats.map(({ category, sessions, totalSeconds, percentage, percentageOfDay }) => (
              <div
                key={category.id}
                className="category-stat-item"
                style={{
                  borderLeft: `4px solid ${category.color}`,
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div className="category-stat-header">
                  <div className="category-info">
                    <h5 style={{ color: category.color }}>{category.title}</h5>
                    <span className="category-percentage">{percentage}% of tracked time ({percentageOfDay}% of day)</span>
                  </div>
                  <div className="category-total">
                    {formatDurationHuman(totalSeconds)}
                  </div>
                </div>
                
                <div className="sessions-list">
                  <h6>Sessions ({sessions.length})</h6>
                  {sessions.map(session => (
                    <div key={session.id} className="session-item">
                      <div className="session-time">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </div>
                      <div className="session-duration">
                        {formatDurationHuman(session.duration)}
                      </div>
                      {session.note && (
                        <div className="session-note">
                          Note: {session.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyAnalytics;
