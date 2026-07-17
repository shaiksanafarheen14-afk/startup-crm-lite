import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
        <p className="font-semibold text-text">{label}</p>
        <p className="text-sm text-text-secondary">
          <span className="font-bold text-purple-600">{payload[0].value}</span> Leads
        </p>
      </div>
    );
  }
  return null;
};

const LeadSourceChart = ({ data }) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-nordic h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-6">Lead Sources</h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          No source data available
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
                barSize={24}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#8B5CF6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LeadSourceChart;
