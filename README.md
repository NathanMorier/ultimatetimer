# Ultimate LocalStorage Timer

A comprehensive time tracking application built with React that stores all data locally in the browser's localStorage. Perfect for tracking time across multiple categories with detailed analytics and calendar visualization.

## Features

### 🕒 Timer Management
- Start and stop timers with real-time counting
- Multiple timers can run simultaneously across different categories
- Timers continue running even if the page is refreshed or closed
- Optional notes for each timer session
- Persistent timer state across browser sessions

### 📊 Categories
- Create custom categories with titles and notes
- Each category gets a unique color from a palette of 20 colors
- Edit and delete categories as needed
- Color-coded organization throughout the app

### 📅 Calendar View
- Monthly calendar with navigation
- Visual indicators (colored dots) for days with timer data
- Multiple indicators per day for different categories
- Legend showing all categories and their colors

### 📈 Analytics
- Pie chart showing time distribution across categories
- Bar chart displaying hours and session counts by category
- Detailed breakdown with percentages and averages
- Monthly statistics and summaries

### 🎨 Customizable Theme
- Three theme colors that can be easily modified:
  - Theme Color 1: Green (#4CAF50) - Buttons and highlighted text
  - Theme Color 2: Blue (#2196F3) - Secondary elements
  - Theme Color 3: Dark gray (#2a2a2a) - Background

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- Python 3 (for the local server)

### Installation

1. **Clone or download the project**
   ```bash
   cd "Ultimate LocalStorage Timer"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   This will start the React development server on port 3000.

### Alternative: Production Build with Python Server

1. **Build the production version**
   ```bash
   npm run build
   ```

2. **Start the Python server**
   ```bash
   python server.py
   ```
   This will serve the built app on port 8080.

## Usage

### Getting Started

1. **Create Categories**: Go to the "Categories" tab and add your first category with a title and optional notes.

2. **Start Timers**: Switch to the "Timers" tab, select a category, add an optional note, and click "Start Timer".

3. **Monitor Progress**: Watch your timers count up in real-time. You can have multiple timers running simultaneously.

4. **Stop Timers**: Click the "Stop" button to end a timer session. The data will be automatically saved.

5. **View Calendar**: Navigate to the "Calendar" tab to see which days have timer data with color-coded indicators.

6. **Analyze Data**: Check the "Analytics" tab for detailed charts and statistics about your time usage.

### Key Features

- **Persistent Data**: All data is stored in localStorage, so it persists between browser sessions
- **Real-time Updates**: Timer displays update every second
- **Multiple Timers**: Run several timers at once for different activities
- **Responsive Design**: Works on desktop and mobile devices
- **No Server Required**: Everything runs locally in your browser

## File Structure

```
Ultimate LocalStorage Timer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TimerManager.js
│   │   ├── TimerDisplay.js
│   │   ├── CategoryManager.js
│   │   ├── Calendar.js
│   │   └── Analytics.js
│   ├── hooks/
│   │   ├── useTimer.js
│   │   └── useCategories.js
│   ├── utils/
│   │   ├── theme.js
│   │   ├── localStorage.js
│   │   └── timeUtils.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── server.py
└── README.md
```

## Customization

### Changing Theme Colors

Edit the `src/utils/theme.js` file to modify the theme colors:

```javascript
export const theme = {
  themeColor1: '#4CAF50', // Green - for buttons, highlighted text
  themeColor2: '#2196F3', // Blue - for secondary elements
  themeColor3: '#2a2a2a', // Dark gray - background color
  // ... rest of the theme
};
```

### Adding More Category Colors

You can add more colors to the `categoryColors` array in the same file:

```javascript
categoryColors: [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  // ... add more colors here
]
```

## Data Storage

All data is stored in the browser's localStorage with the following keys:
- `timer_categories`: Category information
- `timer_sessions`: Completed timer sessions
- `active_timers`: Currently running timers

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- localStorage API
- CSS Grid and Flexbox
- React 18

## Troubleshooting

### Common Issues

1. **Timers not persisting after refresh**
   - Make sure localStorage is enabled in your browser
   - Check that you're not in incognito/private browsing mode

2. **Charts not displaying**
   - Ensure all dependencies are installed with `npm install`
   - Check the browser console for any JavaScript errors

3. **Python server not starting**
   - Make sure Python 3 is installed and in your PATH
   - Try running `python3 server.py` instead of `python server.py`

### Data Backup

To backup your data, you can export the localStorage data:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Find localStorage for your domain
4. Copy the values for the timer-related keys

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

This project is open source and available under the MIT License.
