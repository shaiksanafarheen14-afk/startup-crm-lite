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
        colorClass: 'text-accent ',
        bgClass: 'bg-accent/20 ',
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        trend: convGrowth,
        trendLabel: 'vs prev. period',
        icon: Target,
        colorClass: 'text-success ',
        bgClass: 'bg-success/10 ',
      },
      {
        title: 'Pipeline Value',
        value: formatCurrency(pipelineValue),
        icon: TrendingUp,
        colorClass: 'text-purple-600 ',
        bgClass: 'bg-purple-100 ',
      },
      {
        title: 'Won Revenue',
        value: formatCurrency(wonRevenue),
        icon: IndianRupee,
        colorClass: 'text-success ',
        bgClass: 'bg-success/10 ',
      },
      {
        title: 'Avg Sales Cycle',
        value: `${avgCycle} Days`,
        icon: Clock,
        colorClass: 'text-amber-600 ',
        bgClass: 'bg-amber-100 ',
      },
      {
        title: 'Lost Rate',
        value: `${lostRate}%`,
        icon: AlertCircle,
        colorClass: 'text-error dark:text-error',
        bgClass: 'bg-red-100 ',
      }
    ];
  }, [leads, previousLeads]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all flex items-center">
          <div className={`p-4 rounded-xl mr-5 ${stat.bgClass} ${stat.colorClass}`}>
            <stat.icon size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-text flex items-center gap-2">
              {stat.value}
            </h3>
            {stat.trend !== undefined && (
              <p className={`text-xs mt-1 font-medium ${stat.trend >= 0 ? 'text-success ' : 'text-error dark:text-error'}`}>
                {stat.trend > 0 ? '+' : ''}{stat.trend}% <span className="text-slate-400 dark:text-text-secondary font-normal">{stat.trendLabel}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
