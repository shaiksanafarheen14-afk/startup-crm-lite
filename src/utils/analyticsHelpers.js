/**
 * Helper functions for processing CRM Analytics data.
 * Built to be pure and defensive against null values.
 */

// Helper to normalize status names
const normalizeStatus = (status) => {
  if (!status) return 'New';
  if (status === 'Meeting Scheduled') return 'Meeting';
  if (status === 'Proposal Sent') return 'Proposal';
  return status;
};

// Map normalized status back to full status if needed for specific logic
const FULL_STATUS_MAP = {
  'New': 'New',
  'Contacted': 'Contacted',
  'Meeting': 'Meeting Scheduled',
  'Proposal': 'Proposal Sent',
  'Won': 'Won',
  'Lost': 'Lost'
};

export const getStatusDistribution = (leads = []) => {
  const counts = leads.reduce((acc, lead) => {
    const status = normalizeStatus(lead.status);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const total = leads.length;

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
  })).sort((a, b) => b.value - a.value); // Descending
};

const getMonthName = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('default', { month: 'short' });
};

export const getMonthlyLeads = (leads = []) => {
  // Group by last 6 months
  const months = {};
  const now = new Date();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleDateString('default', { month: 'short' });
    months[monthName] = 0;
  }

  leads.forEach(lead => {
    if (!lead.createdAt) return;
    const leadDate = new Date(lead.createdAt);
    // Only count if within the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    if (leadDate >= sixMonthsAgo) {
      const monthName = getMonthName(lead.createdAt);
      if (months[monthName] !== undefined) {
        months[monthName]++;
      }
    }
  });

  return Object.entries(months).map(([name, leads]) => ({ name, leads }));
};

export const getConversionByMonth = (leads = []) => {
  const monthlyData = {};
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleDateString('default', { month: 'short' });
    monthlyData[monthName] = { total: 0, won: 0 };
  }

  leads.forEach(lead => {
    if (!lead.createdAt) return;
    const leadDate = new Date(lead.createdAt);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    if (leadDate >= sixMonthsAgo) {
      const monthName = getMonthName(lead.createdAt);
      if (monthlyData[monthName] !== undefined) {
        monthlyData[monthName].total++;
        if (lead.status === 'Won') {
          monthlyData[monthName].won++;
        }
      }
    }
  });

  return Object.entries(monthlyData).map(([name, data]) => ({
    name,
    rate: data.total > 0 ? Math.round((data.won / data.total) * 100) : 0
  }));
};

export const getRevenueByMonth = (leads = []) => {
  const monthlyData = {};
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleDateString('default', { month: 'short' });
    monthlyData[monthName] = 0;
  }

  leads.forEach(lead => {
    if (lead.status !== 'Won' || !lead.wonAt) return;
    const wonDate = new Date(lead.wonAt);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    if (wonDate >= sixMonthsAgo) {
      const monthName = getMonthName(lead.wonAt);
      if (monthlyData[monthName] !== undefined) {
        // Fallback value to 0 if not set or parseable
        const val = typeof lead.value === 'number' ? lead.value : parseFloat(lead.value || 0);
        monthlyData[monthName] += val;
      }
    }
  });

  return Object.entries(monthlyData).map(([name, revenue]) => ({ name, revenue }));
};

export const getPipelineValue = (leads = []) => {
  return leads
    .filter(lead => lead.status !== 'Won' && lead.status !== 'Lost')
    .reduce((sum, lead) => {
       const val = typeof lead.value === 'number' ? lead.value : parseFloat(lead.value || 0);
       return sum + val;
    }, 0);
};

export const getWonRevenue = (leads = []) => {
  return leads
    .filter(lead => lead.status === 'Won')
    .reduce((sum, lead) => {
       const val = typeof lead.value === 'number' ? lead.value : parseFloat(lead.value || 0);
       return sum + val;
    }, 0);
};

export const getAverageSalesCycle = (leads = []) => {
  const wonLeads = leads.filter(lead => lead.status === 'Won' && lead.createdAt && lead.wonAt);
  if (wonLeads.length === 0) return 0;

  const totalDays = wonLeads.reduce((sum, lead) => {
    const created = new Date(lead.createdAt);
    const won = new Date(lead.wonAt);
    const diffTime = Math.abs(won - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  return Math.round(totalDays / wonLeads.length);
};

export const getLostRate = (leads = []) => {
  if (leads.length === 0) return 0;
  const lostCount = leads.filter(lead => lead.status === 'Lost').length;
  return Math.round((lostCount / leads.length) * 100);
};

export const getLeadSourceStats = (leads = []) => {
  const sources = leads.reduce((acc, lead) => {
    const source = lead.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(sources)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getFunnelData = (leads = []) => {
  const stages = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won'];
  const funnelCounts = {
    'New': 0, 'Contacted': 0, 'Meeting': 0, 'Proposal': 0, 'Won': 0
  };

  // Funnel logic: A lead in "Won" was implicitly in all previous stages.
  // In a real CRM, we'd look at stage transitions. Here we simulate it.
  leads.forEach(lead => {
    const s = normalizeStatus(lead.status);
    if (s === 'Lost') return; // Exclude lost deals from the main active funnel count for dropoff
    
    // Increment counts for current and all preceding stages
    const stageIndex = stages.indexOf(s);
    if (stageIndex !== -1) {
      for (let i = 0; i <= stageIndex; i++) {
        funnelCounts[stages[i]]++;
      }
    } else if (lead.status === 'Lost') {
       // If lost, we might just track them up to their lost point, but skipping for simple funnel
    }
  });

  return stages.map((stage, index) => {
    const count = funnelCounts[stage];
    const prevCount = index === 0 ? count : funnelCounts[stages[index - 1]];
    const conversion = prevCount > 0 ? Math.round((count / prevCount) * 100) : (count > 0 ? 100 : 0);
    
    return {
      name: stage,
      value: count,
      conversion: conversion,
      fill: `var(--color-${stage.toLowerCase()})` // Used in UI for coloring
    };
  });
};

export const getSalesVelocity = (leads = []) => {
  // (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length
  const activeOpportunities = leads.filter(l => l.status !== 'Lost' && l.status !== 'Won').length;
  
  const wonCount = leads.filter(l => l.status === 'Won').length;
  const closedCount = leads.filter(l => l.status === 'Won' || l.status === 'Lost').length;
  const winRate = closedCount > 0 ? (wonCount / closedCount) : 0;
  
  const wonRev = getWonRevenue(leads);
  const avgDealSize = wonCount > 0 ? (wonRev / wonCount) : 0;
  
  const avgSalesCycle = getAverageSalesCycle(leads) || 30; // fallback to 30 days if 0
  
  if (avgSalesCycle === 0) return 0;

  const velocity = (activeOpportunities * winRate * avgDealSize) / avgSalesCycle;
  return Math.round(velocity);
};

export const getForecastRevenue = (leads = []) => {
  // Average Revenue of Last 6 Months
  const monthlyRevenueData = getRevenueByMonth(leads);
  const total6MoRevenue = monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  
  const monthsWithRevenue = monthlyRevenueData.filter(item => item.revenue > 0).length || 1;
  
  // Forecast for next month is average of the last active months, slightly inflated by 5%
  return Math.round((total6MoRevenue / monthsWithRevenue) * 1.05);
};

export const getTopPerformers = (leads = []) => {
  const performance = leads
    .filter(lead => lead.status === 'Won' && lead.owner)
    .reduce((acc, lead) => {
       const val = typeof lead.value === 'number' ? lead.value : parseFloat(lead.value || 0);
       acc[lead.owner] = (acc[lead.owner] || 0) + val;
       return acc;
    }, {});

  return Object.entries(performance)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Top 5
};

export const getActivityHeatmapData = (leads = []) => {
  // Create a 30-day heatmap data structure
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Count activities for this day
    let count = 0;
    leads.forEach(lead => {
      const created = lead.createdAt ? lead.createdAt.split('T')[0] : null;
      const contacted = lead.contactedAt ? lead.contactedAt.split('T')[0] : null;
      const meeting = lead.meetingAt ? lead.meetingAt.split('T')[0] : null;
      const won = lead.wonAt ? lead.wonAt.split('T')[0] : null;

      if (created === dateStr) count++;
      if (contacted === dateStr) count++;
      if (meeting === dateStr) count++;
      if (won === dateStr) count++;
    });

    data.push({
      date: dateStr,
      count
    });
  }
  
  return data;
};
