import React from 'react';

const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  const colorMap = {
    primary: 'text-accent  bg-accent/20 ',
    success: 'text-green-500  bg-success/10 ',
    warning: 'text-warning  bg-amber-100 ',
    danger: 'text-error dark:text-error bg-red-100 ',
  };

  const isPositiveChange = change >= 0;

  return (
    <div className="bg-surface rounded-xl shadow-sm p-6 border border-border hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color] || colorMap.primary}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${isPositiveChange ? 'text-green-500 ' : 'text-error dark:text-error'}`}>
          {isPositiveChange ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-text-secondary ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
