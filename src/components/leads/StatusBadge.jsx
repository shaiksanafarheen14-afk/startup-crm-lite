import React from 'react';

const StatusBadge = ({ status }) => {
  let colorClasses = 'bg-gray-100  text-text-secondary ';
  
  switch (status) {
    case 'New':
      colorClasses = 'bg-accent/20  text-blue-800 ';
      break;
    case 'Contacted':
      colorClasses = 'bg-amber-100  text-amber-800 dark:text-warning';
      break;
    case 'Meeting Scheduled':
      colorClasses = 'bg-purple-100  text-purple-800 ';
      break;
    case 'Proposal Sent':
      colorClasses = 'bg-indigo-100  text-indigo-800 ';
      break;
    case 'Won':
      colorClasses = 'bg-success/10  text-green-800 ';
      break;
    case 'Lost':
      colorClasses = 'bg-red-100  text-red-800 ';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
