import React from 'react';
import { UserPlus, List, Download } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h3>
      <div className="flex flex-col space-y-3">
        <button className="flex items-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
          <UserPlus size={18} className="mr-3" />
          Add New Lead
        </button>
        <button className="flex items-center w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium">
          <List size={18} className="mr-3 text-slate-500 dark:text-slate-400" />
          View All Leads
        </button>
        <button className="flex items-center w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium">
          <Download size={18} className="mr-3 text-slate-500 dark:text-slate-400" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
