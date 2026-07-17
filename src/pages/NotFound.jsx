import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text transition-colors duration-200">
      <h1 className="text-6xl font-extrabold text-error dark:text-error mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6 text-text">Page Not Found</h2>
      <p className="text-lg text-text-secondary mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-accent dark:bg-accent text-white rounded-lg font-semibold hover:opacity-90 dark:hover:bg-accent transition duration-300 shadow-sm"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
