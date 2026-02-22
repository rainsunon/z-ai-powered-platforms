import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button'; // Placeholder specific import if created later, for now sticking to raw JSX with tailwind or updating as we go.
// Actually let's just use raw Tailwind first then upgrade to Shadcn components as we clean up. 
// However, the prompt asked to Use Shadcn. I haven't generated Shadcn components yet (button.tsx etc).
// So I will use standard HTML elements styled with Tailwind for now, and apply Shadcn classes.
// Or effectively re-implement the Shadcn button styles here if I can't import them.
// But the best way is to Create the Shadcn Button component now.

interface LayoutProps {
    children: React.ReactNode;
    theme?: string;
    toggleTheme?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, theme, toggleTheme }) => {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { label: 'Search Law', icon: 'balance', path: '/search-law' },
        { label: 'Divorce Related', icon: 'auto_stories', path: '/divorce-law' },
        { label: 'My Cases', icon: 'folder_open', path: '/analysis' },
        { label: 'AI Assistant', icon: 'smart_toy', path: '/chat' },
        { label: 'Directory', icon: 'people', path: '/directory' },
        { label: 'Calendar', icon: 'event', path: '/scheduling' },
        { label: 'Billing', icon: 'payments', path: '/billing' },
        { label: 'My Profile', icon: 'account_circle', path: '/profile' },
    ];

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-primary dark:bg-slate-900 flex flex-col h-full shadow-2xl z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="material-icons text-primary">gavel</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase">LexGrid</span>
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold",
                                location.pathname === item.path
                                    ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-lg'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                            )}
                        >
                            <span className="material-icons text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-white/10">
                    <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all mb-2">
                        <img
                            alt="Profile"
                            className="w-10 h-10 rounded-full border border-white/20 object-cover"
                            src="https://picsum.photos/id/64/100/100"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">Marcus Sterling</p>
                            <p className="text-[10px] text-white/60 uppercase tracking-widest font-black">USA Jurisdiction</p>
                        </div>
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-red-300 transition-all text-sm font-bold"
                    >
                        <span className="material-icons text-lg">logout</span>
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
                    <div className="relative w-96">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                            placeholder="Search case files, statutes or messages..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            <span className="material-icons text-xl">
                                {theme === 'light' ? 'dark_mode' : 'light_mode'}
                            </span>
                        </button>

                        <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-icons text-slate-600 dark:text-slate-300">notifications</span>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary dark:text-primary-400 rounded-full text-[10px] font-black tracking-wider uppercase">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> AI ONLINE
                            </span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 custom-scrollbar transition-colors duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
