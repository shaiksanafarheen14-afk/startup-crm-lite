import { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';

export const useAnalytics = () => {
  const { leads } = useLeads();
  const [dateRange, setDateRange] = useState('Last 30 Days'); // 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'Last 7 Days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Last 30 Days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'Last 90 Days':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'This Year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'All Time':
      default:
        return leads; // No filtering needed
    }

    return leads.filter(lead => {
      if (!lead.createdAt) return true; // Include if no date
      const createdDate = new Date(lead.createdAt);
      return createdDate >= startDate && createdDate <= now;
    });
  }, [leads, dateRange]);

  return {
    rawLeads: leads || [],
    leads: filteredLeads,
    dateRange,
    setDateRange
  };
};
