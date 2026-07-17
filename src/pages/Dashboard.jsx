import React from 'react';
import { Users, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';

const Dashboard = () => {
  const { leads } = useLeads();

  const statsData = [
    { id: 1, title: 'Total Leads', value: leads.length.toString(), icon: Users, change: 12.5, color: 'primary' },
    { id: 2, title: 'Active Pipeline', value: '$45,000', icon: TrendingUp, change: 8.2, color: 'warning' },
    { id: 3, title: 'Conversion Rate', value: '18.4%', icon: Activity, change: 2.1, color: 'success' },
    { id: 4, title: 'Lost Leads', value: leads.filter(l => l.status === 'Lost').length.toString(), icon: AlertCircle, change: -4.5, color: 'danger' },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-background transition-colors duration-200">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-text-secondary mt-1">Welcome back. Here's what's happening with your leads today.</p>
      </div>

      {/* Stats Cards Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statsData.map(stat => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>

      {/* 
        Main Content Area:
        - Mobile: 1 column (everything stacks)
        - Tablet (md): 1 column (charts full width)
        - Desktop (lg): 2 columns 
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Full width on mobile/tablet, 1/2 width on desktop */}
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          <PipelineOverview leads={leads} />
          <QuickActions />
        </div>

        {/* Full width on mobile/tablet, 1/2 width on desktop */}
        <div className="w-full">
          <RecentLeads leads={leads} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
