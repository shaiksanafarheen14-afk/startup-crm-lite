import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded-lg shadow-lg">
        <p className="font-semibold text-text">{label}</p>
        <p className="text-sm text-text-secondary">
          <span className="font-bold text-accent">{payload[0].value}</span> Leads
        </p>
      </div>
    );
  }
  return null;
};

const BarChartCard = ({ data }) => {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-6">Monthly Leads Trend</h3>
      
      {data.length === 0 || data.every(d => d.leads === 0) ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          No data available for this period
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
              <Bar 
                dataKey="leads" 
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#3B82F6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BarChartCard;
