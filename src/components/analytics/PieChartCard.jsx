import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-800 dark:text-white">{data.name}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{data.value} Leads</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{data.percentage}%</p>
      </div>
    );
  }
  return null;
};

const PieChartCard = ({ data, totalLeads }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Lead Status Distribution</h3>
      
      {data.length === 0 || totalLeads === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
          No data available
        </div>
      ) : (
        <div className="flex-1 relative min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={800}
                animationBegin={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="block text-3xl font-extrabold text-slate-800 dark:text-white">{totalLeads}</span>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Total Leads</span>
          </div>
        </div>
      )}
      
      {data.length > 0 && totalLeads > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 truncate">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.name] || '#94A3B8' }}></span>
                <span className="text-slate-600 dark:text-slate-300 truncate" title={entry.name}>{entry.name}</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-white pl-2">{entry.value} <span className="text-slate-400 font-normal text-xs">({entry.percentage}%)</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChartCard;
