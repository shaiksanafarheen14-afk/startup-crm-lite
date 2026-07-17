import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LeadTable = ({ leads, onEdit, onDelete }) => {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border overflow-x-auto transition-colors duration-200">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-background text-text-secondary text-xs uppercase tracking-wider border-b border-border transition-colors">
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
            <tr key={lead.id} className="hover:bg-background transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-text">{lead.name}</td>
              <td className="px-6 py-4 text-sm text-text-secondary">{lead.company}</td>
              <td className="px-6 py-4 text-sm">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 text-sm text-text-secondary">{lead.email}</td>
              <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-secondary">{lead.source}</td>
              <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-secondary">{lead.date}</td>
              <td className="px-6 py-4 text-sm text-right font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 text-accent hover:bg-accent/20 rounded transition-colors"
                    aria-label={`Edit ${lead.name}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    className="p-1.5 text-error dark:text-error hover:bg-error/10 rounded transition-colors"
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
              <td colSpan="7" className="px-6 py-8 text-center text-text-secondary text-sm">
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
