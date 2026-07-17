import React from 'react';
import { UserPlus, List, Download } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-surface rounded-xl shadow-sm p-6 border border-border transition-colors duration-200">
      <h3 className="text-lg font-bold text-text mb-6">Quick Actions</h3>
      <div className="flex flex-col space-y-3">
        <button className="flex items-center w-full px-4 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-colors shadow-sm font-medium">
          <UserPlus size={18} className="mr-3" />
          Add New Lead
        </button>
        <button className="flex items-center w-full px-4 py-3 bg-surface text-text-secondary border border-border rounded-lg hover:bg-background transition-colors font-medium">
          <List size={18} className="mr-3 text-text-secondary" />
          View All Leads
        </button>
        <button className="flex items-center w-full px-4 py-3 bg-surface text-text-secondary border border-border rounded-lg hover:bg-background transition-colors font-medium">
          <Download size={18} className="mr-3 text-text-secondary" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
