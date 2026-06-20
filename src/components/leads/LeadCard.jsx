import React from 'react';
import { Edit2, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">{lead.name}</h3>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
              <Building2 size={14} className="mr-1.5" />
              <span className="truncate">{lead.company}</span>
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Mail size={14} className="mr-2 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <Phone size={14} className="mr-2 text-slate-400 dark:text-slate-500" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => onEdit(lead)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            aria-label="Edit Lead"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            aria-label="Delete Lead"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
