import React from 'react';

const StatusBadge = ({ status }) => {
  let colorClasses = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  
  switch (status) {
    case 'New':
      colorClasses = 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300';
      break;
    case 'Contacted':
      colorClasses = 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300';
      break;
    case 'Meeting Scheduled':
      colorClasses = 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300';
      break;
    case 'Proposal Sent':
      colorClasses = 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300';
      break;
    case 'Won':
      colorClasses = 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
      break;
    case 'Lost':
      colorClasses = 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300';
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
