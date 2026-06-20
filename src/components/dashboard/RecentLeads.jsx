import React from 'react';

const RecentLeads = ({ leads }) => {
  const recentLeads = [...leads].slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300';
      case 'Contacted': return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300';
      case 'Qualified': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300';
      case 'Meeting Scheduled': return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300';
      case 'Proposal Sent': return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300';
      case 'Won': return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
      case 'Lost': return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Leads</h3>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider transition-colors">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {recentLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-4 text-sm font-medium text-slate-800 dark:text-white">{lead.name}</td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{lead.company}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{lead.date}</td>
              </tr>
            ))}
            {recentLeads.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
