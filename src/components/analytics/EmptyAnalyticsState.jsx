import React from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface rounded-2xl border border-border shadow-sm text-center">
      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-accent" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">
        No analytics available yet
      </h3>
      <p className="text-text-secondary max-w-md mb-8">
        Add your first lead to start tracking business performance, monitor conversion rates, and forecast revenue.
      </p>
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 bg-accent hover:opacity-90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
      >
        <Plus size={18} />
        Add Lead
      </button>
    </div>
  );
};

export default EmptyAnalyticsState;
