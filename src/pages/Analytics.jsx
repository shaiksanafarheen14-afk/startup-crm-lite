import React from 'react';
import { useLeads } from '../context/LeadContext';
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import EmptyState from '../components/common/EmptyState';
import { Users, Target, Clock } from 'lucide-react';
import { getStatusDistribution, getMonthlyLeads, getConversionByMonth } from '../utils/analyticsHelpers';

const Analytics = () => {
  const { leads } = useLeads();

  const totalLeads = leads.length;
  const wonLeads = leads.filter(lead => lead.status === 'Won').length;
  const wonRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;
  
  const avgTimeToClose = wonLeads > 0 ? '14 Days' : 'N/A';

  const pieChartData = getStatusDistribution(leads);
  const barChartData = getMonthlyLeads(leads);
  const lineChartData = getConversionByMonth(leads);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-200 relative">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Analytics Overview</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">Deep dive into your sales pipeline and performance metrics.</p>
      </div>

      {leads.length === 0 ? (
        <div className="max-w-xl mx-auto mt-8 md:mt-12">
          <EmptyState isTotalEmpty={true} />
        </div>
      ) : (
        <>
          {/* Summary Stats Cards Row: 1col on mobile, 3col on tablet/desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200 p-6 flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Leads</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{totalLeads}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200 p-6 flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg mr-4">
                <Target size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Global Win Rate</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{wonRate}%</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200 p-6 flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg mr-4">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Time to Close</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{avgTimeToClose}</h3>
              </div>
            </div>
          </div>

          {/* Charts Grid: 1col on mobile, 2col on tablet+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-1 w-full">
              <PieChartCard data={pieChartData} />
            </div>
            <div className="md:col-span-1 w-full">
              <BarChartCard data={barChartData} />
            </div>
            <div className="md:col-span-2 w-full">
              <LineChartCard data={lineChartData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
