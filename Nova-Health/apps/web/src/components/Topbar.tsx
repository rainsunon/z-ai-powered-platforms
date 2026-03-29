import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from 'next-themes';
import { cn } from '../lib/utils';

const topNavLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Health Plan', path: '/health-plan' },
  { label: 'Settings', path: '/settings' },
];

export function Topbar() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-16 px-8 flex justify-between items-center sticky top-0 z-40 bg-surface transition-all duration-300 ease-in-out">
      {/* Brand */}
      <div className="text-xl font-extrabold text-primary font-headline">Luminous Sanctuary</div>

      {/* Nav Links + Actions */}
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex gap-6">
          {topNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                cn(
                  'transition-all',
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface opacity-70 hover:bg-surface-container/50'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-container/50 transition-all"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-primary">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-full hover:bg-surface-container/50 transition-all relative"
          >
            <span className="material-symbols-outlined text-primary">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <div
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer hover:border-primary transition-colors"
          >
            <img
              src={user?.avatar}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile: notification + avatar only */}
      <div className="flex md:hidden items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-surface-container/50 transition-all"
          aria-label="Toggle dark mode"
        >
          <span className="material-symbols-outlined text-primary">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-full hover:bg-surface-container/50 transition-all relative"
        >
          <span className="material-symbols-outlined text-primary">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <div
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer"
        >
          <img
            src={user?.avatar}
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
