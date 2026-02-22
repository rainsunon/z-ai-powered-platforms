import React, { useState, useRef } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { CloudUpload, FileText, Image as ImageIcon, Filter, List, Grid, Download, MoreVertical, CheckCircle, Calendar, ChevronDown, ArrowLeft } from 'lucide-react';

interface ExpenseItem {
  id: string;
  date: string;
  merchant: string;
  merchantInitials: string;
  merchantColor: string;
  category: string;
  amount: number;
  status: 'Reconciled' | 'Ready for Review' | 'Categorized' | 'Pending';
  extractedTime?: string;
  fileType?: string;
}

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: 'extracting' | 'scanning' | 'done';
  type: 'pdf' | 'image';
}

const initialExpenses: ExpenseItem[] = [
  { 
    id: '1', 
    date: 'Oct 24, 2023', 
    merchant: 'Office Depot', 
    merchantInitials: 'OD', 
    merchantColor: 'bg-orange-100 text-orange-600',
    category: 'Office Supplies', 
    amount: 124.50, 
    status: 'Reconciled',
    fileType: 'receipt' 
  },
  { 
    id: '2', 
    date: 'Oct 24, 2023', 
    merchant: 'Starbucks', 
    merchantInitials: 'SB', 
    merchantColor: 'bg-green-700 text-white',
    category: 'Meals', 
    amount: 14.25, 
    status: 'Ready for Review',
    extractedTime: '5m ago',
    fileType: 'image'
  },
  { 
    id: '3', 
    date: 'Oct 23, 2023', 
    merchant: 'Amazon Web Svcs', 
    merchantInitials: 'AZ', 
    merchantColor: 'bg-blue-100 text-blue-600',
    category: 'Software', 
    amount: 452.00, 
    status: 'Categorized',
    fileType: 'invoice'
  }
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [uploads, setUploads] = useState<UploadItem[]>([
    { id: 'u1', name: 'Uber_Trip_Receipt.pdf', progress: 60, status: 'extracting', type: 'pdf' },
    { id: 'u2', name: 'IMG_2042_Lunch.jpg', progress: 30, status: 'scanning', type: 'image' }
  ]);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Date Picker State
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newUpload: UploadItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        progress: 0,
        status: 'scanning',
        type: file.type.includes('pdf') ? 'pdf' : 'image'
      };

      setUploads(prev => [newUpload, ...prev]);

      // Simulate upload process
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploads(prev => prev.map(u => u.id === newUpload.id ? { ...u, progress } : u));
        
        if (progress >= 50) {
            setUploads(prev => prev.map(u => u.id === newUpload.id ? { ...u, status: 'extracting' } : u));
        }

        if (progress >= 100) {
          clearInterval(interval);
          setUploads(prev => prev.filter(u => u.id !== newUpload.id)); // Remove from uploads
          
          // Add to expenses list as "Ready for Review"
          const newExpense: ExpenseItem = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            merchant: 'New Receipt',
            merchantInitials: 'NR',
            merchantColor: 'bg-slate-200 text-slate-600',
            category: 'Uncategorized',
            amount: 0.00,
            status: 'Ready for Review',
            extractedTime: 'Just now'
          };
          setExpenses(prev => [newExpense, ...prev]);
        }
      }, 500);
    }
  };

  const handleClearFilters = () => {
    setDateRange('Last 30 Days');
    setCategoryFilter('All Categories');
    setStatusFilter('All Statuses');
  };

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const end = new Date(customEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      setDateRange(`${start} - ${end}`);
      setIsCalendarOpen(false);
      setShowCustomPicker(false);
    }
  };

  const handleExport = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Status'];
    const rows = filteredExpenses.map(e => [e.date, e.merchant, e.category, e.amount.toString(), e.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReview = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Simulate reviewing logic - immediately categorize for prototype feel
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Categorized', category: 'Meals' } : e));
  };

  const filteredExpenses = expenses.filter(expense => {
    let matchesCategory = categoryFilter === 'All Categories' || expense.category === categoryFilter;
    if (categoryFilter === 'Meals' && expense.category !== 'Meals') matchesCategory = false; // Simple mapping
    
    let matchesStatus = statusFilter === 'All Statuses' || 
                        (statusFilter === 'Processing' && expense.status === 'Ready for Review') ||
                        (statusFilter === 'Ready' && expense.status !== 'Ready for Review'); // Simplification for demo
    
    // Exact status match if needed
    if (statusFilter !== 'All Statuses' && statusFilter !== 'Processing' && statusFilter !== 'Ready') {
         matchesStatus = expense.status === statusFilter;
    }

    return matchesCategory && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full flex flex-col gap-8" onClick={() => setIsCalendarOpen(false)}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Expenses & Receipts</h2>
        <p className="text-slate-500 text-sm mt-1">Upload receipts, track extraction status, and manage expenses.</p>
      </div>

      {/* Top Section: Upload & Processing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dropzone */}
        <div 
            className="lg:col-span-2 relative group cursor-pointer" 
            onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
          />
          <div className="h-full min-h-[180px] border-2 border-dashed border-[#13b6ec]/30 bg-white hover:bg-[#13b6ec]/5 rounded-xl flex flex-col items-center justify-center text-center p-6 transition-all">
            <div className="size-14 rounded-full bg-blue-50 text-[#13b6ec] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <CloudUpload size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Upload Receipt</h3>
            <p className="text-slate-500 text-sm mt-1 mb-3">Drag & drop your images or PDFs here</p>
            <span className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-100 rounded-full">Supports JPG, PNG, PDF up to 10MB</span>
          </div>
        </div>

        {/* Processing Status */}
        <Card className="p-5 flex flex-col h-full min-h-[180px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {uploads.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13b6ec] opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${uploads.length > 0 ? 'bg-[#13b6ec]' : 'bg-slate-300'}`}></span>
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Auto-Capturing Data</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">{uploads.length} Processing</span>
          </div>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[200px]">
            {uploads.length > 0 ? uploads.map(upload => (
                <div key={upload.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="size-8 rounded bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                    {upload.type === 'pdf' ? <FileText size={18} /> : <ImageIcon size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">{upload.name}</p>
                    <span className="text-[10px] text-[#13b6ec] font-medium capitalize">{upload.status}...</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1">
                    <div className="bg-[#13b6ec] h-1 rounded-full transition-all duration-300" style={{ width: `${upload.progress}%` }}></div>
                    </div>
                </div>
                </div>
            )) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-4">
                    <CheckCircle size={24} className="mb-2 opacity-50" />
                    <p className="text-xs">All caught up!</p>
                </div>
            )}
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 px-3 py-1 flex-1 w-full lg:w-auto">
          <Filter size={20} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">Filters:</span>
        </div>
        <div className="w-full lg:w-px h-px lg:h-8 bg-slate-100"></div>
        <div className="flex flex-col gap-1 px-3 w-full lg:w-auto">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Time Period</label>
          <div className="relative">
             <button 
                onClick={(e) => {
                   e.stopPropagation();
                   setIsCalendarOpen(!isCalendarOpen);
                   setShowCustomPicker(false);
                }}
                className="flex items-center gap-2 text-sm font-semibold text-slate-900 focus:outline-none hover:text-[#13b6ec] transition-colors"
             >
                <Calendar size={16} className="text-slate-400" />
                <span>{dateRange}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
             </button>

             {isCalendarOpen && (
                <div 
                   className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
                   onClick={(e) => e.stopPropagation()}
                >
                   {!showCustomPicker ? (
                     <>
                        <div className="py-1">
                           {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'All Time'].map((option) => (
                              <button
                                 key={option}
                                 onClick={() => {
                                    setDateRange(option);
                                    setIsCalendarOpen(false);
                                 }}
                                 className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${dateRange === option ? 'text-[#13b6ec] font-semibold bg-blue-50' : 'text-slate-600'}`}
                              >
                                 {option}
                              </button>
                           ))}
                        </div>
                        <div className="border-t border-slate-100 bg-slate-50 p-2">
                           <button 
                              onClick={() => setShowCustomPicker(true)} 
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 font-medium hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                           >
                              <Calendar size={14} /> Custom Range...
                           </button>
                        </div>
                     </>
                   ) : (
                     <div className="p-4 w-72">
                        <div className="flex items-center gap-2 mb-3">
                           <button onClick={() => setShowCustomPicker(false)} className="hover:text-slate-700 text-slate-400 transition-colors"><ArrowLeft size={16} /></button>
                           <span className="text-xs font-bold uppercase text-slate-900">Select Range</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                           <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-500 font-semibold">From</label>
                              <input type="date" className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} />
                           </div>
                           <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-500 font-semibold">To</label>
                              <input type="date" className="w-full text-xs p-1.5 border border-slate-200 rounded bg-slate-50" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} />
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs" onClick={() => setShowCustomPicker(false)}>Cancel</Button>
                           <Button size="sm" className="flex-1 h-8 text-xs bg-[#13b6ec] hover:bg-[#0ea5d7]" onClick={handleApplyCustomRange}>Apply</Button>
                        </div>
                     </div>
                   )}
                </div>
             )}
          </div>
        </div>
        <div className="hidden lg:block w-px h-8 bg-slate-100"></div>
        <div className="flex flex-col gap-1 px-3 w-full lg:w-auto">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</label>
          <select 
            className="border-none p-0 py-0.5 bg-transparent text-sm font-semibold text-slate-900 focus:ring-0 cursor-pointer outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All Categories</option>
            <option>Travel</option>
            <option>Meals</option>
            <option>Office Supplies</option>
            <option>Software</option>
          </select>
        </div>
        <div className="hidden lg:block w-px h-8 bg-slate-100"></div>
        <div className="flex flex-col gap-1 px-3 w-full lg:w-auto">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Processing Status</label>
          <select 
            className="border-none p-0 py-0.5 bg-transparent text-sm font-semibold text-slate-900 focus:ring-0 cursor-pointer outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Ready</option>
            <option>Reconciled</option>
          </select>
        </div>
        <div className="ml-auto px-3 py-2 flex items-center gap-2">
          <button 
            className="text-sm font-medium text-slate-400 hover:text-[#13b6ec] transition-colors"
            onClick={handleClearFilters}
          >
            Clear
          </button>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button className="p-1.5 rounded bg-white shadow-sm text-slate-900"><List size={20} /></button>
            <button className="p-1.5 rounded text-slate-400 hover:bg-white/50"><Grid size={20} /></button>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <Card className="overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Recent Expenses</h3>
          <Button variant="ghost" size="sm" className="text-slate-500" onClick={handleExport}>
            <Download size={18} className="mr-2" /> Export
          </Button>
        </div>
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left text-sm text-slate-900">
            <thead className="bg-[#f8fafb] text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Merchant (Extracted)</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-center">Processing Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                  <tr key={expense.id} className={`group hover:bg-slate-50 transition-colors ${expense.status === 'Ready for Review' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4 text-slate-500">{expense.date}</td>
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full ${expense.merchantColor} flex items-center justify-center text-xs font-bold`}>
                            {expense.merchantInitials}
                        </div>
                        <div>
                        <span className="font-medium text-slate-900 block">{expense.merchant}</span>
                        {expense.status === 'Reconciled' && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle size={12} /> Verified
                            </span>
                        )}
                        {expense.extractedTime && (
                             <span className="text-xs text-slate-500">Extracted {expense.extractedTime}</span>
                        )}
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                        {expense.status === 'Ready for Review' ? (
                             <div onClick={(e) => handleReview(e, expense.id)}>
                                <Badge variant="warning" className="cursor-pointer border-dashed border-orange-300 hover:bg-orange-100">Confirm Category?</Badge>
                             </div>
                        ) : (
                             <Badge variant="neutral">{expense.category}</Badge>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                       {expense.status === 'Reconciled' && <Badge variant="success" className="gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"></span>Reconciled</Badge>}
                       {expense.status === 'Ready for Review' && <Badge variant="info" className="gap-1.5 animate-pulse"><span className="size-1.5 rounded-full bg-blue-500"></span>Ready for Review</Badge>}
                       {expense.status === 'Categorized' && <Badge variant="success" className="bg-purple-50 text-purple-700 border-purple-100 gap-1.5"><span className="size-1.5 rounded-full bg-purple-500"></span>Categorized</Badge>}
                       {expense.status === 'Pending' && <Badge variant="neutral" className="gap-1.5"><span className="size-1.5 rounded-full bg-slate-400"></span>Pending</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {expense.status === 'Ready for Review' ? (
                          <button 
                            className="text-[#13b6ec] hover:underline font-semibold text-sm mr-2"
                            onClick={(e) => handleReview(e, expense.id)}
                          >
                            Review
                          </button>
                      ) : (
                          <button className="text-slate-400 hover:text-slate-900"><MoreVertical size={20} /></button>
                      )}
                    </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500">
                          No expenses found matching filters.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-center">
          <button 
            className="text-sm font-semibold text-[#13b6ec] hover:underline"
            onClick={() => handleClearFilters()}
          >
            View All Expenses
          </button>
        </div>
      </Card>
    </div>
  );
}