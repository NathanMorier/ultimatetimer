import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTimerSessionsForMonth } from '../utils/localStorage';
import { useCategories } from '../hooks/useCategories';
import { formatDurationHuman, calculatePercentage, calculatePercentageOfMonth, getMonthName, formatDurationForAxis } from '../utils/timeUtils';

const Analytics = ({ selectedMonth }) => {
  const { categories, getCategoryById } = useCategories();
  
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const sessions = getTimerSessionsForMonth(year, month);
  
  // Calculate statistics by category
  const categoryStats = {};
  let totalTime = 0;
  
  sessions.forEach(session => {
    const categoryId = session.categoryId;
    if (!categoryStats[categoryId]) {
      categoryStats[categoryId] = {
        totalSeconds: 0,
        sessionCount: 0,
        category: getCategoryById(categoryId)
      };
    }
    categoryStats[categoryId].totalSeconds += session.duration;
    categoryStats[categoryId].sessionCount += 1;
    totalTime += session.duration;
  });
  
  // Calculate total seconds in the month (using actual days in month)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalSecondsInMonth = daysInMonth * 24 * 60 * 60;
  const untrackedSeconds = totalSecondsInMonth - totalTime;

  // Convert to chart data for full month pie chart (including untracked)
  const fullMonthPieChartData = Object.entries(categoryStats)
    .filter(([_, stats]) => stats.category) // Only include categories that still exist
    .map(([categoryId, stats]) => ({
      name: stats.category.title,
      value: stats.totalSeconds,
      color: stats.category.color,
      percentage: calculatePercentage(stats.totalSeconds, totalTime),
      percentageOfMonth: calculatePercentageOfMonth(stats.totalSeconds, year, month)
    }))
    .sort((a, b) => b.value - a.value);

  // Add untracked time slice if there's untracked time
  if (untrackedSeconds > 0) {
    fullMonthPieChartData.push({
      name: 'Untracked Time',
      value: untrackedSeconds,
      color: '#e0e0e0', // Light gray for untracked time
      percentage: calculatePercentage(untrackedSeconds, totalSecondsInMonth),
      percentageOfMonth: calculatePercentageOfMonth(untrackedSeconds, year, month)
    });
  }

  // Convert to chart data for tracked time only pie chart
  const trackedTimePieChartData = Object.entries(categoryStats)
    .filter(([_, stats]) => stats.category) // Only include categories that still exist
    .map(([categoryId, stats]) => ({
      name: stats.category.title,
      value: stats.totalSeconds,
      color: stats.category.color,
      percentage: calculatePercentage(stats.totalSeconds, totalTime),
      percentageOfMonth: calculatePercentageOfMonth(stats.totalSeconds, year, month)
    }))
    .sort((a, b) => b.value - a.value);
  
  const barChartData = Object.entries(categoryStats)
    .filter(([_, stats]) => stats.category)
    .map(([categoryId, stats]) => ({
      name: stats.category.title,
      totalSeconds: stats.totalSeconds,
      sessions: stats.sessionCount,
      color: stats.category.color
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isUntracked = payload[0].payload.name === 'Untracked Time';
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label">{`${label} : ${formatDurationHuman(payload[0].value)}`}</p>
          {!isUntracked && (
            <p className="desc">{`${payload[0].payload.percentage}% of tracked time`}</p>
          )}
          <p className="desc">{`${payload[0].payload.percentageOfMonth}% of month`}</p>
        </div>
      );
    }
    return null;
  };

  const TrackedTimeTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label">{`${label} : ${formatDurationHuman(payload[0].value)}`}</p>
          <p className="desc">{`${payload[0].payload.percentage}% of tracked time`}</p>
          <p className="desc">{`${payload[0].payload.percentageOfMonth}% of month`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label">{`${label}`}</p>
          <p className="desc">{`${formatDurationHuman(payload[0].value)}`}</p>
          <p className="desc">{`${payload[1].value} sessions`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-container">
      <div className="card">
        <h2>Analytics for {getMonthName(month)} {year}</h2>
        
        <div className="stats-summary">
          <div className="stat-item">
            <h3>Total Time</h3>
            <p className="stat-value">{formatDurationHuman(totalTime)}</p>
          </div>
          <div className="stat-item">
            <h3>Total Sessions</h3>
            <p className="stat-value">{sessions.length}</p>
          </div>
          <div className="stat-item">
            <h3>Categories Used</h3>
            <p className="stat-value">{Object.keys(categoryStats).length}</p>
          </div>
        </div>
      </div>

             <div className="grid grid-2">
         <div className="card">
           <h3>Full Month Distribution (Including Untracked)</h3>
           {fullMonthPieChartData.length > 0 ? (
             <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie
                   data={fullMonthPieChartData}
                   cx="50%"
                   cy="50%"
                   labelLine={false}
                   label={({ name, percentageOfMonth }) => `${name} (${percentageOfMonth}%)`}
                   outerRadius={80}
                   fill="#8884d8"
                   dataKey="value"
                   labelStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                 >
                   {fullMonthPieChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip content={<CustomTooltip />} />
               </PieChart>
             </ResponsiveContainer>
           ) : (
             <p className="text-center">No data available for this month</p>
           )}
         </div>

         <div className="card">
           <h3>Tracked Time Distribution</h3>
           {trackedTimePieChartData.length > 0 ? (
             <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie
                   data={trackedTimePieChartData}
                   cx="50%"
                   cy="50%"
                   labelLine={false}
                   label={({ name, percentage }) => `${name} (${percentage}%)`}
                   outerRadius={80}
                   fill="#8884d8"
                   dataKey="value"
                   labelStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                 >
                   {trackedTimePieChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip content={<TrackedTimeTooltip />} />
               </PieChart>
             </ResponsiveContainer>
           ) : (
             <p className="text-center">No tracked time available for this month</p>
           )}
         </div>

                 <div className="card">
           <h3>Time by Category (Bar Chart)</h3>
           {barChartData.length > 0 ? (
             <ResponsiveContainer width="100%" height={300}>
               <BarChart data={barChartData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                 <YAxis tickFormatter={formatDurationForAxis} />
                 <Tooltip content={<CustomBarTooltip />} />
                 <Legend />
                 <Bar dataKey="totalSeconds" fill="#8884d8" name="Duration">
                   {barChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Bar>
                 <Bar dataKey="sessions" fill="#82ca9d" name="Sessions" />
               </BarChart>
             </ResponsiveContainer>
           ) : (
             <p className="text-center">No data available for this month</p>
           )}
         </div>
      </div>

      <div className="card">
        <h3>Detailed Category Breakdown</h3>
        {Object.entries(categoryStats).length > 0 ? (
          <div className="category-breakdown">
            {Object.entries(categoryStats)
              .filter(([_, stats]) => stats.category)
              .sort(([_, a], [__, b]) => b.totalSeconds - a.totalSeconds)
              .map(([categoryId, stats]) => (
                <div key={categoryId} className="category-stat">
                  <div className="category-header">
                    <div
                      className="category-color"
                      style={{ backgroundColor: stats.category.color }}
                    />
                    <h4>{stats.category.title}</h4>
                  </div>
                  <div className="category-details">
                    <div className="stat-row">
                      <span>Total Time:</span>
                      <span>{formatDurationHuman(stats.totalSeconds)}</span>
                    </div>
                    <div className="stat-row">
                      <span>Percentage of Tracked Time:</span>
                      <span>{calculatePercentage(stats.totalSeconds, totalTime)}%</span>
                    </div>
                    <div className="stat-row">
                      <span>Percentage of Month:</span>
                      <span>{calculatePercentageOfMonth(stats.totalSeconds, year, month)}%</span>
                    </div>
                    <div className="stat-row">
                      <span>Sessions:</span>
                      <span>{stats.sessionCount}</span>
                    </div>
                    <div className="stat-row">
                      <span>Average per Session:</span>
                      <span>{formatDurationHuman(Math.round(stats.totalSeconds / stats.sessionCount))}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center">No data available for this month</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
