import React, { Suspense, useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { Input } from '@/components/ui/input';

const enterpriseNavItems = [
  { icon: 'dashboard', label: 'Overview', path: '/enterprise' },
  { icon: 'group', label: 'User Management', path: '/enterprise/users' },
  { icon: 'medical_information', label: 'Health Records', path: '/enterprise/records' },
  { icon: 'confirmation_number', label: 'Support Tickets', path: '/enterprise/tickets' },
  { icon: 'security', label: 'Security Logs', path: '/enterprise/security' },
  { icon: 'trending_up', label: 'Financial Trends', path: '/enterprise/finance' },
];

export function EnterpriseLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'client') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-body text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-72 bg-surface-container p-6 space-y-2 shrink-0 overflow-y-auto hide-scrollbar">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-primary tracking-tighter font-headline">HealthPortal</h1>
          <p className="font-headline font-semibold text-xs text-on-surface-variant opacity-70 uppercase tracking-widest">Enterprise Suite</p>
        </div>

        <nav className="flex-1 space-y-1">
          {enterpriseNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/enterprise'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 font-headline font-semibold text-sm',
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm translate-x-1'
                    : 'text-on-surface-variant hover:bg-surface-dim rounded-full'
                )
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-outline-variant/20 space-y-2">
          <button
            onClick={() => navigate('/enterprise/tickets')}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm px-6 py-4 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-95 transition-transform duration-200"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>New Support Case</span>
          </button>
          <button
            onClick={() => navigate('/enterprise/settings')}
            className="w-full flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:bg-surface-dim rounded-full transition-all font-headline font-semibold text-sm"
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:bg-surface-dim rounded-full transition-all font-headline font-semibold text-sm"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 shadow-[0px_20px_40px_rgba(21,30,18,0.06)]">
          <div className="flex items-center gap-6 w-1/3">
            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-full pl-12 pr-4 py-2.5 h-auto text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40"
                placeholder="Search records or tickets..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-xs font-bold font-headline leading-none">{user?.name}</p>
                <p className="text-[10px] text-on-surface-variant leading-none mt-1">{user?.title}</p>
              </div>
              <img
                src={user?.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
