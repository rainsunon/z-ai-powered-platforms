import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { CustomerServiceDashboard } from './CustomerServiceDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { AdminDashboard } from './AdminDashboard';

export function EnterpriseOverview() {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'manager':
      return <ManagerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'support':
      return <CustomerServiceDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
}
