// Time utility functions

// Format time duration in seconds to HH:MM:SS
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format time duration to human readable format
export const formatDurationHuman = (seconds) => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }
};

// Calculate duration between two dates in seconds
export const calculateDuration = (startTime, endTime) => {
  return Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
};

// Get current time in ISO string
export const getCurrentTime = () => {
  return new Date().toISOString();
};

// Check if a date is today
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

// Check if a date is in the current month
export const isCurrentMonth = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.getFullYear() === checkDate.getFullYear() && 
         today.getMonth() === checkDate.getMonth();
};

// Get days in a month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Format time for display
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get month name
export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

// Calculate percentage of total time
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
