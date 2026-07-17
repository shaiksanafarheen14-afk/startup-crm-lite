import React from 'react';

const RecentLeads = ({ leads }) => {
  const recentLeads = [...leads].slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-accent/20  text-blue-800 ';
      case 'Contacted': return 'bg-amber-100  text-amber-800 dark:text-warning';
      case 'Qualified': return 'bg-purple-100  text-purple-800 ';
      case 'Meeting Scheduled': return 'bg-purple-100  text-purple-800 ';
      case 'Proposal Sent': return 'bg-indigo-100  text-indigo-800 ';
      case 'Won': return 'bg-success/10  text-green-800 ';
      case 'Lost': return 'bg-red-100  text-red-800 ';
      default: return 'bg-card  text-text ';
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-nordic border border-border overflow-hidden transition-colors duration-200">
      <div className="p-6 border-b border-border flex justify-between items-center transition-colors">
        <h3 className="text-lg font-bold text-text">Recent Leads</h3>
        <button className="text-sm font-medium text-accent hover:opacity-80 transition-colors">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 text-text font-semibold text-xs uppercase tracking-wider transition-colors">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {recentLeads.map(lead => (
              <tr key={lead.id} className="even:bg-black/[0.02] dark:even:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                <td className="p-4 text-sm font-medium text-text">{lead.name}</td>
                <td className="p-4 text-sm text-text-secondary">{lead.company}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-text-secondary">{lead.date}</td>
              </tr>
            ))}
            {recentLeads.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-text-secondary text-sm">
                  No Leads Yet.
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
