import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    const timerId = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timerId);
  }, [localValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary/50 dark:text-text-secondary">
        <Search size={18} />
      </div>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm text-text placeholder:text-text-secondary/50 dark:placeholder:text-text-secondary/60"
        placeholder="Search by name, company, or email..."
        aria-label="Search leads"
      />
      
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary/50 hover:text-text-secondary transition-colors focus:outline-none"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
