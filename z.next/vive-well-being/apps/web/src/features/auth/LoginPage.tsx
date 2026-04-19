import { motion } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  Fingerprint, 
  Eye 
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from '@tanstack/react-router';

export default function LoginPage() {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: '1',
      name: 'Alexandra',
      email: 'alexandra@vive.ai',
      role: 'premium',
    });
    navigate({ to: '/' });
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column: Branding */}
      <section className="relative w-full md:w-[45%] lg:w-[40%] min-h-[353px] md:min-h-screen p-8 md:p-16 flex flex-col justify-between overflow-hidden bg-[#064e3b]">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80" 
            className="w-full h-full object-cover mix-blend-overlay" 
            alt="Abstract" 
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl tracking-tighter">NX</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-white">Vive Well-being</h1>
          </div>
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
              Elevate your <span className="text-primary">Vitality.</span> Secure your <span className="text-tertiary">Legacy.</span>
            </h2>
            <p className="text-emerald-100 text-lg md:text-xl max-w-md font-medium leading-relaxed">
              Welcome to the intersection of health and wealth. Our private ecosystem is designed for those who demand peak performance in every aspect of life.
            </p>
          </div>
        </div>
        <div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl self-start">
            <div className="text-primary text-2xl font-headline font-bold mb-1">94%</div>
            <div className="text-white/70 text-xs font-label uppercase tracking-widest">Health Index</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mt-8 self-end">
            <div className="text-tertiary text-2xl font-headline font-bold mb-1">+12.4%</div>
            <div className="text-white/70 text-xs font-label uppercase tracking-widest">Growth Parity</div>
          </div>
        </div>
      </section>

      {/* Right Column: Auth Flow */}
      <section className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center p-6 md:p-12 lg:p-24 bg-surface">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h3 className="font-headline font-bold text-3xl text-on-surface">Experience Equilibrium</h3>
            <p className="text-on-surface-variant">Access your dashboard to synchronize your metrics.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">Institutional Email</label>
                <input 
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  placeholder="name@company.com" 
                  type="email" 
                  defaultValue="alexandra@vive.ai"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="••••••••" 
                    type="password" 
                    defaultValue="password123"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary" type="button">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                  <Fingerprint className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface leading-none">Biometric Access</p>
                  <p className="text-xs text-on-surface-variant mt-1">Faster, secure sign-in</p>
                </div>
              </div>
              <button className="w-12 h-6 bg-primary rounded-full relative p-1 transition-colors" type="button">
                <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
              </button>
            </div>

            <button className="w-full bg-primary text-white py-4 px-6 rounded-xl font-headline font-bold text-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all" type="submit">
              Sign In to Vive Well-being
            </button>
          </form>

          <div className="pt-12 text-center">
            <p className="text-[10px] text-outline font-label uppercase tracking-widest leading-relaxed">
              By continuing, you agree to our <br className="md:hidden"/>
              <a className="hover:text-primary transition-colors" href="#">Privacy Charter</a> & 
              <a className="hover:text-primary transition-colors" href="#">Wealth Compliance</a>
            </p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-12 right-12 hidden lg:flex items-center gap-4 bg-white p-4 rounded-2xl shadow-2xl border border-surface-container-high max-w-xs">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-surface">Secure Protocol Active</h4>
          <p className="text-xs text-on-surface-variant">256-bit AES encryption enabled for this session.</p>
        </div>
      </div>
    </main>
  );
}
