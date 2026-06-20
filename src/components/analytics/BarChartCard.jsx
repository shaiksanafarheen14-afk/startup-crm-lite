import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const BarChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Leads Generated (Last 6 Months)</h3>
      
      {data.every(d => d.count === 0) ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 min-h-[300px]">
          No lead volume data for the last 6 months.
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#E2E8F0'} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                allowDecimals={false}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: isDarkMode ? '#334155' : '#F1F5F9' }}
                formatter={(value) => [`${value} leads`, 'Total']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: isDarkMode ? '1px solid #334155' : 'none', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                  color: isDarkMode ? '#f8fafc' : '#000',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#2563EB" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BarChartCard;
