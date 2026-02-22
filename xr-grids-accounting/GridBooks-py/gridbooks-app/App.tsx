import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Invoices from './views/Invoices';
import Expenses from './views/Expenses';
import Accounting from './views/Accounting';
import TimeTracking from './views/TimeTracking';
import Reports from './views/Reports';
import Notifications from './views/Notifications';
import CreateActionModal from './components/CreateActionModal';
import { 
  Menu, Search, Bell, HelpCircle, ChevronDown, ChevronUp,
  User, RefreshCw, FileText, Copy, CircleDollarSign, Receipt, 
  Calculator, Lightbulb, CreditCard, FileClock, Store, X
} from 'lucide-react';
import { Button } from './components/ui';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Tom Cook', email: 'tom@gridbooks.com' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [activeCreateAction, setActiveCreateAction] = useState<string | null>(null);
  
  // State for report deep linking
  const [targetReportId, setTargetReportId] = useState<string | null>(null);

  const handleOpenReport = (id: string) => {
    setTargetReportId(id);
    setCurrentView('reports');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard searchQuery={searchQuery} onQuickAction={setActiveCreateAction} onNavigate={setCurrentView} />;
      case 'clients': return <Clients />;
      case 'invoices': return <Invoices />;
      case 'expenses': return <Expenses />;
      case 'accounting': return <Accounting onNavigate={setCurrentView} onOpenReport={handleOpenReport} />;
      case 'time': return <TimeTracking />;
      case 'reports': return <Reports initialReportId={targetReportId} clearInitialReport={() => setTargetReportId(null)} />;
      case 'notifications': return <Notifications />;
      default: return <Dashboard searchQuery={searchQuery} onQuickAction={setActiveCreateAction} onNavigate={setCurrentView} />;
    }
  };

  const createMenuItems = [
    { icon: User, label: 'Client' },
    { icon: RefreshCw, label: 'Retainer' },
    { icon: FileText, label: 'Invoice' },
    { icon: Copy, label: 'Recurring Template' },
    { icon: CircleDollarSign, label: 'Other Income' },
    { icon: Receipt, label: 'Expense' },
    { icon: Calculator, label: 'Estimate' },
    { icon: Lightbulb, label: 'Proposal' },
    { icon: CreditCard, label: 'Credit' },
    { icon: FileClock, label: 'Bill' },
    { icon: Store, label: 'Vendor' },
  ];

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#f6f8f8] overflow-hidden text-slate-900 font-sans">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md">
        Skip to main content
      </a>

      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        user={user} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 relative">
           <div className="flex items-center gap-4 md:hidden">
              <button className="text-slate-500" aria-label="Open menu">
                 <Menu />
              </button>
              <span className="font-bold text-lg text-slate-900">GridBooks</span>
           </div>

           <div className="hidden md:flex flex-1 max-w-md ml-4">
              <form 
                className="relative w-full text-slate-500 focus-within:text-blue-600"
                onSubmit={(e) => e.preventDefault()}
                role="search"
              >
                 <label htmlFor="search-input" className="sr-only">Search transactions, invoices, or help</label>
                 <input 
                    id="search-input"
                    className="w-full bg-slate-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-600/50 text-slate-900 placeholder-slate-400 transition-shadow outline-none" 
                    placeholder="Search transactions, invoices, or help..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors" aria-label="Submit search">
                    <Search size={20} />
                 </button>
              </form>
           </div>

           <div className="flex items-center gap-3 ml-auto">
              <button 
                className="flex items-center justify-center size-10 rounded-full hover:bg-slate-50 text-slate-500 transition-colors relative focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                onClick={() => setCurrentView('notifications')}
                aria-label="Notifications (4 unread)"
              >
                 <Bell size={20} />
                 <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button 
                className="flex items-center justify-center size-10 rounded-full hover:bg-slate-50 text-slate-500 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                onClick={() => setShowHelp(true)}
                aria-label="Help & Support"
              >
                 <HelpCircle size={20} />
              </button>
              <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
              
              <div className="relative">
                <Button 
                  className="hidden sm:flex gap-2 items-center" 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  aria-expanded={showCreateMenu}
                  aria-haspopup="true"
                >
                   {showCreateMenu ? 'Close' : 'Create New'} 
                   {showCreateMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>

                {showCreateMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCreateMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                       <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
                       
                       <div className="relative bg-white rounded-xl z-20 py-2 flex flex-col max-h-[80vh] overflow-y-auto" role="menu">
                          {createMenuItems.map((item, index) => (
                            <button 
                              key={index}
                              role="menuitem"
                              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors focus-visible:bg-slate-50 focus-visible:outline-none"
                              onClick={() => {
                                setShowCreateMenu(false);
                                setActiveCreateAction(item.label);
                              }}
                            >
                               <item.icon size={18} aria-hidden="true" />
                               <span className="text-sm font-medium">{item.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                  </>
                )}
              </div>
           </div>
        </header>

        {/* Main View Area */}
        <main id="main-content" className="flex-1 overflow-hidden relative flex flex-col focus:outline-none" tabIndex={-1}>
           {renderView()}
        </main>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" 
          onClick={() => setShowHelp(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
        >
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 id="help-title" className="font-bold text-slate-900">Help & Support</h3>
                 <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200" aria-label="Close help">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-6">
                 <div className="flex flex-col gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                       <h4 className="font-semibold text-blue-900 text-sm mb-1">Documentation</h4>
                       <p className="text-blue-700 text-xs">Browse our comprehensive guides to get the most out of GridBooks.</p>
                    </div>
                    <button className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none">
                       <h4 className="font-semibold text-slate-900 text-sm mb-1">Contact Support</h4>
                       <p className="text-slate-500 text-xs">Need personalized help? Our team is available 24/7.</p>
                    </button>
                    <button className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none">
                       <h4 className="font-semibold text-slate-900 text-sm mb-1">Keyboard Shortcuts</h4>
                       <p className="text-slate-500 text-xs">Press ⌘+K to open the command palette.</p>
                    </button>
                 </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                 <Button onClick={() => setShowHelp(false)}>Close</Button>
              </div>
           </div>
        </div>
      )}

      {/* Global Create Action Modal */}
      <CreateActionModal 
        type={activeCreateAction} 
        onClose={() => setActiveCreateAction(null)} 
      />
    </div>
  );
}