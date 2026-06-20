import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LeadTable = ({ leads, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto transition-colors duration-200">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 transition-colors">
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Company</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium">Source</th>
            <th className="px-6 py-4 font-medium">Date Added</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{lead.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{lead.company}</td>
              <td className="px-6 py-4 text-sm">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{lead.email}</td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-500">{lead.source}</td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-500">{lead.date}</td>
              <td className="px-6 py-4 text-sm text-right font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                    aria-label={`Edit ${lead.name}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                    aria-label={`Delete ${lead.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
          {leads.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No leads found. Click "Add New Lead" to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
