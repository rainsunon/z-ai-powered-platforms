import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { preloadProps } from '../lib/preload';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/' },
  { icon: 'medical_services', label: 'Symptoms', path: '/symptoms' },
  { icon: 'calendar_month', label: 'Appointments', path: '/appointments' },
  { icon: 'auto_awesome', label: 'Health Plan', path: '/health-plan' },
  { icon: 'card_membership', label: 'Subscription', path: '/subscription' },
  { icon: 'monitor_heart', label: 'Vital Stats', path: '/vitals' },
  { icon: 'pill', label: 'Medications', path: '/medications' },
  { icon: 'description', label: 'Documents', path: '/documents' },
  { icon: 'payments', label: 'Billing', path: '/billing' },
  { icon: 'monitoring', label: 'Reports', path: '/reports' },
  { icon: 'chat', label: 'Messages', path: '/chat', badge: 2 },
  { icon: 'sync', label: 'Data Sync', path: '/sync' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-surface-container h-screen flex flex-col shadow-[0px_20px_40px_rgba(21,30,18,0.06)] hidden lg:flex shrink-0">
      {/* User Info */}
      <div className="flex items-center gap-4 p-6 pt-8 mb-4 px-8">
        <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-lg">
          {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
        </div>
        <div>
          <p className="font-headline font-bold text-on-surface tracking-tight">{user?.name}</p>
          <p className="text-xs opacity-70">Premium Member</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            {...preloadProps(item.path)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 font-body font-medium",
                isActive 
                  ? "bg-secondary-container text-on-surface font-bold shadow-sm" 
                  : "text-on-surface hover:bg-surface-dim hover:scale-[1.02]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn(
                  "material-symbols-outlined text-[22px] transition-colors",
                  isActive ? "text-on-secondary-container" : ""
                )}>
                  {item.icon}
                </span>
                <span className="font-headline flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 pt-4 border-t border-outline-variant/15 space-y-1">
        <button
          onClick={() => navigate('/support')}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-dim rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-headline">Support</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/30 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-headline">Logout</span>
        </button>
      </div>
    </aside>
  );
}
