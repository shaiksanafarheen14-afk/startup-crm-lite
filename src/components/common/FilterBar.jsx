import React from 'react';

const FILTER_OPTIONS = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

const FilterBar = ({ activeFilter, onFilterChange, leads }) => {
  const getFilterCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter(lead => lead.status === filter).length;
  };

  return (
    <div className="flex overflow-x-auto pb-2 mb-2 -mx-2 px-2 scrollbar-hide space-x-2">
      {FILTER_OPTIONS.map((filter) => {
        const count = getFilterCount(filter);
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            aria-pressed={isActive}
            aria-label={`Filter by ${filter}, ${count} leads`}
          >
            {filter} <span className={`ml-1 ${isActive ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>({count})</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
