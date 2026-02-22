import React from 'react';
import { LayoutGrid, FileText, Receipt, CreditCard, BarChart2, Users, Bell, Settings, Calculator } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: { name: string; email: string };
  onLogout: () => void;
}

export default function Sidebar({ currentView, onNavigate, user, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'invoices', label: 'Invoicing', icon: FileText },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'accounting', label: 'Accounting', icon: Calculator },
    { id: 'time', label: 'Time Tracking', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 4 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 hidden md:flex" aria-label="Main Navigation">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold" aria-hidden="true">
            GB
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 font-bold leading-tight">GridBooks</h1>
            <p className="text-slate-500 text-xs">Financial Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={currentView === item.id ? 'page' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              currentView === item.id 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} aria-hidden="true" />
            <span className={`text-sm font-medium ${currentView === item.id ? 'font-bold' : ''}`}>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full" aria-label={`${item.badge} new notifications`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" 
          onClick={onLogout}
          aria-label="Log out"
        >
          <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold" aria-hidden="true">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}