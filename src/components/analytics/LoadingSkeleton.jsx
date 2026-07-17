import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 w-48 bg-surface rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-surface rounded-md"></div>
        </div>
        <div className="h-10 w-36 bg-surface rounded-lg"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-6 flex items-center shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-surface mr-4"></div>
            <div className="flex-1">
              <div className="h-4 w-24 bg-surface rounded mb-2"></div>
              <div className="h-8 w-32 bg-surface rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-surface rounded-2xl border border-border p-6 shadow-sm">
           <div className="h-6 w-32 bg-surface rounded mb-6"></div>
           <div className="h-64 bg-surface rounded-xl"></div>
        </div>
        <div className="h-96 bg-surface rounded-2xl border border-border p-6 shadow-sm">
           <div className="h-6 w-32 bg-surface rounded mb-6"></div>
           <div className="h-64 bg-surface rounded-xl"></div>
        </div>
      </div>

      {/* Charts Skeleton Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-surface rounded-2xl border border-border p-6 shadow-sm">
           <div className="h-6 w-32 bg-surface rounded mb-6"></div>
           <div className="h-64 bg-surface rounded-xl"></div>
        </div>
        <div className="h-96 bg-surface rounded-2xl border border-border p-6 shadow-sm">
           <div className="h-6 w-32 bg-surface rounded mb-6"></div>
           <div className="h-64 bg-surface rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
