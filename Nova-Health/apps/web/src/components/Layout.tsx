import React, { Suspense } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

function RouteLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

const mobileNavItems = [
  { icon: 'home', label: 'Dash', path: '/' },
  { icon: 'auto_awesome', label: 'Plan', path: '/health-plan' },
  { icon: 'card_membership', label: 'Premium', path: '/subscription' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

export function Layout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-body text-on-surface selection:bg-primary/20 selection:text-on-primary-container">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8 pb-24 lg:pb-8 hide-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<RouteLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-20 flex justify-around items-center px-4 z-50">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 transition-colors',
                isActive ? 'text-primary' : 'opacity-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
