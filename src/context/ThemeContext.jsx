import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean} isDarkMode - True if the dark theme is currently active
 * @property {function(): void} toggleTheme - Function to toggle the theme between light and dark
 */

// Create Context with a null initial value
export const ThemeContext = createContext(null);

/**
 * Helper to determine the default system theme preference.
 * Safe to call even in SSR environments.
 * @returns {boolean} True if the system prefers dark mode
 */
const getSystemThemePreference = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

/**
 * Provider component that manages application theme state.
 * Automatically synchronizes the 'dark' class on the document root element
 * and persists the user's preference to localStorage via useLocalStorage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The rendered Provider
 */
export const ThemeProvider = ({ children }) => {
  // Use custom hook to handle state and localStorage sync seamlessly.
  // Defaults to system preference if no user preference is stored.
  const [isDarkMode, setIsDarkMode] = useLocalStorage('startup-crm-theme', getSystemThemePreference());

  // Apply or remove the 'dark' tailwind class on the root html element whenever state changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggles the application theme between light and dark modes.
   */
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to consume the ThemeContext.
 * Ensures the hook is used within a valid ThemeProvider.
 *
 * @returns {ThemeContextValue} The theme context value containing state and toggle function
 * @throws {Error} If called outside of a ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
