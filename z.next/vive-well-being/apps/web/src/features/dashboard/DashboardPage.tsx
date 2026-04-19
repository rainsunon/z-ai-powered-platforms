import { motion } from 'motion/react';
import { Link } from '@tanstack/react-router';
import { 
  TrendingUp, 
  Activity, 
  Moon, 
  PieChart, 
  Footprints, 
  RefreshCw, 
  Stethoscope, 
  Calendar,
  ArrowRight,
  Bolt
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function DashboardPage() {
  const handleIntelligenceClick = (label: string) => {
    toast.info(`${label} is currently running in the background.`);
  };

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Daily Overview</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Hello, Alexandra</h1>
          <p className="text-on-surface-variant mt-2 max-w-md">Your equilibrium is at 84% today. Wealth is scaling steadily while sleep recovery needs focus.</p>
        </motion.div>
        <div className="flex gap-3">
          <div className="bg-emerald-100 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-tight">Inngest Live</span>
          </div>
        </div>
      </section>

      {/* Real-time Alerts Ticker */}
      <div className="overflow-hidden bg-surface-container-low rounded-2xl py-3 px-6 flex items-center gap-4">
        <Bolt className="text-tertiary w-5 h-5" />
        <div className="flex gap-8 whitespace-nowrap text-sm font-medium text-on-surface-variant animate-marquee">
          <span>Wealth: Dividend payout from $AAPL confirmed ($124.50)</span>
          <span className="text-outline-variant">|</span>
          <span>Health: Deep sleep increased by 14% last night</span>
          <span className="text-outline-variant">|</span>
          <span>Inngest: Monthly portfolio rebalancing job completed successfully</span>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Wealth Hero Card */}
        <motion.div 
          className="md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 relative overflow-hidden group shadow-sm border border-black/5"
          whileHover={{ y: -5 }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Total Net Worth</span>
              <TrendingUp className="w-3 h-3 text-primary" />
            </div>
            <div className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-8">
              {formatCurrency(1428950)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-on-surface-variant text-xs font-medium mb-1">Investments</p>
                <p className="text-lg font-bold text-on-surface">{formatCurrency(982400)}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs font-medium mb-1">Liquid Cash</p>
                <p className="text-lg font-bold text-on-surface">{formatCurrency(42550)}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs font-medium mb-1">Real Estate</p>
                <p className="text-lg font-bold text-on-surface">{formatCurrency(404000)}</p>
              </div>
              <div className="flex items-end">
                <Link to="/wealth" className="w-full">
                  <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors">
                    Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Health Status Vertical Card */}
        <motion.div 
          className="md:col-span-4 bg-primary rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-lg shadow-emerald-200"
          whileHover={{ y: -5 }}
        >
          <div>
            <h3 className="text-2xl font-bold mb-6">Vitality Score</h3>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" fill="transparent" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="12"></circle>
                  <circle cx="80" cy="80" fill="transparent" r="70" stroke="white" strokeDasharray="440" strokeDashoffset="88" strokeLinecap="round" strokeWidth="12"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold">84</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Optimal</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold">Heart Rate</span>
              </div>
              <span className="text-sm font-bold">62 BPM</span>
            </div>
            <div className="flex justify-between items-center bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold">Sleep Quality</span>
              </div>
              <span className="text-sm font-bold">7h 42m</span>
            </div>
          </div>
        </motion.div>

        {/* Budget Status Card */}
        <div className="md:col-span-5 bg-surface-container-high rounded-[2rem] p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-on-surface">Budget Control</h3>
              <p className="text-on-surface-variant text-sm mt-1">Monthly cycle ends in 8 days</p>
            </div>
            <PieChart className="text-primary w-6 h-6" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-on-surface">Essentials</span>
                <span className="font-bold text-on-surface">62%</span>
              </div>
              <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-on-surface">Leisure & Lifestyle</span>
                <span className="font-bold text-on-surface">85%</span>
              </div>
              <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "You've spent $450 more on 'Dining' than last month. Consider moving $200 from 'General Savings' to balance."
              </p>
            </div>
          </div>
        </div>

        {/* Activity & Steps Card */}
        <div className="md:col-span-3 bg-white rounded-[2rem] p-8 shadow-sm border border-emerald-50">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <Footprints className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-on-surface">Daily Activity</h3>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-primary">8,432</div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Steps Today</div>
              </div>
            </div>
            <div className="mt-6 flex gap-1 items-end h-20">
              {[40, 60, 30, 80, 50, 95, 20].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-lg ${i === 5 ? 'bg-primary' : 'bg-primary-fixed'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* System Intelligence */}
        <div className="md:col-span-4 bg-emerald-50 rounded-[2rem] p-8 overflow-hidden relative">
          <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
            System Intelligence
            <span className="block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </h3>
          <div className="space-y-4">
            {[
              { icon: RefreshCw, label: 'Portfolio Rebalancing', status: 'SUCCESS', color: 'bg-emerald-100 text-emerald-700' },
              { icon: Stethoscope, label: 'Health Data Sync', status: 'DONE', color: 'bg-emerald-100 text-emerald-700' },
              { icon: Calendar, label: 'Weekly Report Gen', status: 'RUNNING', color: 'bg-blue-100 text-blue-700' },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => handleIntelligenceClick(item.label)}
                className="w-full flex items-center justify-between p-3 bg-white/80 rounded-xl hover:bg-white transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-tight text-emerald-900">{item.label}</span>
                </div>
                <span className={`text-[10px] ${item.color} px-2 py-0.5 rounded-full font-bold`}>{item.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
