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
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-6">Top Performers</h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          No won deals to rank performers
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {data.map((performer, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  ${index === 0 ? 'bg-amber-400 shadow-amber-400/30 shadow-lg' : ''}
                  ${index === 1 ? 'bg-slate-400 shadow-slate-400/30 shadow-md' : ''}
                  ${index === 2 ? 'bg-amber-700 shadow-amber-700/30 shadow-md' : ''}
                  ${index > 2 ? 'bg-accent/20 text-accent  ' : ''}
                `}>
                  {index === 0 && <Trophy size={18} />}
                  {index === 1 && <Medal size={18} />}
                  {index === 2 && <Award size={18} />}
                  {index > 2 && <span>{index + 1}</span>}
                </div>
                <div>
                  <p className="font-bold text-text">{performer.name}</p>
                  <p className="text-xs font-medium text-text-secondary mt-0.5">Sales Rep</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">
                  {formatCurrency(performer.revenue)}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">Won Revenue</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPerformersCard;
