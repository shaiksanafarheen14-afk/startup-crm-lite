import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const PieChartCard = ({ data }) => {
  const { isDarkMode } = useTheme();
  const totalLeads = data.reduce((sum, entry) => sum + entry.value, 0);

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
        {payload.map((entry, index) => {
          const percent = totalLeads > 0 ? Math.round((entry.payload.value / totalLeads) * 100) : 0;
          return (
            <li key={`item-${index}`} className="flex items-center space-x-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">{entry.value}</span>
              <span className="text-slate-800 dark:text-white">{entry.payload.value}</span>
              <span className="text-slate-400 dark:text-slate-500">({percent}%)</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Lead Status Distribution</h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
          No data available for distribution.
        </div>
      ) : (
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
                stroke={isDarkMode ? '#1e293b' : 'none'}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} leads`, 'Count']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: isDarkMode ? '1px solid #334155' : 'none', 
                  backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                  color: isDarkMode ? '#f8fafc' : '#000',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PieChartCard;
