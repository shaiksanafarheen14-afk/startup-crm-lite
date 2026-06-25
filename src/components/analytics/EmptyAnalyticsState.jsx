import React from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        No analytics available yet
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Add your first lead to start tracking business performance, monitor conversion rates, and forecast revenue.
      </p>
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
      >
        <Plus size={18} />
        Add Lead
      </button>
    </div>
  );
};

export default EmptyAnalyticsState;
