import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

const EmptyState = ({ isTotalEmpty, onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-dashed rounded-xl text-center transition-colors duration-200">
      {isTotalEmpty ? (
        <>
          <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 transition-colors">
            <Inbox size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No leads yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Your pipeline is empty. Click "Add Lead" to create your first prospect and get started.
          </p>
        </>
      ) : (
        <>
          <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-500 dark:text-blue-400 transition-colors">
            <SearchX size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No leads found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            We couldn't find any leads matching your current search or filter criteria.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EmptyState;
