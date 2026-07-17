import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

const EmptyState = ({ isTotalEmpty, onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-border border-dashed rounded-xl text-center transition-colors duration-200">
      {isTotalEmpty ? (
        <>
          <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center mb-4 text-text-secondary/50 dark:text-text-secondary transition-colors">
            <Inbox size={32} />
          </div>
          <h3 className="text-lg font-bold text-text mb-1">No leads yet</h3>
          <p className="text-text-secondary max-w-sm mb-6 text-sm">
            Start by creating your first lead. Click "Add New Lead" to begin.
          </p>
        </>
      ) : (
        <>
          <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 text-accent transition-colors">
            <SearchX size={32} />
          </div>
          <h3 className="text-lg font-bold text-text mb-1">No Leads Yet</h3>
          <p className="text-text-secondary max-w-sm mb-6 text-sm">
            Start by creating your first lead. Click "Add New Lead" to begin.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-primary bg-card border border-primary hover:bg-surface rounded-lg transition-colors"
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
