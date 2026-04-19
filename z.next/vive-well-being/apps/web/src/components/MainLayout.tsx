import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Wallet, 
  Activity, 
  Hospital, 
  User, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Wealth', icon: TrendingUp, path: '/wealth' },
  { label: 'Finance', icon: Wallet, path: '/finance' },
  { label: 'Health', icon: Activity, path: '/health' },
  { label: 'Hospital Connect', icon: Hospital, path: '/hospital-connect' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-black/5 p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-on-surface">VIVE <span className="font-semibold text-lg">well-being</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-black/5">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="text-primary w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Alexandra S.</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-6 bg-white border-b border-black/5 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-on-surface">VIVE <span className="font-semibold text-base">well-being</span></span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-surface-container-low rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed inset-0 z-40 bg-white pt-24 p-6"
        >
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
