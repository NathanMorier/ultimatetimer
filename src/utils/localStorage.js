// LocalStorage utility functions

const STORAGE_KEYS = {
  CATEGORIES: 'timer_categories',
  TIMERS: 'timer_sessions',
  ACTIVE_TIMERS: 'active_timers'
};

// Category management
export const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const loadCategories = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return stored ? JSON.parse(stored) : [];
};

// Timer sessions management
export const saveTimerSessions = (sessions) => {
  localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(sessions));
};

export const loadTimerSessions = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.TIMERS);
  return stored ? JSON.parse(stored) : [];
};

// Active timers management
export const saveActiveTimers = (activeTimers) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMERS, JSON.stringify(activeTimers));
};

export const loadActiveTimers = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMERS);
  return stored ? JSON.parse(stored) : [];
};

// Helper function to add a new timer session
export const addTimerSession = (session) => {
  const sessions = loadTimerSessions();
  sessions.push(session);
  saveTimerSessions(sessions);
};

// Helper function to update active timers
export const updateActiveTimer = (timerId, updates) => {
  const activeTimers = loadActiveTimers();
  const index = activeTimers.findIndex(timer => timer.id === timerId);
  
  if (index !== -1) {
    activeTimers[index] = { ...activeTimers[index], ...updates };
    saveActiveTimers(activeTimers);
  }
};

// Helper function to remove active timer
export const removeActiveTimer = (timerId) => {
  const activeTimers = loadActiveTimers();
  const filtered = activeTimers.filter(timer => timer.id !== timerId);
  saveActiveTimers(filtered);
};

// Helper function to get timer sessions for a specific date range
export const getTimerSessionsForDateRange = (startDate, endDate) => {
  const sessions = loadTimerSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

// Helper function to get timer sessions for a specific month
export const getTimerSessionsForMonth = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);
  return getTimerSessionsForDateRange(startDate, endDate);
};

// Helper function to get timer sessions for a specific day
export const getTimerSessionsForDay = (date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  return getTimerSessionsForDateRange(startDate, endDate);
};
