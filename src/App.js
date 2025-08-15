import React, { useState } from 'react';
import { theme } from './utils/theme';
import TimerManager from './components/TimerManager';
import CategoryManager from './components/CategoryManager';
import Calendar from './components/Calendar';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('timers'); // timers, categories, calendar, analytics
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  return (
    <div className="App" style={{ backgroundColor: theme.themeColor3 }}>
      <header className="App-header" style={{ backgroundColor: theme.themeColor1 }}>
        <h1>Ultimate LocalStorage Timer</h1>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'timers' ? 'active' : ''}`}
            onClick={() => setCurrentView('timers')}
            style={{ 
              backgroundColor: currentView === 'timers' ? theme.themeColor2 : 'transparent',
              color: currentView === 'timers' ? 'white' : 'white'
            }}
          >
            Timers
          </button>
          <button 
            className={`nav-tab ${currentView === 'categories' ? 'active' : ''}`}
            onClick={() => setCurrentView('categories')}
            style={{ 
              backgroundColor: currentView === 'categories' ? theme.themeColor2 : 'transparent',
              color: currentView === 'categories' ? 'white' : 'white'
            }}
          >
            Categories
          </button>
          <button 
            className={`nav-tab ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
            style={{ 
              backgroundColor: currentView === 'calendar' ? theme.themeColor2 : 'transparent',
              color: currentView === 'calendar' ? 'white' : 'white'
            }}
          >
            Calendar
          </button>
          <button 
            className={`nav-tab ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
            style={{ 
              backgroundColor: currentView === 'analytics' ? theme.themeColor2 : 'transparent',
              color: currentView === 'analytics' ? 'white' : 'white'
            }}
          >
            Analytics
          </button>
        </nav>
      </header>

      <main className="App-main">
        {currentView === 'timers' && <TimerManager />}
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
      </main>
    </div>
  );
}

export default App;
