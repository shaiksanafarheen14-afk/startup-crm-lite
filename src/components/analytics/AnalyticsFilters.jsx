import React from 'react';
import { Calendar } from 'lucide-react';

const AnalyticsFilters = ({ dateRange, setDateRange }) => {
  const options = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-sm md:text-base text-text-secondary mt-1">
          Track sales performance and growth trends.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 shadow-nordic">
        <Calendar size={16} className="text-text-secondary/50 ml-2" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-transparent border-none text-sm font-medium text-text-secondary focus:ring-0 py-2 pr-8 pl-2 cursor-pointer outline-none appearance-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
