import React from 'react';
import { UserPlus, List, Download } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-card rounded-xl shadow-nordic p-6 border border-border transition-colors duration-200">
      <h3 className="text-lg font-bold text-text mb-6">Quick Actions</h3>
      <div className="flex flex-col space-y-3">
        <button className="flex items-center w-full px-4 py-3 bg-primary text-background rounded-lg hover:opacity-90 transition-all duration-200 shadow-nordic font-medium active:scale-[0.98]">
          <UserPlus size={18} className="mr-3" />
          Add New Lead
        </button>
        <button className="flex items-center w-full px-4 py-3 bg-card text-text-secondary border border-border rounded-lg hover:bg-background transition-colors font-medium">
          <List size={18} className="mr-3 text-text-secondary" />
          View All Leads
        </button>
        <button className="flex items-center w-full px-4 py-3 bg-card text-text-secondary border border-border rounded-lg hover:bg-background transition-colors font-medium">
          <Download size={18} className="mr-3 text-text-secondary" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
