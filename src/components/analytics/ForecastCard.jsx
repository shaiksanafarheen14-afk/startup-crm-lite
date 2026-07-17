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
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-accent" />
          <h3 className="text-lg font-bold text-text">Revenue Forecast</h3>
        </div>
        <p className="text-sm text-text-secondary mb-6">Predicted revenue for next month</p>
        
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-text mb-2">
            {formatCurrency(forecast)}
          </h2>
          <div className="flex items-center gap-2 text-sm font-medium text-success bg-success/10 w-fit px-3 py-1 rounded-full">
            <TrendingUp size={16} />
            <span>+5% Expected Growth</span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-text-secondary font-medium">Confidence Score</span>
          <span className="text-text font-bold">{confidence}%</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-accent h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <p className="text-xs text-text-secondary mt-3 leading-relaxed">
          Based on historical data from the last 6 months, adjusted for current pipeline volume and average win rates.
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;
