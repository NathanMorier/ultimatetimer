import React from 'react';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, formatDate } from '../utils/timeUtils';
import { getTimerSessionsForMonth } from '../utils/localStorage';
import { useCategories } from '../hooks/useCategories';

const Calendar = ({ selectedMonth, onMonthChange }) => {
  const { categories, getCategoryById } = useCategories();
  
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Get timer sessions for the selected month
  const sessions = getTimerSessionsForMonth(year, month);
  
  // Group sessions by day
  const sessionsByDay = {};
  sessions.forEach(session => {
    const day = new Date(session.startTime).getDate();
    if (!sessionsByDay[day]) {
      sessionsByDay[day] = [];
    }
    sessionsByDay[day].push(session);
  });

  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    onMonthChange(newMonth);
  };

  const getCategoryIndicators = (day) => {
    const daySessions = sessionsByDay[day] || [];
    const categoryIds = [...new Set(daySessions.map(session => session.categoryId))];
    
    return categoryIds.map(categoryId => {
      const category = getCategoryById(categoryId);
      return category ? (
        <div
          key={categoryId}
          className="calendar-indicator"
          style={{ backgroundColor: category.color }}
          title={`${category.title}: ${daySessions.filter(s => s.categoryId === categoryId).length} sessions`}
        />
      ) : null;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasSessions = sessionsByDay[day] && sessionsByDay[day].length > 0;
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === month && 
                     new Date().getFullYear() === year;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasSessions ? 'has-sessions' : ''} ${isToday ? 'today' : ''}`}
        >
          <span className="day-number">{day}</span>
          {hasSessions && (
            <div className="calendar-indicators">
              {getCategoryIndicators(day)}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="card">
        <div className="calendar-header">
          <button
            className="btn btn-secondary"
            onClick={() => navigateMonth(-1)}
          >
            ← Previous
          </button>
          <h2>{getMonthName(month)} {year}</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigateMonth(1)}
          >
            Next →
          </button>
        </div>
        
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="calendar-days">
            {renderCalendarDays()}
          </div>
        </div>
        
        <div className="calendar-legend">
          <h3>Legend</h3>
          <div className="legend-items">
            {categories.map(category => (
              <div key={category.id} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
