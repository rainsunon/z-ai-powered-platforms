import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Wallet, 
  AlertCircle, 
  File, 
  X,
  Clock,
  Trash2,
  CheckCircle,
  Send,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';

const initialInvoices = [
  { id: '#INV-2024-001', client: 'Acme Corp', clientInitials: 'AC', clientColor: 'bg-blue-100 text-blue-600', desc: 'Web Development', date: 'Oct 24, 2023', dueDate: 'Nov 24, 2023', amount: '$4,500.00', status: 'Paid', paused: false },
  { id: '#INV-2024-002', client: 'Globex Inc.', clientInitials: 'GL', clientColor: 'bg-purple-100 text-purple-600', desc: 'SEO Services', date: 'Oct 20, 2023', dueDate: 'Nov 05, 2023', amount: '$1,200.00', status: 'Sent', paused: false },
  { id: '#INV-2024-003', client: 'Stark Industries', clientInitials: 'ST', clientColor: 'bg-orange-100 text-orange-600', desc: 'Consulting', date: 'Sep 15, 2023', dueDate: 'Oct 15, 2023', amount: '$8,500.00', status: 'Overdue', paused: false },
  { id: '#INV-2024-004', client: 'Wayne Ent.', clientInitials: 'WA', clientColor: 'bg-gray-100 text-gray-600', desc: 'Security Audit', date: 'Nov 01, 2023', dueDate: 'Nov 15, 2023', amount: '$3,250.00', status: 'Draft', paused: false },
  { id: '#INV-2024-005', client: 'Cyberdyne', clientInitials: 'CY', clientColor: 'bg-emerald-100 text-emerald-600', desc: 'AI Infrastructure', date: 'Nov 02, 2023', dueDate: 'Nov 16, 2023', amount: '$12,000.00', status: 'Sent', paused: false },
  { id: '#INV-2024-006', client: 'Massive Dynamic', clientInitials: 'MD', clientColor: 'bg-slate-100 text-slate-600', desc: 'Research', date: 'Oct 01, 2023', dueDate: 'Oct 30, 2023', amount: '$5,000.00', status: 'Paid', paused: false },
];

export default function Invoices() {
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Date Picker State
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
        inv.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'All') return matchesSearch;
    if (filter === 'Outstanding') return matchesSearch && (inv.status === 'Sent' || inv.status === 'Overdue');
    return matchesSearch && inv.status === filter;
  });

  // Pagination Logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['Invoice #', 'Client', 'Date', 'Due Date', 'Amount', 'Status'];
    const rows = filteredInvoices.map(inv => [inv.id, inv.client, inv.date, inv.dueDate, inv.amount, inv.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAction = (action: string, id: string) => {
    setOpenMenuId(null);
    if (action === 'Delete') {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            setInvoices(prev => prev.filter(inv => inv.id !== id));
        }
    } else if (action === 'Process') {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
        alert(`Invoice ${id} marked as Paid.`);
    } else if (action === 'Pause') {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, paused: !inv.paused } : inv));
    }
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

  return (
    <div className="flex h-full w-full relative" onClick={() => setOpenMenuId(null)}>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-5 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Invoices</h2>
              <p className="text-slate-500 text-sm">Manage billing, payments, and client relationships.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleExportCSV}>
                <Download size={18} className="mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowNewInvoice(true)}>
                <Plus size={18} className="mr-2" />
                Create New Invoice
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
                className={`p-6 relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${filter === 'Outstanding' ? 'ring-2 ring-[#13b6ec]' : ''}`}
                onClick={(e) => { e.stopPropagation(); setFilter('Outstanding'); setCurrentPage(1); }}
            >
              <div className="absolute right-4 top-4 p-2 bg-blue-50 rounded-lg text-blue-600">
                <Wallet size={20} />
              </div>
              <p className="text-slate-500 text-sm font-medium">Total Outstanding</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$12,450.00</p>
              <div className="text-emerald-600 text-sm font-medium flex items-center gap-1 mt-1">
                <Wallet size={16} />
                +12% <span className="text-slate-500 font-normal">from last month</span>
              </div>
            </Card>
            <Card 
                className={`p-6 relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${filter === 'Overdue' ? 'ring-2 ring-red-500' : ''}`}
                onClick={(e) => { e.stopPropagation(); setFilter('Overdue'); setCurrentPage(1); }}
            >
              <div className="absolute right-4 top-4 p-2 bg-red-50 rounded-lg text-red-600">
                <AlertCircle size={20} />
              </div>
              <p className="text-slate-500 text-sm font-medium">Overdue Amount</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$2,100.00</p>
              <div className="text-red-600 text-sm font-medium flex items-center gap-1 mt-1">
                <AlertCircle size={16} />
                +5% <span className="text-slate-500 font-normal">increase</span>
              </div>
            </Card>
            <Card 
                className={`p-6 relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${filter === 'Draft' ? 'ring-2 ring-slate-400' : ''}`}
                onClick={(e) => { e.stopPropagation(); setFilter('Draft'); setCurrentPage(1); }}
            >
              <div className="absolute right-4 top-4 p-2 bg-gray-100 rounded-lg text-gray-600">
                <File size={20} />
              </div>
              <p className="text-slate-500 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">4</p>
              <p className="text-slate-500 text-sm font-medium mt-1">Last edited 2h ago</p>
            </Card>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#13b6ec] focus:outline-none transition-all" 
                    placeholder="Search by client or invoice #" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                {/* Date Range Picker */}
                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCalendarOpen(!isCalendarOpen);
                            setShowCustomPicker(false);
                        }}
                        className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                        <Calendar size={18} />
                        <span>{dateRange}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCalendarOpen && (
                        <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden min-w-[200px]" onClick={e => e.stopPropagation()}>
                           {!showCustomPicker ? (
                            <>
                                <div className="py-1">
                                {['Today', 'Last 7 Days', 'Last 30 Days', 'This Month'].map((option) => (
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
                                <button onClick={() => setShowCustomPicker(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 font-medium hover:bg-white rounded-lg border border-transparent hover:border-slate-200">
                                    <Calendar size={14} /> Custom...
                                </button>
                                </div>
                            </>
                           ) : (
                             <div className="p-4 w-72">
                                <div className="flex items-center gap-2 mb-3">
                                   <button onClick={() => setShowCustomPicker(false)}><ArrowLeft size={16} /></button>
                                   <span className="text-xs font-bold uppercase">Select Range</span>
                                </div>
                                <div className="flex gap-2 mb-3">
                                   <input type="date" className="w-full text-xs p-1 border rounded" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} />
                                   <input type="date" className="w-full text-xs p-1 border rounded" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} />
                                </div>
                                <Button size="sm" className="w-full" onClick={handleApplyCustomRange}>Apply</Button>
                             </div>
                           )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block"></div>
              {['All', 'Paid', 'Outstanding', 'Draft'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => { setFilter(f); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${
                        filter === f 
                        ? 'bg-[#13b6ec]/10 text-[#13b6ec] border-[#13b6ec]/20' 
                        : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    {f}
                  </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <Card className="overflow-visible flex-1 flex flex-col min-h-[400px]">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {paginatedInvoices.length > 0 ? paginatedInvoices.map((inv, i) => (
                    <tr key={inv.id} className={`group hover:bg-slate-50 transition-colors ${inv.status === 'Overdue' ? 'bg-red-50/30' : ''}`}>
                      <td className="px-6 py-4 font-medium text-[#13b6ec]">{inv.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${inv.clientColor}`}>
                            {inv.clientInitials}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{inv.client}</p>
                            <p className="text-xs text-slate-500">{inv.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-900">{inv.date}</td>
                      <td className={`px-6 py-4 font-medium ${inv.status === 'Overdue' ? 'text-red-600' : 'text-slate-900'}`}>{inv.dueDate}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">{inv.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={
                          inv.status === 'Paid' ? 'success' : 
                          inv.status === 'Sent' ? 'info' : 
                          inv.status === 'Overdue' ? 'danger' : 'neutral'
                        }>
                          {inv.status === 'Paid' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>}
                          {inv.status === 'Sent' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>}
                          {inv.status === 'Overdue' && <AlertCircle size={12} className="mr-1" />}
                          {inv.status === 'Draft' && <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>}
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <button 
                            className={`p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors ${openMenuId === inv.id ? 'bg-slate-200 text-slate-900' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === inv.id ? null : inv.id); }}
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {/* Action Dropdown */}
                        {openMenuId === inv.id && (
                             <div className="absolute right-8 top-8 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 text-left animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAction('Process', inv.id); }} 
                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                                    disabled={inv.status === 'Paid'}
                                >
                                    <Play size={16} className="text-[#13b6ec]" /> 
                                    {inv.status === 'Paid' ? 'Paid' : 'Process Payment'}
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAction('Pause', inv.id); }} 
                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors"
                                >
                                    <Pause size={16} className={inv.paused ? 'text-slate-400' : 'text-orange-500'} /> 
                                    {inv.paused ? 'Resume Reminders' : 'Pause Reminders'}
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAction('Delete', inv.id); }} 
                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={16} /> Delete Invoice
                                </button>
                            </div>
                        )}
                      </td>
                    </tr>
                  )) : (
                      <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-500">
                              No invoices found matching your filters.
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 mt-auto rounded-b-xl">
              <p className="text-xs text-slate-500">
                Showing <span className="font-medium">{filteredInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</span> of <span className="font-medium">{filteredInvoices.length}</span> invoices
              </p>
              <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft size={14} /> Previous
                </Button>
                <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="flex items-center gap-1"
                >
                    Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Slide-over for New Invoice */}
      {showNewInvoice && (
        <>
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-20" onClick={() => setShowNewInvoice(false)}></div>
          <div className="absolute top-0 right-0 bottom-0 w-[600px] bg-white shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Invoice</h3>
                <p className="text-xs text-slate-500">Create a new invoice for your client</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Client View</span>
                    <div className="w-9 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow-sm"></div>
                    </div>
                </div>
                <button onClick={() => setShowNewInvoice(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-900 mb-1.5">Bill To</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary" placeholder="Search for a client..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-900 mb-1.5">Invoice Date</label>
                        <input type="date" className="w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary" defaultValue="2023-11-01" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-900 mb-1.5">Due Date</label>
                        <input type="date" className="w-full px-3 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary" defaultValue="2023-11-15" />
                    </div>
                </div>

                <div className="h-px bg-slate-200 w-full"></div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-slate-900">Services & Items</h4>
                        <button className="text-[#13b6ec] text-xs font-bold hover:underline flex items-center gap-1">
                            <Clock size={14} /> Import Time (3.5h unbilled)
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 px-2">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-right">Hrs/Qty</div>
                        <div className="col-span-2 text-right">Rate</div>
                        <div className="col-span-2 text-right">Amount</div>
                    </div>

                    {[
                        { desc: 'Frontend Development - Homepage V2', qty: 12, rate: 150, amt: 1800 },
                        { desc: 'Server Setup', qty: 2, rate: 150, amt: 300 }
                    ].map((item, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-start group">
                            <div className="col-span-6">
                                <textarea className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm resize-none focus:ring-1 focus:ring-primary" rows={i===0?2:1} defaultValue={item.desc} />
                            </div>
                            <div className="col-span-2">
                                <input type="number" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-right focus:ring-1 focus:ring-primary" defaultValue={item.qty} />
                            </div>
                            <div className="col-span-2">
                                <input type="number" className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-right focus:ring-1 focus:ring-primary" defaultValue={item.rate} />
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <span className="text-sm font-medium text-slate-900 pt-2">${item.amt}</span>
                                <button className="opacity-0 group-hover:opacity-100 text-red-500 pt-2 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    <button className="flex items-center gap-2 text-[#13b6ec] text-sm font-bold mt-2 self-start hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Plus size={16} /> Add Line Item
                    </button>
                </div>

                <div className="h-px bg-slate-200 w-full"></div>

                <div className="flex flex-col gap-2 items-end mt-4">
                    <div className="flex justify-between w-1/2 text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium text-slate-900">$2,100.00</span>
                    </div>
                    <div className="flex justify-between w-1/2 text-sm">
                        <span className="text-slate-500">Tax (0%)</span>
                        <span className="font-medium text-slate-900">$0.00</span>
                    </div>
                    <div className="flex justify-between w-1/2 text-lg font-bold border-t border-slate-200 pt-2 mt-2">
                        <span className="text-slate-900">Total</span>
                        <span className="text-[#13b6ec]">$2,100.00</span>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3 bg-white">
                <Button variant="outline" className="flex-1 font-bold">Save Draft</Button>
                <Button className="flex-1 font-bold shadow-md">
                    <Send size={16} className="mr-2" /> Send Invoice
                </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}