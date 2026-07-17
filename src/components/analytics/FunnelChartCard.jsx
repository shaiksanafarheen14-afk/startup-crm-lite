import React from 'react';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface border border-border p-3 rounded-lg shadow-lg z-50">
        <p className="font-semibold text-text">{data.name}</p>
        <div className="mt-1">
          <p className="text-sm text-text-secondary"><span className="font-medium text-text">{data.value}</span> Leads</p>
          <p className="text-xs text-text-secondary mt-1">Conversion from previous: <span className="font-medium text-text-secondary">{data.conversion}%</span></p>
          {data.conversion < 100 && data.conversion > 0 && (
             <p className="text-xs text-error dark:text-error">Drop-off: {100 - data.conversion}%</p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const FunnelChartCard = ({ data }) => {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-6">Sales Funnel</h3>
      
      {data.length === 0 || data.every(d => d.value === 0) ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
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
