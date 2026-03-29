import React from 'react';
import { AdminStatusCards } from './components/AdminStatusCards';
import { SecurityLogsPanel } from './components/SecurityLogsPanel';
import { SystemAlertsPanel } from './components/SystemAlertsPanel';
import { ApiHealthCard } from './components/ApiHealthCard';
import { AccessRequestsTable } from './components/AccessRequestsTable';
import { AdminDashboardHeader } from './components/AdminDashboardHeader';
import { AdminDashboardFooter } from './components/AdminDashboardFooter';

export function AdminDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full bg-surface-container-low min-h-full">
      {/* Page Header */}
      <AdminDashboardHeader />

      <AdminStatusCards />

      {/* Lower Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <SecurityLogsPanel />

        <div className="lg:col-span-5 space-y-6">
          <SystemAlertsPanel />
          <ApiHealthCard />
        </div>

        <AccessRequestsTable />
      </div>

      {/* Footer */}
      <AdminDashboardFooter />
    </div>
  );
}
