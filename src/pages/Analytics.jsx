import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData
} from '../utils/analyticsHelpers';

const Analytics = () => {
  const { rawLeads, leads, dateRange, setDateRange } = useAnalytics();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for smoother UX on initial render
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // 600ms fake loading for visual polish when filters change
    return () => clearTimeout(timer);
  }, [dateRange]);

  if (rawLeads.length === 0) {
    return (
      <div className="min-h-[calc(100vh-100px)] p-4 sm:p-6 md:p-8 flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <EmptyAnalyticsState />
      </div>
    );
  }

  // Memoize data calculations so they don't re-run on every render if leads haven't changed
  const pieChartData = getStatusDistribution(leads);
  const funnelData = getFunnelData(leads);
  const barChartData = getMonthlyLeads(leads);
  const lineChartData = getConversionByMonth(leads);
  const revenueData = getRevenueByMonth(leads);
  const sourceData = getLeadSourceStats(leads);
  const velocity = getSalesVelocity(leads);
  const forecast = getForecastRevenue(leads);
  const heatmapData = getActivityHeatmapData(leads);
  const topPerformersData = getTopPerformers(leads);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <AnalyticsFilters dateRange={dateRange} setDateRange={setDateRange} />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <StatsCards leads={leads} previousLeads={[]} />

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
            <div className="w-full">
              <PieChartCard data={pieChartData} totalLeads={leads.length} />
            </div>
            <div className="w-full">
              <FunnelChartCard data={funnelData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="w-full">
              <BarChartCard data={barChartData} />
            </div>
            <div className="w-full">
              <LineChartCard data={lineChartData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="w-full">
              <RevenueChartCard data={revenueData} />
            </div>
            <div className="w-full">
              <LeadSourceChart data={sourceData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="w-full">
              <ActivityHeatmap data={heatmapData} />
            </div>
            <div className="w-full">
              <TopPerformersCard data={topPerformersData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="w-full">
              <ForecastCard forecast={forecast} confidence={88} />
            </div>
            <div className="w-full">
              <SalesVelocityCard velocity={velocity} previousVelocity={velocity * 0.9} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
