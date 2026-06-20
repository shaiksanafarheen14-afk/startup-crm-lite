import React from 'react';

const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  const colorMap = {
    primary: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40',
    success: 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/40',
    warning: 'text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
    danger: 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/40',
  };

  const isPositiveChange = change >= 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color] || colorMap.primary}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${isPositiveChange ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
          {isPositiveChange ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
