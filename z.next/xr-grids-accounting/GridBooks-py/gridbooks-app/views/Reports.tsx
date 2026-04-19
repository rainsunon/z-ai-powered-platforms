import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { 
  ChevronRight, Share, Printer, Download, Calendar, RefreshCcw, 
  BarChart2, DollarSign, CreditCard, TrendingUp, ChevronDown, 
  Star, Search, ArrowLeft, FileText, PieChart, Tag, Users, 
  Hourglass, BookOpen, Scale, Landmark, Percent, Banknote, 
  ClipboardList, Clock, Briefcase, UserCheck, FileSearch,
  Layout, AlertCircle
} from 'lucide-react';

// --- Types & Data ---

interface ReportDef {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

interface ReportCategory {
  title: string;
  reports: ReportDef[];
}

const reportCategories: ReportCategory[] = [
  {
    title: "Invoice and Expense Reports",
    reports: [
      { id: 'inv-details', title: "Invoice Details", description: "A detailed summary of all invoices you've sent over a period of time", icon: FileText },
      { id: 'exp-report', title: "Expense Report", description: "See how much money you're spending, and where you're spending it", icon: PieChart },
      { id: 'item-sales', title: "Item Sales", description: "See how much money you're making from each item you sell", icon: Tag },
      { id: 'rev-client', title: "Revenue by Client", description: "A breakdown of how much revenue each of your clients is bringing in.", icon: Users, badge: "UPDATED" },
    ]
  },
  {
    title: "Payments Reports",
    reports: [
      { id: 'acc-aging', title: "Accounts Aging", description: "Find out which clients are taking a long time to pay", icon: Hourglass },
      { id: 'pay-collected', title: "Payments Collected", description: "A summary of all the payments you have collected over a period of time", icon: DollarSign },
      { id: 'ap-aging', title: "Accounts Payable Aging", description: "Find out how much each vendor needs to be paid", icon: CreditCard },
      { id: 'credit-bal', title: "Credit Balance", description: "Summary of all your credit balance for your clients over a period of time", icon: DollarSign },
    ]
  },
  {
    title: "Accounting Reports",
    reports: [
      { id: 'coa', title: "Chart of Accounts", description: "A list of all accounts used to record assets, liabilities, equity, revenue, and expenses.", icon: BookOpen },
      { id: 'bal-sheet', title: "Balance Sheet", description: "A snapshot of your assets, liabilities, and equity at any given point in time.", icon: Layout, badge: "UPDATED" },
      { id: 'pl', title: "Profit and Loss", description: "A summary of your total income, expenses, and net profit.", icon: TrendingUp, badge: "UPDATED" },
      { id: 'gl', title: "General Ledger", description: "A complete record of transactions and balances for all your accounts.", icon: BookOpen, badge: "UPDATED" },
      { id: 'trial-bal', title: "Trial Balance", description: "A quick gut check to make sure your books are balanced", icon: Scale },
      { id: 'bank-rec', title: "Bank Reconciliation Summary", description: "Shows unreconciled bank transactions and GridBooks entries", icon: Landmark },
      { id: 'sales-tax', title: "Sales Tax Summary", description: "Helps determine how much you owe the government in Sales Taxes", icon: Percent },
      { id: 'cash-flow', title: "Cash Flow", description: "Overview of Cash coming in and going out of your business", icon: Banknote },
      { id: 'journal', title: "Journal Entry", description: "Helps you see all the Manual Journal Entries and Adjustments made to your books", icon: ClipboardList },
    ]
  },
  {
    title: "Time Tracking and Project Reports",
    reports: [
      { id: 'time-details', title: "Time Entry Details", description: "A detailed summary of how much time you and / or your team tracked over a period of time", icon: Clock },
      { id: 'retainer', title: "Retainer Summary", description: "A detailed work summary for your retainer clients", icon: Briefcase },
      { id: 'profitability', title: "Profitability Summary", description: "View a summary of a client's profitability across all their projects", icon: TrendingUp },
      { id: 'profitability-details', title: "Profitability Details", description: "Get a detailed breakdown of project profitability by service and expense categories", icon: TrendingUp },
      { id: 'utilization', title: "Team Utilization", description: "Overview of billable hours from team members against their expected capacity", icon: UserCheck },
    ]
  },
  {
    title: "Logs",
    reports: [
      { id: 'audit', title: "Audit Log", description: "View changes made to your books", icon: FileSearch },
    ]
  }
];

interface ReportsProps {
    initialReportId?: string | null;
    clearInitialReport?: () => void;
}

export default function Reports({ initialReportId, clearInitialReport }: ReportsProps) {
  const [view, setView] = useState<'catalog' | 'detail'>('catalog');
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['pl', 'bal-sheet', 'cash-flow']);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter State
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    period: 'This Fiscal Year',
    compare: 'Previous Year',
    department: 'All',
    method: 'Accrual'
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getReportById = (id: string) => {
    for (const cat of reportCategories) {
      const found = cat.reports.find(r => r.id === id);
      if (found) return found;
    }
    return null;
  };

  const handleReportClick = (id: string) => {
    setCurrentReportId(id);
    setView('detail');
    // Reset filters when opening a new report
    setFilters({
        period: 'This Fiscal Year',
        compare: 'Previous Year',
        department: 'All',
        method: 'Accrual'
    });
  };

  useEffect(() => {
    if (initialReportId) {
        handleReportClick(initialReportId);
        if (clearInitialReport) clearInitialReport();
    }
  }, [initialReportId, clearInitialReport]);

  // Click outside listener for dropdowns
  useEffect(() => {
      const handleClickOutside = () => setActiveFilterDropdown(null);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter reports for search
  const filteredCategories = reportCategories.map(cat => ({
    ...cat,
    reports: cat.reports.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.reports.length > 0);

  const currentReport = currentReportId ? getReportById(currentReportId) : null;

  // --- Actions ---

  const handlePrint = () => {
      window.print();
  };

  const handleShare = async () => {
    // Construct a safe URL for sharing, handling non-standard environments (like previews) where href might be 'about:srcdoc'
    const currentUrl = window.location.href;
    const shareUrl = currentUrl.startsWith('http') ? currentUrl : `https://gridbooks.demo/reports/${currentReportId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentReport?.title || 'GridBooks Report',
          text: currentReport?.description,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
        // Attempt fallback to clipboard if share fails (and it wasn't a user abort)
        if ((err as Error).name !== 'AbortError') {
             try {
                 await navigator.clipboard.writeText(shareUrl);
                 alert('Link copied to clipboard!');
             } catch (clipboardErr) {
                 // Ignore if both fail
             }
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Report link copied to clipboard!');
      } catch (err) {
        alert('Unable to copy link.');
      }
    }
  };

  const handleExport = () => {
     // Mock download functionality
     const csvContent = "data:text/csv;charset=utf-8,Account,Total,Prior Period,Change\nSales,120500,105000,14.7%\nExpenses,86200,82000,4.2%\nNet Income,56300,45000,24.8%";
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", `${currentReport?.id || 'report'}_export.csv`);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  // Helper Component for Filter Dropdowns
  const FilterDropdown = ({ 
      id, 
      label, 
      value, 
      options, 
      icon: Icon 
  }: { id: string, label: string, value: string, options: string[], icon?: React.ElementType }) => (
      <div className="relative">
          <Button 
              variant="outline" 
              className="justify-between min-w-[140px] gap-2 bg-white"
              onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilterDropdown(activeFilterDropdown === id ? null : id);
              }}
          >
              <span className="truncate max-w-[140px] flex items-center gap-1">
                 <span className="text-slate-500 font-normal hidden xl:inline">{label}:</span> {value} 
                 {Icon && <Icon size={14} className="text-slate-400 ml-1" />}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${activeFilterDropdown === id ? 'rotate-180' : ''}`} />
          </Button>
          {activeFilterDropdown === id && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                  {options.map(opt => (
                      <button 
                          key={opt} 
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${value === opt ? 'font-bold text-[#13b6ec] bg-blue-50' : 'text-slate-700'}`}
                          onClick={() => {
                              setFilters(prev => ({ ...prev, [id]: opt }));
                              setActiveFilterDropdown(null);
                          }}
                      >
                          {opt}
                      </button>
                  ))}
              </div>
          )}
      </div>
  );

  // --- Views ---

  if (view === 'detail' && currentReport) {
    const isPL = currentReport.id === 'pl';
    
    return (
      <div className="flex flex-1 w-full justify-center py-6 px-4 md:px-8 lg:px-12 animate-in slide-in-from-right duration-300">
        <div className="flex flex-col max-w-[1400px] w-full gap-6">
          {/* Detailed Report View */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm">
              <button onClick={() => setView('catalog')} className="text-slate-500 hover:text-[#13b6ec] font-medium flex items-center gap-1">
                <ArrowLeft size={16} /> Reports
              </button>
              <ChevronRight size={16} className="text-slate-400" />
              <span className="text-slate-900 font-medium">{currentReport.title}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">{currentReport.title}</h1>
                <p className="text-slate-500">{currentReport.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="hidden sm:flex" onClick={handleShare}>
                  <Share size={20} className="mr-2" /> Share
                </Button>
                <Button variant="secondary" className="hidden sm:flex" onClick={handlePrint}>
                  <Printer size={20} className="mr-2" /> Print
                </Button>
                <Button className="shadow-md" onClick={handleExport}>
                  <Download size={20} className="mr-2" /> Export
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 sticky top-0 z-20">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto" onClick={(e) => e.stopPropagation()}>
               <FilterDropdown 
                    id="period" 
                    label="Period" 
                    value={filters.period} 
                    options={['This Month', 'This Quarter', 'This Fiscal Year', 'Last Year', 'Custom...']}
                    icon={Calendar}
               />
               <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
               <FilterDropdown 
                    id="compare" 
                    label="Compare" 
                    value={filters.compare} 
                    options={['Previous Year', 'Previous Period', 'None']}
               />
               <FilterDropdown 
                    id="department" 
                    label="Dept" 
                    value={filters.department} 
                    options={['All', 'Sales', 'Marketing', 'Engineering']}
               />
               <FilterDropdown 
                    id="method" 
                    label="Method" 
                    value={filters.method} 
                    options={['Accrual', 'Cash']}
               />
            </div>
            <button 
                className="ml-auto flex items-center gap-2 text-[#13b6ec] font-semibold text-sm hover:underline"
                onClick={() => setFilters({ period: 'This Fiscal Year', compare: 'Previous Year', department: 'All', method: 'Accrual' })}
            >
              <RefreshCcw size={18} /> Reset Filters
            </button>
          </div>

          {/* Report Content */}
          <div className="flex flex-col gap-6 print:p-0">
              {isPL ? (
                  <>
                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign size={64} className="text-[#13b6ec]" />
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
                            <h3 className="text-3xl font-bold text-slate-900 tabular-nums">$142,500.00</h3>
                            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm font-medium">
                            <TrendingUp size={16} /> +12.5% <span className="text-slate-500 font-normal ml-1">vs last year</span>
                            </div>
                        </Card>
                        <Card className="p-5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CreditCard size={64} className="text-rose-500" />
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
                            <h3 className="text-3xl font-bold text-slate-900 tabular-nums">$86,200.00</h3>
                            <div className="flex items-center gap-1 mt-2 text-rose-600 text-sm font-medium">
                            <TrendingUp size={16} /> +4.2% <span className="text-slate-500 font-normal ml-1">vs last year</span>
                            </div>
                        </Card>
                        <div className="bg-[#13b6ec] p-5 rounded-xl border border-[#13b6ec] shadow-lg shadow-[#13b6ec]/20 relative overflow-hidden text-white group">
                            <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                            <DollarSign size={64} className="text-white" />
                            </div>
                            <p className="text-sm font-medium text-white/90 mb-1">Net Income</p>
                            <h3 className="text-3xl font-bold text-white tabular-nums">$56,300.00</h3>
                            <div className="flex items-center gap-1 mt-2 text-white/90 text-sm font-medium">
                            <TrendingUp size={16} /> +24.8% <span className="font-normal opacity-80 ml-1">vs last year</span>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-6 font-semibold uppercase tracking-wider w-1/2">Account</th>
                                    <th className="py-3 px-6 font-semibold uppercase tracking-wider text-right">Total</th>
                                    <th className="py-3 px-6 font-semibold uppercase tracking-wider text-right">Prior Period</th>
                                    <th className="py-3 px-6 font-semibold uppercase tracking-wider text-right">Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr className="bg-slate-50"><td className="py-3 px-6 font-bold text-slate-900" colSpan={4}>Income</td></tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-6 pl-10 text-slate-900">Sales of Product Income</td>
                                    <td className="py-3 px-6 text-right font-medium tabular-nums text-slate-900">$120,500.00</td>
                                    <td className="py-3 px-6 text-right text-slate-500 tabular-nums">$105,000.00</td>
                                    <td className="py-3 px-6 text-right text-emerald-600 font-medium tabular-nums">+14.7%</td>
                                </tr>
                                <tr className="bg-slate-50/50">
                                    <td className="py-3 px-6 font-bold text-slate-900">Total Income</td>
                                    <td className="py-3 px-6 text-right font-bold tabular-nums text-slate-900">$142,500.00</td>
                                    <td className="py-3 px-6 text-right font-medium text-slate-500 tabular-nums">$126,500.00</td>
                                    <td className="py-3 px-6 text-right text-emerald-600 font-bold tabular-nums">+12.6%</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                    </Card>
                  </>
              ) : (
                  <Card className="p-12 flex flex-col items-center justify-center text-center gap-4 bg-slate-50 border-dashed">
                      <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                         <currentReport.icon size={40} />
                      </div>
                      <div className="max-w-md">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Report Generation in Progress</h3>
                          <p className="text-slate-500">This report type is currently being implemented. We are crunching the numbers to bring you meaningful insights.</p>
                      </div>
                  </Card>
              )}
          </div>
        </div>
      </div>
    );
  }

  // --- Catalog View ---
  return (
    <div className="flex flex-col flex-1 w-full bg-[#f6f8f8] p-8 overflow-y-auto">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports</h1>
            <p className="text-slate-500 mt-2">Get insights into your business performance and financial health.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-[#13b6ec] focus:outline-none shadow-sm"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && !searchQuery && (
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Favorite Reports</h3>
                <Star size={16} className="text-amber-400 fill-amber-400" />
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favorites.map(favId => {
                   const report = getReportById(favId);
                   if (!report) return null;
                   const Icon = report.icon;
                   return (
                      <div 
                        key={favId}
                        onClick={() => handleReportClick(favId)}
                        className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#13b6ec]/50 transition-all cursor-pointer group relative"
                      >
                         <button 
                            className="absolute top-4 right-4 text-amber-400 hover:scale-110 transition-transform"
                            onClick={(e) => toggleFavorite(favId, e)}
                            title="Remove from favorites"
                         >
                            <Star size={18} fill="currentColor" />
                         </button>

                         <div className="size-12 rounded-lg bg-blue-50 text-[#13b6ec] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon size={24} />
                         </div>
                         <h4 className="font-bold text-slate-900 group-hover:text-[#13b6ec] transition-colors">{report.title}</h4>
                         <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.description}</p>
                      </div>
                   )
                })}
             </div>
          </div>
        )}

        {/* All Reports Categories */}
        <div className="flex flex-col gap-10">
          {filteredCategories.map((category, idx) => (
            <div key={idx} className="flex flex-col gap-4">
               <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">{category.title}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.reports.map(report => (
                    <div 
                      key={report.id} 
                      onClick={() => handleReportClick(report.id)}
                      className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#13b6ec]/30 transition-all cursor-pointer group flex items-start gap-4"
                    >
                      <div className="size-10 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#13b6ec] flex items-center justify-center shrink-0 transition-colors">
                        <report.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                           <div className="flex items-center gap-2">
                             <h4 className="font-bold text-slate-900 group-hover:text-[#13b6ec] transition-colors truncate">{report.title}</h4>
                             {report.badge && (
                               <Badge variant="neutral" className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] h-5 px-1.5">{report.badge}</Badge>
                             )}
                           </div>
                           <button 
                             className={`text-slate-300 hover:text-amber-400 transition-colors ${favorites.includes(report.id) ? 'text-amber-400' : ''}`}
                             onClick={(e) => toggleFavorite(report.id, e)}
                           >
                              <Star size={18} fill={favorites.includes(report.id) ? "currentColor" : "none"} />
                           </button>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{report.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
             <div className="text-center py-12 text-slate-500">
                No reports found matching "{searchQuery}"
             </div>
          )}
        </div>

      </div>
    </div>
  );
}