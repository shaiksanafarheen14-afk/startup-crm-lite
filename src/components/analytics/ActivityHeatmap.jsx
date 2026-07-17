import React from 'react';

const ActivityHeatmap = ({ data }) => {
  // data is an array of last 30 days [{date, count}]
  
  const getColor = (count) => {
    if (count === 0) return 'bg-surface  border-border ';
    if (count <= 1) return 'bg-blue-200  border-blue-200 ';
    if (count <= 3) return 'bg-blue-400  border-blue-400 ';
    if (count <= 5) return 'bg-accent dark:bg-accent border-blue-500 ';
    return 'bg-accent dark:bg-accent border-blue-600 ';
  };

  // Split into weeks (cols) of days (rows)
  const weeks = [];
  let currentWeek = [];
  
  // Create a 7x5 grid approximation for 30 days
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-6">Activity Heatmap (30 Days)</h3>
      
      <div className="flex-1 flex flex-col justify-center overflow-x-auto pb-2">
        <div className="flex gap-1.5 justify-center min-w-max">
          {weeks.map((week, weekIdx) => (
            <div key={`week-${weekIdx}`} className="flex flex-col gap-1.5">
              {week.map((day, dayIdx) => (
                <div 
                  key={`day-${dayIdx}`}
                  className={`w-4 h-4 rounded-sm border ${getColor(day.count)} cursor-help transition-transform hover:scale-125`}
                  title={`${day.date}: ${day.count} activities`}
                ></div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-6 text-xs text-text-secondary">
          <span>30 days ago</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className={`w-3 h-3 rounded-sm ${getColor(0)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getColor(1)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getColor(3)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getColor(5)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getColor(6)}`}></div>
            <span>More</span>
          </div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
