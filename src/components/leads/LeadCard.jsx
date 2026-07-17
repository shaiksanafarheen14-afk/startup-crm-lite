import React from 'react';
import { Edit2, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-text truncate">{lead.name}</h3>
            <div className="flex items-center text-text-secondary text-sm mt-1">
              <Building2 size={14} className="mr-1.5" />
              <span className="truncate">{lead.company}</span>
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex items-center text-sm text-text-secondary">
            <Mail size={14} className="mr-2 text-slate-400 dark:text-text-secondary" />
            <span className="truncate">{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center text-sm text-text-secondary">
              <Phone size={14} className="mr-2 text-slate-400 dark:text-text-secondary" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <button
            onClick={() => onEdit(lead)}
            className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
            aria-label="Edit Lead"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-2 text-error dark:text-error hover:bg-error/10 rounded-lg transition-colors"
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
