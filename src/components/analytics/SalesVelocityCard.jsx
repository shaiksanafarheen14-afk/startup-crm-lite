import React from 'react';
import { Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const SalesVelocityCard = ({ velocity, previousVelocity }) => {
  const trend = previousVelocity > 0 
    ? Math.round(((velocity - previousVelocity) / previousVelocity) * 100)
    : (velocity > 0 ? 100 : 0);
    
  const isPositive = trend >= 0;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-md h-full flex flex-col justify-between relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-indigo-100">Sales Velocity</h3>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Zap size={20} className="text-amber-300" />
          </div>
        </div>
        
        <div>
          <div className="flex items-end gap-2 mb-2">
            <h2 className="text-3xl font-bold">{formatCurrency(velocity)}</h2>
            <span className="text-indigo-200 text-sm mb-1">/day</span>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/20 text-rose-100'}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="text-indigo-200">vs previous period</span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 pt-4 border-t border-indigo-400/30">
        <p className="text-xs text-indigo-200 leading-relaxed">
          Velocity = (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length. It measures how fast you're making money.
        </p>
      </div>
    </div>
  );
};

export default SalesVelocityCard;
