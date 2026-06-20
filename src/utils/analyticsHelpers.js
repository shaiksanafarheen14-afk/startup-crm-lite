/**
 * Utility functions to transform raw leads data into chart-friendly formats for Recharts.
 */

/**
 * Generates an array representing the last 6 months, useful for X-axis labels.
 * @returns {Array<{label: string, year: number, month: number}>} Array of month objects
 */
const getLast6Months = () => {
  const months = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const pastDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
    months.push({
      label: pastDate.toLocaleDateString('en-US', { month: 'short' }),
      year: pastDate.getFullYear(),
      month: pastDate.getMonth(), // 0-indexed month
    });
  }
  return months;
};

/**
 * Transforms leads into a format suitable for the Pie Chart.
 * Maps statuses to the requested specific colors.
 * 
 * @param {Array} leads - The raw leads array
 * @returns {Array<{name: string, value: number, color: string}>} Data array for Recharts PieChart
 */
export const getStatusDistribution = (leads) => {
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const data = [
    { name: 'New', value: statusCounts['New'] || 0, color: '#94A3B8' },
    { name: 'Contacted', value: statusCounts['Contacted'] || 0, color: '#2563EB' },
    { name: 'Meeting Scheduled', value: statusCounts['Meeting Scheduled'] || 0, color: '#F59E0B' },
    { name: 'Proposal Sent', value: statusCounts['Proposal Sent'] || 0, color: '#7C3AED' },
    { name: 'Won', value: statusCounts['Won'] || 0, color: '#22C55E' },
    { name: 'Lost', value: statusCounts['Lost'] || 0, color: '#EF4444' },
  ];

  // Filter out categories with zero leads to keep the pie chart clean
  return data.filter(item => item.value > 0);
};

/**
 * Groups leads by month over the last 6 months for the Bar Chart.
 * 
 * @param {Array} leads - The raw leads array
 * @returns {Array<{name: string, count: number}>} Data array for Recharts BarChart
 */
export const getMonthlyLeads = (leads) => {
  const months = getLast6Months();
  
  // Initialize the count for each of the last 6 months
  const data = months.map(m => ({ name: m.label, count: 0, _year: m.year, _month: m.month }));

  leads.forEach(lead => {
    // Note: createdAt should be an ISO string
    const d = new Date(lead.createdAt || lead.date); // Fallback to 'date' if createdAt is missing
    const leadMonth = d.getMonth();
    const leadYear = d.getFullYear();
    
    // Increment count if the lead falls within our 6-month window
    const targetMonth = data.find(m => m._year === leadYear && m._month === leadMonth);
    if (targetMonth) {
      targetMonth.count++;
    }
  });

  return data.map(item => ({ name: item.name, count: item.count }));
};

/**
 * Calculates the percentage of 'Won' leads versus 'Total' leads created in each of the last 6 months.
 * 
 * @param {Array} leads - The raw leads array
 * @returns {Array<{name: string, rate: number}>} Data array for Recharts LineChart
 */
export const getConversionByMonth = (leads) => {
  const months = getLast6Months();
  
  const data = months.map(m => ({ name: m.label, total: 0, won: 0, _year: m.year, _month: m.month }));

  leads.forEach(lead => {
    const d = new Date(lead.createdAt || lead.date);
    const leadMonth = d.getMonth();
    const leadYear = d.getFullYear();
    
    const targetMonth = data.find(m => m._year === leadYear && m._month === leadMonth);
    if (targetMonth) {
      targetMonth.total++;
      if (lead.status === 'Won') {
        targetMonth.won++;
      }
    }
  });

  // Calculate percentage format (0 to 100)
  return data.map(item => ({
    name: item.name,
    rate: item.total > 0 ? parseFloat(((item.won / item.total) * 100).toFixed(1)) : 0
  }));
};
