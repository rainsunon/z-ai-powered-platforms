import { motion, AnimatePresence } from 'motion/react';
import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  Download, 
  Plus, 
  Landmark, 
  Banknote, 
  CreditCard, 
  AlertTriangle,
  MoreHorizontal,
  ArrowRight,
  Flower,
  Utensils,
  Briefcase,
  X,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Sparkles,
  Globe,
  CheckCircle2,
  Store
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { canAccessFeature } from '@/lib/rbac';
import { Lock } from 'lucide-react';

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
  const { role } = useAuthStore();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
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
        <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm relative overflow-hidden">
          {!canAccessFeature(role, 'advanced_wealth_metrics') && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
              <Lock className="w-4 h-4 text-on-surface-variant/40" />
            </div>
          )}
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Annualized ROI</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-on-surface">14.8%</h4>
            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
              <Activity className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm relative overflow-hidden">
          {!canAccessFeature(role, 'advanced_wealth_metrics') && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
              <Lock className="w-4 h-4 text-on-surface-variant/40" />
            </div>
          )}
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
              <PieChart className="w-4 h-4 text-primary" />
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
            <div key={type} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              {type === 'Real Property' && !canAccessFeature(role, 'real_property_tracking') && (
                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                  <Lock className="w-8 h-8 text-primary mb-4" />
                  <h5 className="text-sm font-black text-on-surface mb-1">Real Property Tracking</h5>
                  <p className="text-[10px] font-bold text-on-surface-variant max-w-[150px] mb-4">
                    Premium feature. Track your real estate portfolio in real-time.
                  </p>
                  <button 
                    onClick={() => toast.info('Upgrade to Premium to track Real Properties!')}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
                  >
                    Upgrade
                  </button>
                </div>
              )}
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

export default function WealthPage() {
  const [isLinking, setIsLinking] = useState(false);
  const [step, setStep] = useState(1);

  const handleLink = () => {
    setIsLinking(true);
    setStep(1);
  };

  const handleDownloadReport = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Generating comprehensive wealth report...',
      success: 'Report downloaded successfully',
      error: 'Failed to generate report'
    });
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-on-surface-variant font-medium uppercase tracking-widest text-xs mb-2">Portfolio Overview</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Wealth Ecosystem</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadReport}
            className="px-6 py-3 bg-primary-fixed text-on-primary-fixed-variant rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Download Report
          </button>
          <button 
            onClick={handleLink}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Link Account
          </button>
        </div>
      </header>

      {/* Link Account Modal */}
      <AnimatePresence>
        {isLinking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLinking(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Landmark className="text-primary w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => setIsLinking(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {step === 1 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-on-surface">Connect Institution</h3>
                      <p className="text-on-surface-variant mt-2">Select your financial provider to synchronize your assets securely.</p>
                    </div>
                    <div className="space-y-3">
                      {['Chase Bank', 'Vanguard', 'Fidelity', 'Charles Schwab'].map((bank) => (
                        <button 
                          key={bank}
                          onClick={() => setStep(2)}
                          className="w-full p-4 bg-surface-container-low hover:bg-emerald-50 rounded-2xl flex items-center justify-between group transition-all border border-transparent hover:border-primary/20"
                        >
                          <span className="font-bold text-on-surface">{bank}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6 py-4">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="text-primary w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-on-surface">Securely Linked</h3>
                      <p className="text-on-surface-variant mt-2">Your account has been successfully integrated into the Vive Well-being ecosystem.</p>
                    </div>
                    <button 
                      onClick={() => setIsLinking(false)}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 p-4 flex items-center justify-center gap-2 border-t border-slate-100">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AES-256 Encrypted Protocol</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-12"
        >
          <WealthDashboard assets={INITIAL_ASSETS} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
