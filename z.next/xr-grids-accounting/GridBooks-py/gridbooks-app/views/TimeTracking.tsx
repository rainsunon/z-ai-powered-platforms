import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Badge } from '../components/ui';
import { Play, Plus, Pause, Square, Clock, DollarSign, PieChart, List as ListIcon, Calendar, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, Edit, X, Save, AlertCircle } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  client: string;
  project: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: string; // Display string like "2:30"
  durationSeconds: number; // For calculation
  status: 'Billed' | 'Unbilled';
  invoiceId?: string;
}

// Helper to generate initial dates relative to today
const getRelativeDate = (daysOffset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  return d.toISOString().split('T')[0];
};

const initialEntries: TimeEntry[] = [
  {
    id: '1',
    date: getRelativeDate(0), // Today
    client: 'Acme Corp',
    project: 'Website Redesign',
    description: 'Homepage Conceptualization and initial wireframes for the hero section.',
    startTime: '09:00 AM',
    endTime: '11:30 AM',
    duration: '02:30:00',
    durationSeconds: 9000,
    status: 'Unbilled'
  },
  {
    id: '2',
    date: getRelativeDate(1), // Yesterday
    client: 'Globex Inc.',
    project: 'Q4 Financial Audit',
    description: 'Reviewing expense reports and categorizing transactions for November.',
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    duration: '04:00:00',
    durationSeconds: 14400,
    status: 'Unbilled'
  },
  {
    id: '3',
    date: getRelativeDate(3),
    client: 'Stark Ind',
    project: 'Security Consultation',
    description: 'Server migration planning meeting.',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    duration: '01:00:00',
    durationSeconds: 3600,
    status: 'Billed',
    invoiceId: '#1024'
  }
];

export default function TimeTracking() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  // Initialize current date to Start of this Week (Sunday or Monday) to show entries properly
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    // d.setDate(d.getDate() - d.getDay() + 1); // Optional: Snap to Monday
    return d;
  });
  
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Billed' | 'Unbilled'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Timer State
  const [activeSession, setActiveSession] = useState<{
    client: string;
    project: string;
    startTime: number;
    duration: number; // seconds
    isRunning: boolean;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ client: '', project: '', description: '', duration: '', date: new Date().toISOString().split('T')[0] });

  // Timer Effect
  useEffect(() => {
    if (activeSession?.isRunning) {
      timerRef.current = setInterval(() => {
        setActiveSession(prev => prev ? ({ ...prev, duration: prev.duration + 1 }) : null);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeSession?.isRunning]);

  const formatSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDurationSimple = (totalSeconds: number) => {
     const hours = Math.floor(totalSeconds / 3600);
     const minutes = Math.floor((totalSeconds % 3600) / 60);
     return `${hours}h ${minutes}m`;
  };

  const getWeekRange = (date: Date) => {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay()); // Sunday
      const end = new Date(start);
      end.setDate(start.getDate() + 6); // Saturday
      return { start, end };
  };

  const formatDateRange = (date: Date) => {
    const { start, end } = getWeekRange(date);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
  };

  const getDayLabel = (dateStr: string) => {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);

      if (isSameDay(date, today)) return 'Today';
      if (isSameDay(date, yesterday)) return 'Yesterday';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleStartTimer = () => {
    if (activeSession) return; // Already running
    setActiveSession({
      client: '',
      project: '',
      startTime: Date.now(),
      duration: 0,
      isRunning: true
    });
  };

  const handleStopTimer = () => {
    if (activeSession) {
      const clientName = activeSession.client.trim() || 'No Client';
      const projectName = activeSession.project.trim() || 'General';
      const now = new Date();
      const start = new Date(now.getTime() - activeSession.duration * 1000);

      const entry: TimeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: now.toISOString().split('T')[0],
        client: clientName,
        project: projectName,
        description: 'Recorded session',
        startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: formatDurationSimple(activeSession.duration),
        durationSeconds: activeSession.duration,
        status: 'Unbilled'
      };
      setEntries([entry, ...entries]);
      setActiveSession(null);
    }
  };

  const handlePauseTimer = () => {
    setActiveSession(prev => prev ? ({ ...prev, isRunning: !prev.isRunning }) : null);
  };

  const handleManualLog = () => {
      if (!newEntry.client || !newEntry.duration) return;
      
      const hours = parseFloat(newEntry.duration) || 0;
      const durationSecs = Math.round(hours * 3600);
      
      const entry: TimeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: newEntry.date || new Date().toISOString().split('T')[0],
        client: newEntry.client,
        project: newEntry.project || 'General',
        description: newEntry.description || 'Manual Entry',
        startTime: '12:00 PM',
        endTime: '01:00 PM', // Placeholder
        duration: `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`,
        durationSeconds: durationSecs,
        status: 'Unbilled'
      };
      
      setEntries([entry, ...entries]);
      setShowLogModal(false);
      setNewEntry({ client: '', project: '', description: '', duration: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleGenerateInvoice = () => {
    const unbilledCount = entries.filter(e => e.status === 'Unbilled').length;
    if (unbilledCount === 0) {
        // Just a visual feedback if nothing to bill
        return; 
    }
    // Update state directly without blocking confirm()
    setEntries(prev => prev.map(e => e.status === 'Unbilled' ? { ...e, status: 'Billed', invoiceId: '#DRAFT' } : e));
  };

  // Filter Logic
  const { start: weekStart, end: weekEnd } = getWeekRange(currentDate);
  // Adjust weekEnd to include the whole day
  weekEnd.setHours(23, 59, 59, 999);
  weekStart.setHours(0, 0, 0, 0);

  const filteredEntries = entries.filter(entry => {
    // Search
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
        !q || 
        entry.client.toLowerCase().includes(q) ||
        entry.project.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q);
    
    // Status Filter
    const matchesStatus = filterStatus === 'All' || entry.status === filterStatus;
    
    // Date Range (Show if within the selected week)
    // We treat entry.date as local date
    const entryDate = new Date(entry.date);
    // Fix timezone offset for string dates parsing to UTC
    const entryDateFixed = new Date(entryDate.valueOf() + entryDate.getTimezoneOffset() * 60000);
    
    const matchesDate = entryDateFixed >= weekStart && entryDateFixed <= weekEnd;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate stats based on *displayed* entries for context, or all entries for totals?
  // Usually dashboards show stats for the filtered view.
  const totalSeconds = filteredEntries.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

  const unbilledTotalSeconds = entries.filter(e => e.status === 'Unbilled').reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const hourlyRate = 120; // Example rate
  const unbilledAmount = (unbilledTotalSeconds / 3600) * hourlyRate;

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8 flex flex-col gap-8" onClick={() => setIsFilterOpen(false)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-black tracking-tight">Time Tracking</h1>
          <p className="text-slate-500 text-sm">Track billable hours and manage entries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowLogModal(true)}>
            <Plus size={20} className="mr-2" /> Log Time
          </Button>
          <Button 
            className={`shadow-md shadow-[#13b6ec]/20 ${activeSession ? 'opacity-50 cursor-not-allowed' : ''}`} 
            onClick={handleStartTimer} 
            disabled={!!activeSession}
          >
            <Play size={20} className="mr-2" /> Start Timer
          </Button>
        </div>
      </div>

      {/* Active Timer Card */}
      {activeSession && (
          <div className="bg-white rounded-xl shadow-lg border border-[#13b6ec]/20 p-4 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group animate-in slide-in-from-top-4 duration-300">
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#13b6ec] ${activeSession.isRunning ? 'animate-pulse' : ''}`}></div>
            <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
              <div className={`size-10 rounded-full bg-[#13b6ec]/10 flex items-center justify-center text-[#13b6ec] shrink-0 transition-all ${activeSession.isRunning ? '' : 'opacity-50'}`}>
                <Clock className={activeSession.isRunning ? "animate-spin-slow" : ""} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <input 
                    className="text-slate-900 font-bold truncate bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-400 text-lg"
                    value={activeSession.client}
                    onChange={(e) => setActiveSession({...activeSession, client: e.target.value})}
                    placeholder="Type Client Name..."
                    autoFocus
                />
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${activeSession.isRunning ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                  <input 
                    className="text-slate-500 text-sm truncate bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-400 w-full"
                    value={activeSession.project}
                    onChange={(e) => setActiveSession({...activeSession, project: e.target.value})}
                    placeholder="Type Project / Task..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider block mb-0.5">Duration</span>
                <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums tracking-tight">{formatSeconds(activeSession.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                    onClick={handlePauseTimer}
                    className="size-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#13b6ec] hover:border-[#13b6ec] transition-colors bg-white shadow-sm"
                    title={activeSession.isRunning ? "Pause" : "Resume"}
                >
                  {activeSession.isRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button 
                    onClick={handleStopTimer}
                    className="size-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg shadow-red-500/20"
                    title="Stop & Save"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Clock size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Hours (Week)</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{totalHours}h {totalMinutes}m</span>
            <Badge variant="success" className="gap-1"><CheckCircle size={10} /> Active</Badge>
          </div>
        </Card>
        <Card className="p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <DollarSign size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">Unbilled Amount</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">${unbilledAmount.toFixed(2)}</span>
            <button 
                className="text-[#13b6ec] hover:text-[#0ea5d7] text-sm font-semibold hover:underline flex items-center gap-1"
                onClick={handleGenerateInvoice}
            >
                Generate Invoice
            </button>
          </div>
        </Card>
        <Card className="p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <PieChart size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">Billable Ratio</span>
          </div>
          <div className="flex flex-col w-full gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">85%</span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#13b6ec] w-[85%] rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Entries Table */}
      <Card className="overflow-visible flex flex-col">
        <div className="border-b border-slate-200 px-4 pt-4 pb-0 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${viewMode === 'list' ? 'text-[#13b6ec] border-[#13b6ec]' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
              >
                <ListIcon size={20} /> List View
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${viewMode === 'calendar' ? 'text-[#13b6ec] border-[#13b6ec]' : 'text-slate-500 border-transparent hover:text-slate-900'}`}
              >
                <Calendar size={20} /> Calendar View
              </button>
            </div>
            <div className="flex items-center gap-3 pb-2 flex-wrap">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2 text-slate-400 pointer-events-none" size={18} />
                  <input 
                    className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-[#13b6ec] focus:outline-none w-48 transition-all focus:w-64" 
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               <div className="relative">
                    <Button variant="secondary" size="sm" className="h-9" onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}>
                        <Filter size={16} className="mr-2" /> {filterStatus}
                    </Button>
                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                            {['All', 'Billed', 'Unbilled'].map(status => (
                                <button
                                    key={status}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterStatus === status ? 'text-[#13b6ec] font-bold' : 'text-slate-700'}`}
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                        setFilterStatus(status as any); 
                                        setIsFilterOpen(false); 
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    )}
               </div>

               <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
               <div className="flex items-center gap-1">
                 <button onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate()-7); setCurrentDate(d); }} className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"><ChevronLeft size={20} /></button>
                 <span className="text-sm font-semibold text-slate-900 w-36 text-center tabular-nums">{formatDateRange(currentDate)}</span>
                 <button onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate()+7); setCurrentDate(d); }} className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"><ChevronRight size={20} /></button>
               </div>
            </div>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client & Project</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">Description</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Time</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Duration</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                    <tr key={entry.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium whitespace-nowrap">{getDayLabel(entry.date)}</td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{entry.client}</span>
                        <span className="text-xs text-slate-500">{entry.project}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 leading-snug">{entry.description}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 text-right tabular-nums whitespace-nowrap">{entry.startTime} - {entry.endTime}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right tabular-nums">{entry.duration}</td>
                    <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            entry.status === 'Unbilled' 
                            ? 'bg-[#13b6ec]/10 text-[#13b6ec] border-[#13b6ec]/20' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                        {entry.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                            {entry.status === 'Billed' ? (
                                <span className="text-xs text-green-600 flex items-center gap-1 font-semibold bg-green-50 px-2 py-1 rounded"><CheckCircle size={12} /> {entry.invoiceId}</span>
                            ) : (
                                <div className="invisible group-hover:visible flex items-center gap-1">
                                    <button className="p-1.5 text-slate-400 hover:text-[#13b6ec] hover:bg-blue-50 rounded" title="Edit"><Edit size={16} /></button>
                                    <button className="p-1.5 text-slate-400 hover:text-[#13b6ec] hover:bg-blue-50 rounded" title="Restart Timer"><Play size={16} /></button>
                                </div>
                            )}
                        </div>
                    </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500">
                           <div className="flex flex-col items-center gap-2">
                                <AlertCircle size={24} className="text-slate-300" />
                                <p>No time entries found for this week.</p>
                                {searchQuery && <p className="text-xs">Try clearing your search filters.</p>}
                           </div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-slate-400 flex-col gap-2 min-h-[400px]">
            <Calendar size={48} className="text-slate-200" />
            <p className="font-medium text-slate-600">Calendar View</p>
            <p className="text-sm">Drag and drop functionality coming soon.</p>
          </div>
        )}
      </Card>

      {/* Log Time Modal */}
      {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLogModal(false)}>
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">Log Time Manually</h3>
                    <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                        <Input 
                            type="date"
                            value={newEntry.date} 
                            onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Client</label>
                        <Input 
                            placeholder="Client Name" 
                            value={newEntry.client} 
                            onChange={(e) => setNewEntry({...newEntry, client: e.target.value})} 
                            autoFocus
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Project</label>
                        <Input 
                            placeholder="Project Name" 
                            value={newEntry.project} 
                            onChange={(e) => setNewEntry({...newEntry, project: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Duration (Hours)</label>
                        <Input 
                            type="number"
                            step="0.25"
                            placeholder="e.g. 2.5" 
                            value={newEntry.duration} 
                            onChange={(e) => setNewEntry({...newEntry, duration: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                        <Input 
                            placeholder="What did you work on?" 
                            value={newEntry.description} 
                            onChange={(e) => setNewEntry({...newEntry, description: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                    <Button variant="secondary" onClick={() => setShowLogModal(false)}>Cancel</Button>
                    <Button onClick={handleManualLog} disabled={!newEntry.client || !newEntry.duration}>
                        <Save size={16} className="mr-2" /> Save Entry
                    </Button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
}