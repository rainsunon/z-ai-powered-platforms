import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Plus, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Store,
  Tag,
  FileText,
  Clock,
  MapPin,
  X,
  Sparkles,
  RefreshCw,
  BrainCircuit,
  Lightbulb,
  Search,
  Calendar,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  PieChart as PieChartIcon,
  BarChart3,
  ShoppingBag,
  Utensils,
  Car,
  Plane,
  Gamepad2,
  HeartPulse,
  Activity,
  Globe
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { analytics } from '@/lib/analytics';
import { getFinancialAdvice } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { canAccessFeature } from '@/lib/rbac';
import { Lock } from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { 
    id: '1',
    name: 'Whole Foods Market', 
    date: 'Today, 10:30 AM', 
    timestamp: new Date().getTime(),
    amount: -142.50, 
    category: 'Essentials',
    merchant: {
      address: '250 E Houston St, New York, NY 10002',
      phone: '(212) 475-2600',
      website: 'www.wholefoodsmarket.com',
      coordinates: { lat: 40.7235, lng: -73.9888 }
    },
    breakdown: [
      { label: 'Organic Produce', amount: 65.20 },
      { label: 'Dairy & Eggs', amount: 28.30 },
      { label: 'Pantry Staples', amount: 49.00 }
    ],
    notes: 'Weekly grocery run. Focus on organic items for the new meal plan.',
    initialTags: ['Groceries', 'Organic']
  },
  { 
    id: '2',
    name: 'Equinox Luxury Club', 
    date: 'Yesterday', 
    timestamp: new Date().getTime() - 86400000,
    amount: -250.00, 
    category: 'Health',
    merchant: {
      address: '10 Hudson Yards, New York, NY 10001',
      phone: '(212) 835-5440',
      website: 'www.equinox.com',
      coordinates: { lat: 40.7538, lng: -74.0017 }
    },
    breakdown: [
      { label: 'Monthly Membership', amount: 250.00 }
    ],
    notes: 'Monthly fitness and wellness subscription.',
    initialTags: ['Fitness', 'Subscription']
  },
  { 
    id: '3',
    name: 'Stellar Dynamics', 
    date: 'Oct 15', 
    timestamp: new Date('2025-10-15').getTime(),
    amount: 9200.00, 
    category: 'Income',
    merchant: {
      address: 'One World Trade Center, New York, NY 10007',
      phone: '(212) 555-0199',
      website: 'www.stellardynamics.io',
      coordinates: { lat: 40.7127, lng: -74.0134 }
    },
    breakdown: [
      { label: 'Consulting Fee', amount: 8000.00 },
      { label: 'Performance Bonus', amount: 1200.00 }
    ],
    notes: 'Quarterly project completion and performance incentive.',
    initialTags: ['Work', 'Bonus']
  },
  { 
    id: '4',
    name: 'Apple Store', 
    date: 'Oct 12', 
    timestamp: new Date('2025-10-12').getTime(),
    amount: -1299.00, 
    category: 'Leisure',
    merchant: {
      address: '767 5th Ave, New York, NY 10153',
      phone: '(212) 336-1440',
      website: 'www.apple.com',
      coordinates: { lat: 40.7638, lng: -73.9730 }
    },
    breakdown: [
      { label: 'MacBook Air M3', amount: 1199.00 },
      { label: 'AppleCare+', amount: 100.00 }
    ],
    notes: 'Hardware upgrade for the home studio setup.',
    initialTags: ['Tech', 'Gadgets']
  },
];

interface Transaction {
  id: string;
  name: string;
  date: string;
  timestamp: number;
  amount: number;
  category: string;
  merchant: {
    address: string;
    phone: string;
    website: string;
    coordinates: { lat: number; lng: number };
  };
  breakdown: { label: string; amount: number }[];
  notes: string;
  initialTags?: string[];
}

function AddTransactionModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (tx: any) => void 
}) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Essentials');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const newTx = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      date: 'Just now',
      timestamp: new Date().getTime(),
      amount: -Math.abs(parseFloat(amount)),
      category,
      merchant: {
        address: 'New York, NY',
        phone: '(555) 000-0000',
        website: 'www.merchant.com',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      breakdown: [
        { label: name, amount: parseFloat(amount) }
      ],
      notes: notes || 'Manually added transaction.',
      initialTags: []
    };

    onAdd(newTx);
    setName('');
    setAmount('');
    setNotes('');
    onClose();
    toast.success('Transaction added successfully');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-on-surface">Add Transaction</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Merchant Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Starbucks"
                  className="w-full px-5 py-4 bg-surface-container-low border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-5 py-4 bg-surface-container-low border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-4 bg-surface-container-low border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                >
                  <option value="Essentials">Essentials</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Health">Health</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-5 py-4 bg-surface-container-low border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[100px] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] mt-4"
              >
                Save Transaction
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const INITIAL_ASSETS = [
  { id: '1', name: 'Vanguard S&P 500 ETF', type: 'ETF', value: 45000, change: 12.5, allocation: 35, color: '#10b981' },
  { id: '2', name: 'Apple Inc.', type: 'Stock', value: 15000, change: -2.4, allocation: 12, color: '#3b82f6' },
  { id: '3', name: 'Tesla Inc.', type: 'Stock', value: 8000, change: 5.2, allocation: 6, color: '#6366f1' },
  { id: '4', name: 'US Treasury Bonds', type: 'Bond', value: 25000, change: 1.1, allocation: 20, color: '#f59e0b' },
  { id: '5', name: 'Fidelity Magellan Fund', type: 'Fund', value: 12000, change: 4.8, allocation: 10, color: '#8b5cf6' },
  { id: '6', name: 'Manhattan Condo', type: 'Real Property', value: 850000, change: 3.2, allocation: 0, color: '#ec4899' },
];

const ASSET_PERFORMANCE_DATA = {
  day: [
    { label: '09:00', value: 157200 },
    { label: '11:00', value: 157800 },
    { label: '13:00', value: 158100 },
    { label: '15:00', value: 158420 },
  ],
  week: [
    { label: 'Mon', value: 155000 },
    { label: 'Tue', value: 156200 },
    { label: 'Wed', value: 155800 },
    { label: 'Thu', value: 157500 },
    { label: 'Fri', value: 158420 },
  ],
  month: [
    { label: 'Jan', value: 142000 },
    { label: 'Feb', value: 145000 },
    { label: 'Mar', value: 143500 },
    { label: 'Apr', value: 148000 },
    { label: 'May', value: 152000 },
    { label: 'Jun', value: 158420 },
  ],
  year: [
    { label: '2021', value: 98000 },
    { label: '2022', value: 115000 },
    { label: '2023', value: 132000 },
    { label: '2024', value: 148000 },
    { label: '2025', value: 158420 },
  ]
};

const EXCHANGE_PERFORMANCE = [
  { name: 'NYSE', gain: 8420.50, rate: 12.4, volume: 'High', color: '#10b981' },
  { name: 'NASDAQ', gain: 12540.20, rate: 18.2, volume: 'Very High', color: '#3b82f6' },
  { name: 'LSE', gain: -1240.30, rate: -2.1, volume: 'Medium', color: '#f59e0b' },
  { name: 'HKEX', gain: 3420.15, rate: 5.8, volume: 'Medium', color: '#8b5cf6' },
];

function WealthDashboard({ assets }: { assets: any[] }) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  const totalInvestments = assets.filter(a => a.type !== 'Real Property').reduce((acc, curr) => acc + curr.value, 0);
  const totalWealth = assets.reduce((acc, curr) => acc + curr.value, 0);
  const totalGain = 24560.85; // Mocked total gain
  const totalRate = (totalGain / (totalWealth - totalGain)) * 100;

  const allocationData = [
    { name: 'Stocks', value: assets.filter(a => a.type === 'Stock').reduce((acc, curr) => acc + curr.value, 0) },
    { name: 'ETFs', value: assets.filter(a => a.type === 'ETF').reduce((acc, curr) => acc + curr.value, 0) },
    { name: 'Funds', value: assets.filter(a => a.type === 'Fund').reduce((acc, curr) => acc + curr.value, 0) },
    { name: 'Bonds', value: assets.filter(a => a.type === 'Bond').reduce((acc, curr) => acc + curr.value, 0) },
    { name: 'Real Estate', value: assets.filter(a => a.type === 'Real Property').reduce((acc, curr) => acc + curr.value, 0) },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-10">
      {/* High Level Performance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Total Gain/Loss</p>
          <div className="flex items-end justify-between">
            <h4 className={`text-2xl font-black ${totalGain >= 0 ? 'text-emerald-600' : 'text-error'}`}>
              {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
            </h4>
            <div className={`flex items-center gap-1 text-xs font-bold ${totalGain >= 0 ? 'text-emerald-600' : 'text-error'}`}>
              <TrendingUp className="w-3 h-3" />
              {totalRate.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Daily Change</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-emerald-600">+$1,240.50</h4>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              0.8%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Annualized ROI</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-on-surface">14.8%</h4>
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <Activity className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Portfolio Beta</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-on-surface">0.92</h4>
            <div className="p-1.5 bg-surface-container-high text-on-surface-variant rounded-lg">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Portfolio Allocation Chart */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-on-surface">Asset Allocation</h3>
            <div className="p-2 bg-surface-container-low rounded-lg">
              <PieChartIcon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-6">
            {allocationData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{item.name}</span>
                <span className="text-xs font-black text-on-surface ml-auto">{((item.value / totalWealth) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wealth Performance Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold text-on-surface">Performance History</h3>
            <div className="flex p-1 bg-surface-container-high rounded-xl">
              {(['day', 'week', 'month', 'year'] as const).map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ASSET_PERFORMANCE_DATA[timeRange]}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Current Value</p>
              <p className="text-xl font-black text-on-surface">{formatCurrency(totalWealth)}</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-black/5" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Total Gain</p>
              <p className="text-xl font-black text-emerald-600">+{formatCurrency(totalGain)}</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-black/5" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Growth Rate</p>
              <p className="text-xl font-black text-primary">+{totalRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Center Performance */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">Exchange Center Reports</h3>
            <p className="text-xs text-on-surface-variant font-medium">Performance breakdown by global trading venues.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXCHANGE_PERFORMANCE.map((exchange) => (
            <div key={exchange.name} className="p-6 rounded-3xl bg-surface-container-low border border-black/5 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{exchange.name}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${exchange.gain >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-error/10 text-error'}`}>
                  {exchange.gain >= 0 ? '+' : ''}{exchange.rate}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Net Gain/Loss</p>
                <p className={`text-lg font-black ${exchange.gain >= 0 ? 'text-on-surface' : 'text-error'}`}>
                  {exchange.gain >= 0 ? '+' : ''}{formatCurrency(exchange.gain)}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Volume</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{exchange.volume}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Category Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Stock', 'ETF', 'Fund', 'Bond', 'Real Property'].map((type) => {
          const typeAssets = assets.filter(a => a.type === type);
          const typeTotal = typeAssets.reduce((acc, curr) => acc + curr.value, 0);
          if (typeTotal === 0) return null;

          return (
            <div key={type} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                    {type === 'Stock' && <TrendingUp className="w-5 h-5" />}
                    {type === 'ETF' && <ArrowUpRight className="w-5 h-5" />}
                    {type === 'Fund' && <Sparkles className="w-5 h-5" />}
                    {type === 'Bond' && <CheckCircle2 className="w-5 h-5" />}
                    {type === 'Real Property' && <Store className="w-5 h-5" />}
                  </div>
                  <h4 className="text-lg font-black text-on-surface tracking-tight">{type}s</h4>
                </div>
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">{typeAssets.length} Assets</span>
              </div>
              
              <div className="space-y-4 mb-6">
                {typeAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface leading-tight">{asset.name}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${asset.change >= 0 ? 'text-emerald-600' : 'text-error'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </span>
                    </div>
                    <span className="text-sm font-black text-on-surface">{formatCurrency(asset.value)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Total Value</span>
                <span className="text-lg font-black text-primary tracking-tighter">{formatCurrency(typeTotal)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionModal({ 
  tx, 
  isOpen, 
  onClose, 
  tags, 
  onAddTag, 
  onRemoveTag,
  note,
  onUpdateNote,
  setTagFilter,
  setIsFilterOpen,
  initialTab = 'overview'
}: { 
  tx: Transaction; 
  isOpen: boolean; 
  onClose: () => void;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  note: string;
  onUpdateNote: (note: string) => void;
  setTagFilter: (tag: string) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  initialTab?: 'overview' | 'breakdown' | 'tags' | 'notes';
}) {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'tags' | 'notes'>(initialTab);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(note);

  useEffect(() => {
    setTempNote(note);
  }, [note]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handleAdd = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    if (input.trim()) {
      onAddTag(input.trim());
      setInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-black/5 flex items-center justify-between bg-gradient-to-r from-surface-container-low to-surface-container-lowest">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                  {tx.amount > 0 ? <Plus className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-black text-on-surface tracking-tight leading-none">{tx.name}</h3>
                    <div className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                      {tx.category}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {tx.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Total Amount</p>
                  <span className={`text-4xl font-black tracking-tighter ${tx.amount > 0 ? 'text-primary' : 'text-on-surface'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              {/* Tabs Navigation */}
              <div className="relative flex items-center gap-1 mb-10 p-1.5 bg-surface-container-highest/30 rounded-2xl w-fit mx-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: Store },
                  { id: 'breakdown', label: 'Breakdown', icon: Tag },
                  { id: 'tags', label: 'Tags', icon: Tag },
                  { id: 'notes', label: 'Notes', icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
                      activeTab === tab.id 
                        ? 'text-primary' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white shadow-md shadow-black/5 rounded-xl -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {activeTab === 'overview' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Merchant Bento Card */}
                        <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-8">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-primary">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Store className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest">Merchant Details</h4>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Address</p>
                                <p className="text-base text-on-surface font-bold leading-tight">{tx.merchant.address}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Contact</p>
                                <p className="text-base text-on-surface font-bold">{tx.merchant.phone}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Website</p>
                                <a href={`https://${tx.merchant.website}`} target="_blank" rel="noopener noreferrer" className="text-base text-primary hover:underline font-black">
                                  {tx.merchant.website}
                                </a>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-4">
                              <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${tx.merchant.coordinates.lat},${tx.merchant.coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                              >
                                <MapPin className="w-4 h-4" />
                                Get Directions
                              </a>
                              <a 
                                href={`tel:${tx.merchant.phone}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  toast.info(`Initiating call to ${tx.merchant.phone}...`);
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-surface-container-high text-on-surface rounded-2xl text-sm font-bold hover:bg-surface-container-highest transition-all"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Call Merchant
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Map Bento Card */}
                        <div className="md:col-span-5 bg-surface-container-lowest rounded-[2rem] border border-black/5 shadow-sm overflow-hidden relative group/map min-h-[300px]">
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${tx.merchant.coordinates.lat},${tx.merchant.coordinates.lng}&zoom=15`}
                            allowFullScreen
                            title="Merchant Location"
                            className="grayscale-[0.2] group-hover/map:grayscale-0 transition-all duration-700"
                          />
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${tx.merchant.coordinates.lat},${tx.merchant.coordinates.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full px-4 py-3 bg-white/90 backdrop-blur-md text-on-surface text-xs font-bold rounded-xl shadow-2xl flex items-center justify-center gap-2 hover:bg-white transition-all transform group-hover/map:scale-[1.02]"
                            >
                              <MapPin className="w-4 h-4 text-primary" />
                              View on Google Maps
                            </a>
                          </div>
                        </div>

                        {/* Note Bento Card */}
                        <div className="md:col-span-12 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-[2rem] border border-primary/10 shadow-sm flex items-start justify-between gap-8">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3 text-primary">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FileText className="w-5 h-5" />
                              </div>
                              <h4 className="text-sm font-black uppercase tracking-widest">Quick Note</h4>
                            </div>
                            <p className="text-lg text-on-surface-variant font-medium italic leading-relaxed">
                              "{note || 'No notes added yet. Use the notes tab to add context to this transaction.'}"
                            </p>
                          </div>
                          <button 
                            onClick={() => setActiveTab('notes')}
                            className="px-6 py-3 bg-white text-primary rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all border border-primary/10"
                          >
                            Edit Note
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'breakdown' && (
                      <div className="max-w-md mx-auto">
                        <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-black/5 shadow-xl relative overflow-hidden">
                          {/* Receipt Style Header */}
                          <div className="text-center mb-10 space-y-2">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                              <Tag className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-black text-on-surface tracking-tight">Transaction Receipt</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">ID: {tx.id.toUpperCase()}</p>
                          </div>

                          <div className="space-y-6 relative z-10">
                            {tx.breakdown.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center group">
                                <div className="flex flex-col">
                                  <span className="text-sm font-black text-on-surface uppercase tracking-wider">{item.label}</span>
                                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Line Item {idx + 1}</span>
                                </div>
                                <span className="font-mono text-lg font-bold text-on-surface">{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                            
                            <div className="pt-8 border-t-2 border-dashed border-black/10 space-y-4">
                              <div className="flex justify-between items-center text-on-surface-variant">
                                <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                                <span className="font-mono font-bold">{formatCurrency(tx.amount)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-black text-on-surface uppercase tracking-tight">Total</span>
                                <span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(tx.amount)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Decorative dots for receipt feel */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
                          <div className="absolute bottom-0 left-0 w-full flex justify-around opacity-10">
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-black rounded-full -mb-1" />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'tags' && (
                      <div className="max-w-2xl mx-auto space-y-8">
                        <div className="text-center space-y-2 mb-10">
                          <h4 className="text-2xl font-black text-on-surface tracking-tight">Organize with Tags</h4>
                          <p className="text-on-surface-variant font-medium">Categorize this transaction for better search and reporting.</p>
                        </div>
                        
                        <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-black/5 shadow-sm space-y-10">
                          <div className="flex flex-wrap gap-3 justify-center">
                            {tags.length > 0 ? tags.map((tag, idx) => (
                              <motion.span 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                key={idx} 
                                className="inline-flex items-center gap-3 px-5 py-3 bg-white text-primary text-sm font-black rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-all group/tag"
                              >
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTagFilter(tag);
                                    setIsFilterOpen(true);
                                    onClose();
                                  }}
                                  className="hover:text-primary transition-colors"
                                >
                                  {tag}
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveTag(tag);
                                  }}
                                  className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-lg hover:bg-error/5"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </motion.span>
                            )) : (
                              <div className="py-12 text-center opacity-30">
                                <Tag className="w-12 h-12 mx-auto mb-4" />
                                <p className="text-sm font-bold uppercase tracking-widest">No tags added yet</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-4 max-w-md mx-auto">
                            <div className="relative flex-1">
                              <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                              <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Add a new tag..."
                                className="w-full pl-12 pr-5 py-4 text-sm bg-surface-container-low border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAdd();
                                  }
                                }}
                              />
                            </div>
                            <button 
                              onClick={handleAdd}
                              className="px-8 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center"
                            >
                              <Plus className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div className="max-w-3xl mx-auto space-y-8">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="text-2xl font-black text-on-surface tracking-tight">Notes & Insights</h4>
                            <p className="text-on-surface-variant font-medium">Add personal context or view AI-driven analysis.</p>
                          </div>
                          <button 
                            onClick={() => {
                              if (isEditingNote) {
                                onUpdateNote(tempNote);
                              }
                              setIsEditingNote(!isEditingNote);
                            }}
                            className={`px-6 py-3 rounded-xl text-sm font-black transition-all shadow-sm ${
                              isEditingNote 
                                ? 'bg-primary text-white hover:bg-primary/90' 
                                : 'bg-white text-primary border border-primary/10 hover:bg-primary/5'
                            }`}
                          >
                            {isEditingNote ? 'Save Changes' : 'Edit Note'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${isEditingNote ? 'bg-white border-primary shadow-xl ring-4 ring-primary/5' : 'bg-surface-container-low border-black/5 shadow-inner'}`}>
                            {isEditingNote ? (
                              <textarea
                                autoFocus
                                value={tempNote}
                                onChange={(e) => setTempNote(e.target.value)}
                                className="w-full p-0 text-lg text-on-surface bg-transparent border-none focus:outline-none min-h-[200px] resize-none font-medium leading-relaxed"
                                placeholder="Start typing your notes here..."
                              />
                            ) : (
                              <p className="text-lg text-on-surface font-medium italic leading-relaxed">
                                {note ? `"${note}"` : "No notes yet. Click edit to add context to this transaction."}
                              </p>
                            )}
                          </div>

                          <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                              <Sparkles className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 flex items-start gap-6">
                              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                                <BrainCircuit className="w-8 h-8" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-white/20 text-[10px] font-black uppercase tracking-widest rounded-md">Gemini Insight</span>
                                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Verified Analysis</span>
                                </div>
                                <h5 className="text-xl font-black tracking-tight">Budget Alignment</h5>
                                <p className="text-white/80 font-medium leading-relaxed max-w-md">
                                  This transaction perfectly aligns with your monthly Essentials budget. You're currently at 84% of your allocated limit for this category.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TransactionItem({ 
  tx, 
  onClick,
  tags,
  note,
  onIconClick
}: { 
  tx: Transaction; 
  onClick: () => void;
  tags: string[];
  note: string;
  onIconClick: (tab: 'tags' | 'notes') => void;
}) {
  const hasNote = note && note.trim().length > 0;

  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="w-full flex items-center justify-between p-5 group text-left border border-transparent hover:border-primary/10 hover:bg-surface-container-low rounded-2xl transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
          {tx.amount > 0 ? <Plus className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{tx.name}</p>
            <div className="flex items-center gap-1.5">
              {tags.length > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onIconClick('tags');
                  }}
                  className="p-1 hover:bg-primary/10 rounded-md transition-colors group/tag"
                  title="View Tags"
                >
                  <Tag className="w-3.5 h-3.5 text-primary/60 group-hover/tag:text-primary" />
                </button>
              )}
              {hasNote && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onIconClick('notes');
                  }}
                  className="p-1 hover:bg-primary/10 rounded-md transition-colors group/note"
                  title="View Notes"
                >
                  <FileText className="w-3.5 h-3.5 text-on-surface-variant/60 group-hover/note:text-primary" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-on-surface-variant font-medium">{tx.date} • {tx.category}</p>
            {tags.length > 0 && (
              <div className="flex gap-1">
                {tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-primary/5 text-primary/60 text-[10px] font-bold rounded-md border border-primary/10">
                    {tag}
                  </span>
                ))}
                {tags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{tags.length - 2}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className={`font-bold text-lg ${tx.amount > 0 ? 'text-primary' : 'text-on-surface'}`}>
          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
        </span>
        <div className="text-on-surface-variant group-hover:translate-x-1 transition-transform">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const { role } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'expenses' | 'budget'>('expenses');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState<'overview' | 'breakdown' | 'tags' | 'notes'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionTags, setTransactionTags] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    INITIAL_TRANSACTIONS.forEach(tx => {
      initial[tx.id] = (tx as any).initialTags || [];
    });
    return initial;
  });
  const [transactionNotes, setTransactionNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    INITIAL_TRANSACTIONS.forEach(tx => {
      initial[tx.id] = tx.notes;
    });
    return initial;
  });
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [insightFeedback, setInsightFeedback] = useState<string[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<'helpful' | 'not-relevant' | null>(null);
  
  // Filtering State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [tagFilter, setTagFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Sorting State
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    setCurrentFeedback(null);
    analytics.trackButtonClick('Generate AI Insights', 'FinancePage');
    const toastId = toast.loading('Gemini is analyzing your financial patterns...');
    try {
      const advice = await getFinancialAdvice(transactions, insightFeedback);
      setAiInsights(advice);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      toast.success('New insights generated successfully', { id: toastId });
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      toast.error('Failed to generate insights. Please check your connection.', { id: toastId });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleFeedback = (type: 'helpful' | 'not-relevant') => {
    if (currentFeedback) return;
    
    setCurrentFeedback(type);
    const feedbackText = type === 'helpful' 
      ? `The previous insight was helpful: "${aiInsights?.substring(0, 50)}..."`
      : `The previous insight was not relevant: "${aiInsights?.substring(0, 50)}..."`;
    
    setInsightFeedback(prev => [...prev, feedbackText]);
    analytics.trackButtonClick(`Insight Feedback: ${type}`, 'FinancePage');
    toast.success(type === 'helpful' ? 'Glad you found it helpful!' : 'Thanks for the feedback. We will adjust.');
  };

  const handleCopyInsights = () => {
    if (!aiInsights) return;
    navigator.clipboard.writeText(aiInsights);
    toast.success('Insights copied to clipboard');
    analytics.trackButtonClick('Copy AI Insights', 'FinancePage');
  };

  useEffect(() => {
    analytics.trackPageView('FinancePage');
    fetchInsights();
  }, []);

  const addTag = (id: string, tag: string) => {
    setTransactionTags(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), tag]
    }));
    analytics.trackButtonClick('Add Tag', 'FinancePage');
  };

  const removeTag = (id: string, tagToRemove: string) => {
    setTransactionTags(prev => ({
      ...prev,
      [id]: (prev[id] || []).filter(t => t !== tagToRemove)
    }));
    analytics.trackButtonClick('Remove Tag', 'FinancePage');
  };

  const updateNote = (id: string, note: string) => {
    setTransactionNotes(prev => ({
      ...prev,
      [id]: note
    }));
    analytics.trackButtonClick('Update Note', 'FinancePage');
  };

  const selectedTx = transactions.find(tx => tx.id === selectedTxId);

  // Derived Data
  const categories = ['All', ...Array.from(new Set(transactions.map(tx => tx.category)))];
  const allTags = ['All', ...Array.from(new Set(Object.values(transactionTags).flat()))];

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tx.merchant.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
    const matchesTag = tagFilter === 'All' || (transactionTags[tx.id] || []).includes(tagFilter);
    
    const txDate = new Date(tx.timestamp);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);
    
    const matchesDate = (!start || tx.timestamp >= start.getTime()) && 
                        (!end || tx.timestamp <= end.getTime());
    
    return matchesSearch && matchesCategory && matchesTag && matchesDate;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = a.timestamp - b.timestamp;
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleAddTransaction = (newTx: any) => {
    setTransactions(prev => [newTx, ...prev]);
    setTransactionTags(prev => ({ ...prev, [newTx.id]: [] }));
    setTransactionNotes(prev => ({ ...prev, [newTx.id]: newTx.notes }));
  };

  const handleUpdateTransaction = (id: string) => {
    setSelectedTxId(id);
    setInitialTab('overview');
    toast.info('Opening transaction details for update...');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    toast.success('Transaction deleted successfully');
  };

  const handleExport = () => {
    analytics.trackButtonClick('Export', 'FinancePage');
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: 'Preparing export...',
      success: 'Transaction history exported to CSV',
      error: 'Export failed'
    });
  };

  const handleAdjustBudgets = () => {
    analytics.trackButtonClick('Adjust Budgets', 'FinancePage');
    toast.info('Budget adjustment tool is coming soon to Vive Premium.');
  };

  const handleViewFullHistory = () => {
    analytics.trackButtonClick('View Full History', 'FinancePage');
    toast.info('Full transaction history is being synchronized from your connected accounts.');
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Accounting & Budgeting</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">
            Finance Dashboard
          </h1>
          <p className="text-on-surface-variant mt-2 max-w-2xl">
            Monitor your spending efficiency and budget allocations with AI-driven insights.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if (canAccessFeature(role, 'export_data')) {
                  handleExport();
                } else {
                  toast.error('Export is a Pro feature. Please upgrade to unlock.');
                }
              }}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                canAccessFeature(role, 'export_data') 
                  ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest' 
                  : 'bg-surface-container-low text-on-surface-variant cursor-not-allowed'
              }`}
            >
              {canAccessFeature(role, 'export_data') ? (
                <Download className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Export
            </button>
            <button 
              onClick={() => {
                setIsAddModalOpen(true);
                analytics.trackButtonClick('Add Transaction', 'FinancePage');
              }}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 p-1.5 bg-surface-container-low rounded-2xl w-fit border border-black/5">
        {[
          { id: 'expenses', label: 'Expenses', icon: CreditCard },
          { id: 'budget', label: 'Budget', icon: PieChartIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-12"
        >
          {activeTab === 'expenses' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Summary Stats */}
                <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-[2.5rem] shadow-lg shadow-emerald-200 flex flex-col justify-between min-h-[240px]">
              <div>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Total Balance</p>
                <h2 className="text-4xl font-black">{formatCurrency(158420.50)}</h2>
              </div>
              <div className="flex items-center gap-2 text-emerald-200 font-bold">
                <TrendingUp className="w-5 h-5" />
                <span>+4.2% from last month</span>
              </div>
            </div>

            <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col justify-between min-h-[240px]">
              <div>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-1">Monthly Spending</p>
                <h2 className="text-4xl font-black text-on-surface">{formatCurrency(11050.00)}</h2>
              </div>
              <div className="flex items-center gap-2 text-error font-bold">
                <ArrowUpRight className="w-5 h-5" />
                <span>12% over baseline</span>
              </div>
            </div>

            <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-black/5 flex flex-col justify-between min-h-[240px]">
              <div>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-1">Savings Rate</p>
                <h2 className="text-4xl font-black text-on-surface">22.4%</h2>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold">
                <ArrowDownRight className="w-5 h-5" />
                <span>Optimized by Gemini</span>
              </div>
            </div>

              {/* AI Insights Section */}
              <section className="md:col-span-12 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                {!canAccessFeature(role, 'ai_insights') && (
                  <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-on-surface mb-2">Gemini AI Insights</h3>
                    <p className="text-on-surface-variant font-medium max-w-md mb-6">
                      Unlock personalized financial wisdom and wealth optimization with our Premium AI engine.
                    </p>
                    <button 
                      onClick={() => toast.info('Upgrade to Premium to unlock AI Insights!')}
                      className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <BrainCircuit className="w-32 h-32 text-primary" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-on-surface">Gemini AI Insights</h2>
                      <p className="text-sm text-on-surface-variant font-medium">Personalized wealth optimization based on your activity.</p>
                    </div>
                  </div>
                  <button 
                    onClick={fetchInsights}
                    disabled={isLoadingInsights || !canAccessFeature(role, 'ai_insights')}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-primary border border-primary/20 rounded-xl font-bold hover:bg-primary/5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingInsights ? 'animate-spin' : ''}`} />
                    {isLoadingInsights ? 'Analyzing...' : 'Regenerate Insights'}
                  </button>
                </div>

                <div className="relative z-10">
                  {isLoadingInsights ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-primary/10 rounded-full w-3/4 animate-pulse" />
                      <div className="h-4 bg-primary/10 rounded-full w-1/2 animate-pulse" />
                      <div className="h-4 bg-primary/10 rounded-full w-2/3 animate-pulse" />
                    </div>
                  ) : aiInsights ? (
                    <div className="space-y-6">
                      <div className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {aiInsights}
                        </ReactMarkdown>
                      </div>
                      
                      <div className="pt-6 border-t border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Was this insight helpful?</p>
                          {lastUpdated && (
                            <span className="text-[10px] text-on-surface-variant/50 font-medium">Last updated: {lastUpdated}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleCopyInsights}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-on-surface-variant border border-black/5 hover:bg-primary/5 hover:text-primary transition-all"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </button>
                          <button 
                            onClick={() => handleFeedback('helpful')}
                            disabled={!!currentFeedback}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              currentFeedback === 'helpful' 
                                ? 'bg-primary text-white' 
                                : 'bg-white text-on-surface-variant border border-black/5 hover:bg-primary/5 hover:text-primary'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Helpful
                          </button>
                          <button 
                            onClick={() => handleFeedback('not-relevant')}
                            disabled={!!currentFeedback}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              currentFeedback === 'not-relevant' 
                                ? 'bg-error text-white' 
                                : 'bg-white text-on-surface-variant border border-black/5 hover:bg-error/5 hover:text-error'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Not Relevant
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Lightbulb className="w-12 h-12 text-on-surface-variant/30 mb-4" />
                      <p className="text-on-surface-variant font-medium">No insights generated yet. Click regenerate to start.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Budget Allocation */}
              <section className="md:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-on-surface">Budget Allocation</h2>
                    <button 
                      onClick={handleAdjustBudgets}
                      className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={handleAdjustBudgets}
                    className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-8">
                  {[
                    { name: 'Essentials', spent: 4200, total: 5000, color: 'bg-primary' },
                    { name: 'Leisure', spent: 1850, total: 2000, color: 'bg-tertiary' },
                    { name: 'Investments', spent: 5000, total: 5000, color: 'bg-secondary' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-on-surface text-lg">{item.name}</span>
                        <span className="text-sm font-bold text-on-surface-variant">
                          {formatCurrency(item.spent)} / {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.spent / item.total) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Financial Efficiency */}
              <section className="md:col-span-5 bg-surface-container-high rounded-[2.5rem] p-8 border border-black/5 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-on-surface mb-8">Financial Parity Score</h3>
                <div className="relative w-56 h-56 mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-highest" cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeWidth="12"></circle>
                    <motion.circle 
                      initial={{ strokeDashoffset: 628 }}
                      animate={{ strokeDashoffset: 628 - (628 * 0.75) }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="text-primary" 
                      cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeDasharray="628" strokeWidth="12" strokeLinecap="round"
                    ></motion.circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-on-surface">75%</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">Efficiency</span>
                  </div>
                </div>
                <p className="text-on-surface-variant leading-relaxed max-w-xs">
                  Your current spending efficiency is optimized. Gemini AI recommends increasing your 'Leisure' buffer by 5% next month based on your vitality trends.
                </p>
              </section>

              {/* Recent Transactions */}
              <section className="md:col-span-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <h2 className="text-2xl font-bold text-on-surface">Recent Transactions</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input 
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 py-2 bg-surface-container-low border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3 text-on-surface-variant" />
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setIsFilterOpen(!isFilterOpen);
                        setIsSortOpen(false);
                      }}
                      className={`p-2 rounded-xl border transition-all ${isFilterOpen ? 'bg-primary text-white border-primary' : 'bg-surface-container-low text-on-surface border-black/5 hover:bg-surface-container-high'}`}
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setIsSortOpen(!isSortOpen);
                        setIsFilterOpen(false);
                      }}
                      className={`p-2 rounded-xl border transition-all ${isSortOpen ? 'bg-primary text-white border-primary' : 'bg-surface-container-low text-on-surface border-black/5 hover:bg-surface-container-high'}`}
                    >
                      <TrendingUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 border-b border-black/5 mb-8">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                          <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-3 bg-surface-container-low border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Custom Tag</label>
                          <select 
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            className="w-full p-3 bg-surface-container-low border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date Range</label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                              <input 
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-black/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            <span className="text-on-surface-variant text-xs font-bold">to</span>
                            <div className="relative flex-1">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                              <input 
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-black/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 border-b border-black/5 mb-8">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sort By</label>
                          <div className="flex gap-2">
                            {[
                              { id: 'date', label: 'Date' },
                              { id: 'amount', label: 'Amount' },
                              { id: 'category', label: 'Category' },
                            ].map((option) => (
                              <button
                                key={option.id}
                                onClick={() => setSortBy(option.id as any)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                                  sortBy === option.id 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'bg-surface-container-low text-on-surface border-black/5 hover:bg-surface-container-high'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Order</label>
                          <div className="flex gap-2">
                            {[
                              { id: 'asc', label: 'Ascending', icon: ChevronUp },
                              { id: 'desc', label: 'Descending', icon: ChevronDown },
                            ].map((option) => (
                              <button
                                key={option.id}
                                onClick={() => setSortOrder(option.id as any)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                                  sortOrder === option.id 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'bg-surface-container-low text-on-surface border-black/5 hover:bg-surface-container-high'
                                }`}
                              >
                                <option.icon className="w-3 h-3" />
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <TransactionItem
                        key={tx.id}
                        tx={tx as any}
                        onClick={() => {
                          setInitialTab('overview');
                          setSelectedTxId(tx.id);
                          analytics.trackTransactionExpand(tx.id, tx.name);
                        }}
                        onIconClick={(tab) => {
                          setInitialTab(tab);
                          setSelectedTxId(tx.id);
                          analytics.trackTransactionExpand(tx.id, tx.name);
                        }}
                        tags={transactionTags[tx.id] || []}
                        note={transactionNotes[tx.id] || ''}
                      />
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto">
                        <Filter className="w-8 h-8 text-on-surface-variant/30" />
                      </div>
                      <p className="text-on-surface-variant font-medium">No transactions match your current filters.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('All');
                          setTagFilter('All');
                          setStartDate('');
                          setEndDate('');
                        }}
                        className="text-primary font-bold text-sm hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-8 border-t border-black/5 flex justify-center">
                  <button 
                    onClick={handleViewFullHistory}
                    className="text-primary font-bold text-sm hover:underline"
                  >
                    View Full History
                  </button>
                </div>
              </section>

              {/* Transaction List / Report Table */}
              <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-on-surface">Detailed Transactions</h2>
                    <p className="text-sm text-on-surface-variant font-medium">Complete record of your financial activity.</p>
                  </div>
                  <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl border border-black/5">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                      title="Grid View"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (canAccessFeature(role, 'view_detailed_reports')) {
                          setViewMode('table');
                        } else {
                          toast.error('Detailed Table View is a Pro feature. Please upgrade to unlock.');
                        }
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'table' 
                          ? 'bg-white text-primary shadow-sm' 
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      title="Table View"
                    >
                      {canAccessFeature(role, 'view_detailed_reports') ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {viewMode === 'table' ? (
                  <div className="overflow-x-auto bg-surface-container-lowest rounded-[2.5rem] border border-black/5 shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-black/5">
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Merchant</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Amount</th>
                          <th className="p-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-black/5 hover:bg-surface-container-low transition-colors group">
                            <td className="p-6 text-sm font-medium text-on-surface">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  {tx.category === 'Essentials' ? <ShoppingBag className="w-4 h-4" /> : 
                                   tx.category === 'Health' ? <HeartPulse className="w-4 h-4" /> :
                                   tx.category === 'Income' ? <TrendingUp className="w-4 h-4" /> :
                                   <CreditCard className="w-4 h-4" />}
                                </div>
                                <span className="text-sm font-bold text-on-surface">{tx.name}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-full">
                                {tx.category}
                              </span>
                            </td>
                            <td className={`p-6 text-sm font-black ${tx.amount < 0 ? 'text-error' : 'text-primary'}`}>
                              {tx.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setSelectedTxId(tx.id);
                                    setInitialTab('overview');
                                  }}
                                  className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleUpdateTransaction(tx.id)}
                                  className="p-2 hover:bg-secondary/10 text-secondary rounded-lg transition-colors"
                                  title="Update"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTransaction(tx.id)}
                                  className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx) => (
                        <TransactionItem
                          key={tx.id}
                          tx={tx as any}
                          onClick={() => {
                            setInitialTab('overview');
                            setSelectedTxId(tx.id);
                            analytics.trackTransactionExpand(tx.id, tx.name);
                          }}
                          onIconClick={(tab) => {
                            setInitialTab(tab);
                            setSelectedTxId(tx.id);
                          }}
                          tags={transactionTags[tx.id] || []}
                          note={transactionNotes[tx.id] || ''}
                        />
                      ))
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto">
                          <Filter className="w-8 h-8 text-on-surface-variant/30" />
                        </div>
                        <p className="text-on-surface-variant font-medium">No transactions match your current filters.</p>
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('All');
                            setTagFilter('All');
                            setStartDate('');
                            setEndDate('');
                          }}
                          className="text-primary font-bold text-sm hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { category: 'Essentials', spent: 1200, limit: 1500, color: 'bg-primary' },
                  { category: 'Health', spent: 450, limit: 500, color: 'bg-secondary' },
                  { category: 'Entertainment', spent: 800, limit: 600, color: 'bg-error' },
                  { category: 'Travel', spent: 200, limit: 1000, color: 'bg-tertiary' },
                ].map((budget) => {
                  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                  const isOver = budget.spent > budget.limit;
                  
                  return (
                    <div key={budget.category} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-black text-on-surface">{budget.category}</h3>
                          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Monthly Allocation</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-black ${isOver ? 'text-error' : 'text-on-surface'}`}>
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {percentage.toFixed(1)}% Consumed
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-4 bg-surface-container-high rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${isOver ? 'bg-error' : budget.color}`}
                        />
                      </div>
                      
                      {isOver && (
                        <div className="flex items-center gap-2 text-error text-xs font-bold">
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Budget exceeded by {formatCurrency(budget.spent - budget.limit)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex items-center gap-6 relative overflow-hidden">
                {!canAccessFeature(role, 'budget_optimization') && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center gap-4 px-8">
                    <Lock className="w-6 h-6 text-primary" />
                    <p className="text-sm font-bold text-on-surface">
                      Upgrade to Premium to unlock AI-powered Budget Optimization.
                    </p>
                    <button 
                      onClick={() => toast.info('Upgrade to Premium to unlock Budget Optimizer!')}
                      className="ml-auto px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-sm"
                    >
                      Upgrade
                    </button>
                  </div>
                )}
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-on-surface">Gemini Budget Optimizer</h4>
                  <p className="text-on-surface-variant font-medium">
                    Based on your spending patterns, we recommend reallocating $400 from Travel to Entertainment to cover your current overage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
      />

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <TransactionModal
          tx={selectedTx as any}
          isOpen={!!selectedTxId}
          onClose={() => setSelectedTxId(null)}
          tags={transactionTags[selectedTx.id] || []}
          onAddTag={(tag) => addTag(selectedTx.id, tag)}
          onRemoveTag={(tag) => removeTag(selectedTx.id, tag)}
          note={transactionNotes[selectedTx.id] || selectedTx.notes}
          onUpdateNote={(note) => updateNote(selectedTx.id, note)}
          setTagFilter={setTagFilter}
          setIsFilterOpen={setIsFilterOpen}
          initialTab={initialTab}
        />
      )}
    </div>
  );
}
