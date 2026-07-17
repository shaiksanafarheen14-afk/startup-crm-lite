import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';
import { useTheme } from './context/ThemeContext';
import DarkModeToggle from './components/common/DarkModeToggle';

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <BrowserRouter>
      {/* 
        Main layout container. 
        Mobile: Flex Column (Header -> Content -> Bottom Nav)
        Tablet/Desktop: Flex Row (Sidebar -> Content)
      */}
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-text font-sans transition-colors duration-200">
        
        {/* Mobile Top Header - Visible only on < md */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-border sticky top-0 z-40 shadow-sm transition-colors duration-200">
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-success dark:from-accent dark:to-success">
            Startup CRM
          </h1>
          <DarkModeToggle />
        </header>

        {/* Sidebar / Bottom Nav Component */}
        <Sidebar />
        
        {/* 
          Main Content Area 
          Padding-bottom 16 (4rem) on mobile to ensure content isn't hidden behind the fixed bottom bar 
        */}
        <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0 w-full">
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'font-medium  ',
              style: isDarkMode ? { background: '#1E293B', color: '#F8FAFC' } : {},
              success: {
                style: { background: '#10B981', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#10B981' },
              },
              error: {
                style: { background: '#EF4444', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#EF4444' },
              },
            }} 
          />
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;