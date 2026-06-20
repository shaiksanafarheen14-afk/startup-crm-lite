import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const LineChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Conversion Rate Trends (%)</h3>
      
      {data.every(d => d.rate === 0) ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 min-h-[300px]">
          No conversion data available for the last 6 months.
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                domain={[0, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 12 }} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Win Rate']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: isDarkMode ? '1px solid #334155' : 'none', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                  color: isDarkMode ? '#f8fafc' : '#000',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#22C55E', strokeWidth: 2, stroke: isDarkMode ? '#1e293b' : '#fff' }}
                activeDot={{ r: 6, fill: '#22C55E', strokeWidth: 0 }}
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
