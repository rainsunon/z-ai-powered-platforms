import { Outlet, NavLink } from 'react-router-dom';
import { Toast } from '../components/Toast';

type NavItem = {
  label: string;
  to: string;
  icon: string; // emoji / text icon
};

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: '📊' },
  { label: 'New Charge', to: '/charges', icon: '💳' },
  { label: 'Lookup Payment', to: '/payments', icon: '🔍' },
  { label: 'Idempotency Playground', to: '/idempotency', icon: '🔑' },
];

/**
 * App shell layout:
 * - Fixed top header with glassmorphism
 * - Left sidebar navigation
 * - Central content area (Outlet)
 * - Footer
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* ─── Sidebar ─── */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-border flex flex-col z-40">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-lg">
              S
            </div>
            <div>
              <span className="text-sm font-bold text-text tracking-tight">
                Idempotent
              </span>
              <span className="block text-[10px] font-medium text-text-dim tracking-wider uppercase">
                Payments
              </span>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-primary/15 text-primary-light shadow-sm shadow-primary/10'
                      : 'text-text-muted hover:bg-surface-light/40 hover:text-text'
                    }`
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border">
          <p className="text-[11px] text-text-dim leading-relaxed">
            Tip: use the same <strong className="text-text-muted">X-Idempotency-Key</strong> to safely retry a charge.
          </p>
        </div>
      </aside>

      {/* ─── Main area ─── */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 h-16 border-b border-border bg-bg/80 backdrop-blur-xl z-30 flex items-center justify-between px-8">
          <h1 className="text-base font-bold text-text tracking-tight">
            Strong Idempotent Payments
          </h1>
          <span className="text-xs text-text-dim font-medium px-3 py-1 rounded-full border border-border bg-surface-light/30">
            React 19 + Spring Boot
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-8 py-3">
          <p className="text-xs text-text-dim">
            © {new Date().getFullYear()} Strong Idempotent Payments UI
          </p>
        </footer>
      </div>

      {/* Global toast */}
      <Toast />
    </div>
  );
}
