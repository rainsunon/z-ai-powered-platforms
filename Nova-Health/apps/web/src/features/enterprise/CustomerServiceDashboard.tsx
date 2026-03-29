import { useAuthStore } from '@/store/useAuthStore';
import { ServiceMetricsCards } from './components/ServiceMetricsCards';
import { SupportTicketsTable } from './components/SupportTicketsTable';
import { ActiveChatsPanel } from './components/ActiveChatsPanel';
import { ServiceDashboardHeader } from './components/ServiceDashboardHeader';
import { SectionHeader } from './components/SectionHeader';
import { DashboardFooter } from './components/DashboardFooter';

export function CustomerServiceDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="p-12 space-y-12 max-w-[1600px]">
      {/* Header */}
      <ServiceDashboardHeader userName={user?.name} />

      <ServiceMetricsCards />

      {/* Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Support Tickets */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader
            title="Recent Support Tickets"
            viewAllText="View All Tickets"
          />
          <SupportTicketsTable />
        </div>

        {/* Active Conversations */}
        <ActiveChatsPanel />
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
