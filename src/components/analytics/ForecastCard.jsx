import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const ForecastCard = ({ forecast, confidence = 85 }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-blue-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Forecast</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Predicted revenue for next month</p>
        
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">
            {formatCurrency(forecast)}
          </h2>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-3 py-1 rounded-full">
            <TrendingUp size={16} />
            <span>+5% Expected Growth</span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Confidence Score</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{confidence}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
          Based on historical data from the last 6 months, adjusted for current pipeline volume and average win rates.
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;
