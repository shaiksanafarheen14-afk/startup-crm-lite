// Import React and the lazy/Suspense utilities for code splitting and lazy loading
import React, { lazy, Suspense } from 'react';
// Import routing components from react-router-dom
import { Routes, Route } from 'react-router-dom';

// Lazy load the Dashboard component. It will only be fetched when the user visits the '/' route
const Dashboard = lazy(() => import('../pages/Dashboard'));
// Lazy load the Leads component. It will only be fetched when the user visits the '/leads' route
const Leads = lazy(() => import('../pages/Leads'));
// Lazy load the Analytics component. It will only be fetched when the user visits the '/analytics' route
const Analytics = lazy(() => import('../pages/Analytics'));
// Lazy load the NotFound component. It will act as the catch-all for undefined routes
const NotFound = lazy(() => import('../pages/NotFound'));

// Define the AppRoutes component which contains all the application route definitions
const AppRoutes = () => {
  // Return the JSX for the routing configuration
  return (
    // Suspense is required when using React.lazy. It displays a fallback UI while the chunk is downloading.
    <Suspense 
      // The fallback prop takes a React element to render while waiting for the lazy component to load
      fallback={
        // A simple loading spinner/message centered on the screen
        <div className="flex-1 flex items-center justify-center min-h-screen">
          {/* Loading text with a basic pulse animation from Tailwind CSS */}
          <div className="text-xl font-semibold text-gray-500 dark:text-gray-400 animate-pulse">Loading...</div>
        {/* Close loading container */}
        </div>
      }
    >
      {/* Routes component acts as a switch, rendering only the first Route that matches the current location */}
      <Routes>
        {/* Define the home route ('/') which renders the Dashboard component */}
        <Route path="/" element={<Dashboard />} />
        {/* Define the leads route ('/leads') which renders the Leads component */}
        <Route path="/leads" element={<Leads />} />
        {/* Define the analytics route ('/analytics') which renders the Analytics component */}
        <Route path="/analytics" element={<Analytics />} />
        {/* The '*' path acts as a wildcard catch-all for any routes not explicitly defined above */}
        <Route path="*" element={<NotFound />} />
      {/* Close Routes component */}
      </Routes>
    {/* Close Suspense boundary */}
    </Suspense>
  // Close return statement
  );
// Close AppRoutes component definition
};

// Export AppRoutes as the default export to be used in App.jsx
export default AppRoutes;
