import React, { useState, useEffect } from 'react';
import { theme } from './utils/theme';
import TimerManager from './components/TimerManager';
import CountdownManager from './components/CountdownManager';
import CategoryManager from './components/CategoryManager';
import Calendar from './components/Calendar';
import Analytics from './components/Analytics';
import SessionManager from './components/SessionManager';
import { useActiveIndicators } from './hooks/useActiveIndicators';
import { useGlobalCountdown, getGlobalCountdownManager } from './hooks/useGlobalCountdown';
import { ModalProvider, useModal } from './contexts/ModalContext';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('timers'); // timers, countdowns, categories, calendar, analytics, sessions
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hasActiveTimers, hasActiveCountdowns } = useActiveIndicators();
  const { showCountdownCompleteModal } = useModal();
  
  // Initialize global countdown manager (runs in background)
  useGlobalCountdown();

  // Connect modal callback to global countdown manager
  useEffect(() => {
    const manager = getGlobalCountdownManager();
    manager.setModalCallback(showCountdownCompleteModal);
  }, [showCountdownCompleteModal]);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false); // Close menu when a tab is clicked
  };

  return (
    <div className="App" style={{ backgroundColor: theme.themeColor3 }}>
      <header className="App-header" style={{ backgroundColor: theme.themeColor1 }}>
        <div className="header-content">
          <h1>Ultimate LocalStorage Timer</h1>
          <button 
            className="hamburger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
        <nav className={`nav-tabs ${isMenuOpen ? 'open' : ''}`}>
                      <button 
              className={`nav-tab ${currentView === 'timers' ? 'active' : ''}`}
              onClick={() => handleNavClick('timers')}
              style={{ 
                backgroundColor: currentView === 'timers' ? theme.themeColor2 : 'transparent',
                color: currentView === 'timers' ? 'white' : 'white'
              }}
            >
              <span className="nav-text-wrapper">
                Timers
                {hasActiveTimers && <span className="nav-indicator">●</span>}
              </span>
            </button>
                      <button 
              className={`nav-tab ${currentView === 'countdowns' ? 'active' : ''}`}
              onClick={() => handleNavClick('countdowns')}
              style={{ 
                backgroundColor: currentView === 'countdowns' ? theme.themeColor2 : 'transparent',
                color: currentView === 'countdowns' ? 'white' : 'white'
              }}
            >
              <span className="nav-text-wrapper">
                Countdowns
                {hasActiveCountdowns && <span className="nav-indicator">●</span>}
              </span>
            </button>
                      <button 
              className={`nav-tab ${currentView === 'categories' ? 'active' : ''}`}
              onClick={() => handleNavClick('categories')}
              style={{ 
                backgroundColor: currentView === 'categories' ? theme.themeColor2 : 'transparent',
                color: currentView === 'categories' ? 'white' : 'white'
              }}
            >
              Categories
            </button>
                      <button 
              className={`nav-tab ${currentView === 'calendar' ? 'active' : ''}`}
              onClick={() => handleNavClick('calendar')}
              style={{ 
                backgroundColor: currentView === 'calendar' ? theme.themeColor2 : 'transparent',
                color: currentView === 'calendar' ? 'white' : 'white'
              }}
            >
              Calendar
            </button>
                      <button 
              className={`nav-tab ${currentView === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavClick('analytics')}
              style={{ 
                backgroundColor: currentView === 'analytics' ? theme.themeColor2 : 'transparent',
                color: currentView === 'analytics' ? 'white' : 'white'
              }}
            >
              Analytics
            </button>
                      <button 
              className={`nav-tab ${currentView === 'sessions' ? 'active' : ''}`}
              onClick={() => handleNavClick('sessions')}
              style={{ 
                backgroundColor: currentView === 'sessions' ? theme.themeColor2 : 'transparent',
                color: currentView === 'sessions' ? 'white' : 'white'
              }}
            >
              Sessions
            </button>
        </nav>
      </header>

      <main className="App-main">
        {currentView === 'timers' && <TimerManager />}
        {currentView === 'countdowns' && <CountdownManager />}
        {currentView === 'categories' && <CategoryManager />}
        {currentView === 'calendar' && (
          <Calendar 
            selectedMonth={selectedMonth} 
            onMonthChange={setSelectedMonth}
          />
        )}
        {currentView === 'analytics' && (
          <Analytics selectedMonth={selectedMonth} />
        )}
        {currentView === 'sessions' && <SessionManager />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ModalProvider>
      <AppContent />
    </ModalProvider>
  );
}

export default App;
