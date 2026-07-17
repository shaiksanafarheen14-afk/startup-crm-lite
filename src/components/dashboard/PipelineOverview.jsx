import React from 'react';

const PipelineOverview = ({ leads }) => {
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const totalLeads = leads.length || 1;

  const segments = [
    { id: 'New', label: 'New', count: statusCounts['New'] || 0, color: 'bg-accent dark:bg-accent' },
    { id: 'Contacted', label: 'Contacted', count: statusCounts['Contacted'] || 0, color: 'bg-amber-500 ' },
    { id: 'Qualified', label: 'Qualified', count: statusCounts['Qualified'] || 0, color: 'bg-purple-500 ' },
    { id: 'Closed', label: 'Closed Won', count: statusCounts['Won'] || 0, color: 'bg-green-500 ' },
  ];

  return (
    <div className="bg-card rounded-xl shadow-nordic p-6 border border-border transition-colors duration-200">
      <h3 className="text-lg font-bold text-text mb-6">Pipeline Overview</h3>
      
      <div className="h-4 w-full flex rounded-full overflow-hidden mb-4 bg-card">
        {segments.map(segment => {
          const percentage = (segment.count / totalLeads) * 100;
          if (percentage === 0) return null;
          return (
            <div
              key={segment.id}
              className={`${segment.color} h-full transition-all duration-500`}
              style={{ width: `${percentage}%` }}
              title={`${segment.label}: ${segment.count}`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {segments.map(segment => (
          <div key={segment.id} className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${segment.color.split(' ')[0]} dark:${segment.color.split(' ')[1]}`}></span>
            <div>
              <p className="text-xs text-text-secondary">{segment.label}</p>
              <p className="text-sm font-semibold text-text">{segment.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineOverview;
