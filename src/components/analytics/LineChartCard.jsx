import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
        <p className="font-semibold text-text">{label}</p>
        <p className="text-sm text-text-secondary">
          Conversion: <span className="font-bold text-success">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const LineChartCard = ({ data }) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-nordic h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-6">Monthly Conversion Trend</h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          No data available for this period
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LineChartCard;
