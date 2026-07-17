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
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 duration-200 ${
              isActive
                ? 'bg-primary text-background shadow-nordic'
                : 'bg-card  text-text-secondary  border border-border  hover:bg-background '
            } hover:opacity-90 active:scale-[0.98]`}
            aria-pressed={isActive}
            aria-label={`Filter by ${filter}, ${count} leads`}
          >
            {filter} <span className={`ml-1 ${isActive ? 'text-blue-200' : 'text-text-secondary/50 dark:text-text-secondary'}`}>({count})</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
