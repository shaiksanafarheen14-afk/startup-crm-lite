import React from 'react';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg z-50">
        <p className="font-semibold text-slate-800 dark:text-white">{data.name}</p>
        <div className="mt-1">
          <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium text-slate-900 dark:text-slate-100">{data.value}</span> Leads</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Conversion from previous: <span className="font-medium text-slate-700 dark:text-slate-300">{data.conversion}%</span></p>
          {data.conversion < 100 && data.conversion > 0 && (
             <p className="text-xs text-red-500 dark:text-red-400">Drop-off: {100 - data.conversion}%</p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const FunnelChartCard = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Sales Funnel</h3>
      
      {data.length === 0 || data.every(d => d.value === 0) ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
          No active funnel data
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.fill || '#3B82F6'} />
                ))}
                <LabelList position="right" fill="#64748B" stroke="none" dataKey="name" />
                <LabelList position="center" fill="#fff" stroke="none" dataKey="value" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FunnelChartCard;
