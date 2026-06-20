import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-200">
      <h1 className="text-6xl font-extrabold text-red-500 dark:text-red-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Page Not Found</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 shadow-sm"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
