import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const TopPerformersCard = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Performers</h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
          No won deals to rank performers
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {data.map((performer, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  ${index === 0 ? 'bg-amber-400 shadow-amber-400/30 shadow-lg' : ''}
                  ${index === 1 ? 'bg-slate-400 shadow-slate-400/30 shadow-md' : ''}
                  ${index === 2 ? 'bg-amber-700 shadow-amber-700/30 shadow-md' : ''}
                  ${index > 2 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : ''}
                `}>
                  {index === 0 && <Trophy size={18} />}
                  {index === 1 && <Medal size={18} />}
                  {index === 2 && <Award size={18} />}
                  {index > 2 && <span>{index + 1}</span>}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{performer.name}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Sales Rep</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(performer.revenue)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Won Revenue</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPerformersCard;
