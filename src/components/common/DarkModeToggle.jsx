import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Animated toggle switch component for Dark Mode.
 *
 * @returns {JSX.Element} The rendered DarkModeToggle component
 */
const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
      }`}
      role="switch"
      aria-checked={isDarkMode}
      aria-label="Toggle dark mode"
    >
      <span className="sr-only">Toggle dark mode</span>
      
      {/* The sliding circle */}
      <span
        className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-sm flex items-center justify-center ${
          isDarkMode ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDarkMode ? (
          <Moon size={14} className="text-blue-600" />
        ) : (
          <Sun size={14} className="text-amber-500" />
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;
