import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { KpiCard } from './components/KpiCard';
import { GrowthTrendsChart } from './components/GrowthTrendsChart';
import { StrategicInsightsPanel } from './components/StrategicInsightsPanel';
import { RevenuePieChart } from './components/RevenuePieChart';
import { ServiceEfficiencyPanel } from './components/ServiceEfficiencyPanel';
import { DashboardHeader } from './components/DashboardHeader';
import { FloatingAIButton } from './components/FloatingAIButton';
import { growthData, efficiencyItems } from './components/dashboard-data';

export function ManagerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="p-12 space-y-12 max-w-[1600px]">
      {/* Header */}
      <DashboardHeader
        title="Executive Strategic Overview"
        description="NovaHealth business intelligence and real-time operational efficiency metrics for the current fiscal quarter."
        user={{
          title: user?.title,
          avatar: user?.avatar,
          location: 'Luminous Sanctuary HQ'
        }}
      />

      {/* High-Level KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KpiCard
          icon="family_restroom"
          iconBgClass="bg-secondary-container text-on-secondary-container"
          title="Total Active Families"
          value="14,282"
          trendLabel="+12.4%"
          trendBgClass="bg-secondary-fixed text-on-secondary-fixed"
        />
        <KpiCard
          icon="payments"
          iconBgClass="bg-tertiary-container text-on-tertiary-container"
          title="Monthly Recurring Revenue"
          value="$1.42M"
          trendLabel="+8.2%"
          trendBgClass="bg-primary-fixed text-on-primary-fixed"
          highlighted
        />
        <KpiCard
          icon="moving"
          iconBgClass="bg-surface-container-highest text-primary"
          title="Client Lifetime Value"
          value="$4,850"
          trendLabel="Stable"
          trendBgClass="bg-surface-dim text-on-surface-variant"
        />
      </section>

      {/* Main Strategic Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        <GrowthTrendsChart data={growthData} />
        <StrategicInsightsPanel />
        <RevenuePieChart />
        <ServiceEfficiencyPanel items={efficiencyItems} />
      </div>

      {/* Floating AI Button */}
      <FloatingAIButton />
    </div>
  );
}
