import React, { useMemo } from 'react';
import { Users, Target, IndianRupee, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import {
  getLostRate,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle
} from '../../utils/analyticsHelpers';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const StatsCards = ({ leads, previousLeads }) => {
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const prevTotalLeads = previousLeads?.length || 0;
    
    // Total Leads Growth
    let totalGrowth = 0;
    if (prevTotalLeads > 0) {
      totalGrowth = Math.round(((totalLeads - prevTotalLeads) / prevTotalLeads) * 100);
    } else if (totalLeads > 0) {
      totalGrowth = 100;
    }

    // Conversion Rate
    const wonCount = leads.filter(l => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;
    
    const prevWonCount = (previousLeads || []).filter(l => l.status === 'Won').length;
    const prevConversionRate = prevTotalLeads > 0 ? Math.round((prevWonCount / prevTotalLeads) * 100) : 0;
    const convGrowth = conversionRate - prevConversionRate;

    // Pipeline Value
    const pipelineValue = getPipelineValue(leads);
    const wonRevenue = getWonRevenue(leads);
    const avgCycle = getAverageSalesCycle(leads);
    const lostRate = getLostRate(leads);

    return [
      {
        title: 'Total Leads',
        value: totalLeads,
        trend: totalGrowth,
        trendLabel: 'vs prev. period',
        icon: Users,
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-100 dark:bg-blue-900/40',
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        trend: convGrowth,
        trendLabel: 'vs prev. period',
        icon: Target,
        colorClass: 'text-green-600 dark:text-green-400',
        bgClass: 'bg-green-100 dark:bg-green-900/40',
      },
      {
        title: 'Pipeline Value',
        value: formatCurrency(pipelineValue),
        icon: TrendingUp,
        colorClass: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-100 dark:bg-purple-900/40',
      },
      {
        title: 'Won Revenue',
        value: formatCurrency(wonRevenue),
        icon: IndianRupee,
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-100 dark:bg-emerald-900/40',
      },
      {
        title: 'Avg Sales Cycle',
        value: `${avgCycle} Days`,
        icon: Clock,
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-100 dark:bg-amber-900/40',
      },
      {
        title: 'Lost Rate',
        value: `${lostRate}%`,
        icon: AlertCircle,
        colorClass: 'text-red-600 dark:text-red-400',
        bgClass: 'bg-red-100 dark:bg-red-900/40',
      }
    ];
  }, [leads, previousLeads]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex items-center">
          <div className={`p-4 rounded-xl mr-5 ${stat.bgClass} ${stat.colorClass}`}>
            <stat.icon size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {stat.value}
            </h3>
            {stat.trend !== undefined && (
              <p className={`text-xs mt-1 font-medium ${stat.trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.trend > 0 ? '+' : ''}{stat.trend}% <span className="text-slate-400 dark:text-slate-500 font-normal">{stat.trendLabel}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
