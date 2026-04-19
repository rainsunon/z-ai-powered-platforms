import { motion } from 'motion/react';
import { User, Settings, Shield, Bell, Crown, Star, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore, UserRole } from '@/lib/store';

export default function ProfilePage() {
  const { role, setRole } = useAuthStore();

  const handleSettingClick = (label: string) => {
    toast.info(`${label} settings are managed by your organization's administrator.`);
  };

  const roles: { id: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'free', label: 'Free User', icon: UserIcon, color: 'bg-slate-100 text-slate-700', desc: 'Basic tracking and dashboard' },
    { id: 'pro', label: 'Pro User', icon: Star, color: 'bg-blue-100 text-blue-700', desc: 'Detailed reports and data export' },
    { id: 'premium', label: 'Premium User', icon: Crown, color: 'bg-emerald-100 text-emerald-700', desc: 'AI insights and advanced metrics' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-2">User Settings</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Your Profile</h1>
      </header>

      <div className="max-w-2xl space-y-10">
        <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-sm flex items-center gap-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="text-primary w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Alexandra Sterling</h2>
            <p className="text-on-surface-variant font-medium">alexandra.sterling@vive.io</p>
            <span className={`mt-2 inline-block px-3 py-1 ${roles.find(r => r.id === role)?.color} text-[10px] font-bold rounded-full uppercase tracking-widest`}>
              {roles.find(r => r.id === role)?.label}
            </span>
          </div>
        </div>

        <section className="space-y-6">
          <h3 className="text-xl font-bold text-on-surface">Subscription Plan</h3>
          <div className="grid grid-cols-1 gap-4">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  toast.success(`Switched to ${r.label} plan!`);
                }}
                className={`p-6 rounded-2xl border transition-all flex items-center gap-4 text-left ${
                  role === r.id 
                    ? 'bg-primary/5 border-primary shadow-sm' 
                    : 'bg-white border-black/5 hover:bg-surface-container-low'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === r.id ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  <r.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface">{r.label}</p>
                  <p className="text-xs text-on-surface-variant">{r.desc}</p>
                </div>
                {role === r.id && (
                  <div className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: Settings, label: 'Account Settings', desc: 'Manage your personal information and preferences' },
            { icon: Shield, label: 'Privacy & Security', desc: 'Control your data sharing and security protocols' },
            { icon: Bell, label: 'Notifications', desc: 'Configure how you receive system alerts' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => handleSettingClick(item.label)}
              className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm flex items-center gap-4 text-left hover:bg-surface-container-low transition-all active:scale-[0.99]"
            >
              <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div>
                <p className="font-bold text-on-surface">{item.label}</p>
                <p className="text-xs text-on-surface-variant">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
