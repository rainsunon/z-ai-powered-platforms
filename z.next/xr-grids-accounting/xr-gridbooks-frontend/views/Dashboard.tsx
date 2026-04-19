import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '../components/ui';
import { 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  Calendar,
  Wallet,
  Receipt,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 6390, expenses: 3800 },
];

interface DashboardProps {
  searchQuery?: string;
  onQuickAction?: (action: string) => void;
  onNavigate?: (view: string) => void;
}

export default function Dashboard({ searchQuery = '', onQuickAction, onNavigate }: DashboardProps) {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const recentInvoices = [
    { id: 'AS', name: 'Acme Studio', inv: '#INV-2024', amount: '$1,200.00', status: 'Paid', color: 'bg-slate-100 text-slate-500', statusColor: 'success' },
    { id: 'GL', name: 'Global Logistics', inv: '#INV-2025', amount: '$850.00', status: 'Pending', color: 'bg-slate-100 text-slate-500', statusColor: 'warning' },
    { id: 'TC', name: 'Tech Corp', inv: '#INV-2023', amount: '$2,300.00', status: 'Overdue', color: 'bg-slate-100 text-slate-500', statusColor: 'danger' },
  ];

  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredInvoices = recentInvoices.filter(item => {
    if (!searchQuery) return true;
    const query = normalize(searchQuery);
    return (
      normalize(item.name).includes(query) ||
      normalize(item.inv).includes(query) ||
      normalize(item.amount).includes(query) ||
      normalize(item.status).includes(query)
    );
  });

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const end = new Date(customEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      setDateRange(`${start} - ${end}`);
      setIsCalendarOpen(false);
      setShowCustomPicker(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Overview</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setShowCustomPicker(false);
            }}
            aria-expanded={isCalendarOpen}
            aria-haspopup="dialog"
            className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
          >
            <Calendar size={16} />
            <span>{dateRange}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isCalendarOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsCalendarOpen(false)}></div>
              <div 
                role="dialog"
                aria-label="Date Range Picker"
                className={`absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ${showCustomPicker ? 'w-72' : 'w-48'}`}
              >
                
                {!showCustomPicker ? (
                  <>
                    <div className="py-1" role="menu">
                      {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'].map((option) => (
                        <button
                          key={option}
                          role="menuitem"
                          onClick={() => {
                            setDateRange(option);
                            setIsCalendarOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${dateRange === option ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-600'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 bg-slate-50 p-2">
                      <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setShowCustomPicker(true);
                         }}
                         className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 font-medium hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200"
                      >
                         <Calendar size={14} /> Custom Range...
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                         <button 
                           onClick={() => setShowCustomPicker(false)}
                           className="text-slate-400 hover:text-slate-600 transition-colors"
                           aria-label="Back to preset ranges"
                         >
                           <ArrowLeft size={16} />
                         </button>
                         <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Select Range</span>
                         <div className="w-4"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                              <label htmlFor="start-date" className="text-[10px] font-bold text-slate-500 uppercase">From</label>
                              <input 
                                  id="start-date"
                                  type="date" 
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-700"
                                  value={customStartDate}
                                  onChange={(e) => setCustomStartDate(e.target.value)}
                              />
                          </div>
                          <div className="flex flex-col gap-1.5">
                              <label htmlFor="end-date" className="text-[10px] font-bold text-slate-500 uppercase">To</label>
                              <input 
                                  id="end-date"
                                  type="date" 
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-700"
                                  value={customEndDate}
                                  onChange={(e) => setCustomEndDate(e.target.value)}
                              />
                          </div>
                      </div>

                      <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                          <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs" onClick={() => setShowCustomPicker(false)}>Cancel</Button>
                          <Button 
                            size="sm" 
                            className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700" 
                            onClick={handleApplyCustomRange}
                            disabled={!customStartDate || !customEndDate}
                          >
                            Apply Range
                          </Button>
                      </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
              <Wallet size={80} className="text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Profit</p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">$12,450.00</h3>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="success" className="gap-1">
                <TrendingUp size={14} />
                <span>15%</span>
              </Badge>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
              <FileText size={80} className="text-orange-500" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Outstanding Invoices</p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">$3,200.00</h3>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="warning">3 invoices</Badge>
              <span className="text-slate-500 text-xs">waiting for payment</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
           <CardContent className="p-6">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
              <Receipt size={80} className="text-slate-500" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">$4,100.00</h3>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="neutral" className="gap-1">
                <TrendingUp size={14} className="rotate-90" />
                <span>0.5%</span>
              </Badge>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
             <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Cash Flow</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-blue-600"></span>
                    <span className="text-slate-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-slate-300"></span>
                    <span className="text-slate-600">Expenses</span>
                  </div>
                </div>
             </div>
          </CardHeader>
          <CardContent className="flex-1 h-[300px] w-full pt-0">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} accessibilityLayer>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} name="Revenue" />
                  <Bar dataKey="expenses" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={32} name="Expenses" />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Invoices */}
        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Quick Actions</h3>
              <p className="text-blue-100 text-sm mb-4">Shortcuts to manage your books.</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => onQuickAction?.('Invoice')}
                  className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors text-left group border border-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <span>New Invoice</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => onQuickAction?.('Expense')}
                  className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors text-left group border border-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <span>Add Expense</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <Card className="flex-1 flex flex-col">
            <CardHeader className="py-5 border-b border-slate-100 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-bold">Recent Invoices</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => onNavigate?.('invoices')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              {filteredInvoices.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {filteredInvoices.map((item, i) => (
                    <li key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer focus-visible:bg-slate-50 focus-visible:outline-none" tabIndex={0}>
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full ${item.color} flex items-center justify-center font-bold text-xs`} aria-hidden="true">
                          {item.id}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.inv}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{item.amount}</p>
                        <Badge variant={item.statusColor as any} className="text-[10px] uppercase tracking-wider">{item.status}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No invoices found matching "{searchQuery}"
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}