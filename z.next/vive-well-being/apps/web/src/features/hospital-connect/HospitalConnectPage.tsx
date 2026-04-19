import { motion } from 'motion/react';
import { Stethoscope, Hospital, Calendar, MessageSquare, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { canAccessFeature } from '@/lib/rbac';

export default function HospitalConnectPage() {
  const { role } = useAuthStore();

  const handleBook = () => {
    toast.info('Appointment booking system is currently in maintenance. Please try again later.');
  };

  const handleConsultation = () => {
    if (canAccessFeature(role, 'telehealth_access')) {
      toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
        loading: 'Connecting to a specialist...',
        success: 'Specialist found. Opening secure chat...',
        error: 'Connection failed'
      });
    } else {
      toast.error('Telehealth Chat is a Pro feature. Please upgrade to unlock.');
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Medical Services</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Hospital Connect</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Calendar className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upcoming Appointments</h3>
          <p className="text-on-surface-variant">No upcoming appointments scheduled.</p>
          <button 
            onClick={handleBook}
            className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
          >
            Book New Appointment
          </button>
        </div>

        <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-sm relative overflow-hidden">
          {!canAccessFeature(role, 'telehealth_access') && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
              <Lock className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Telehealth Chat</h3>
              <p className="text-xs text-on-surface-variant max-w-[200px] mb-6">
                Connect with specialists instantly. Available for Pro and Premium members.
              </p>
              <button 
                onClick={() => toast.info('Upgrade to Pro to unlock Telehealth Chat!')}
                className="px-6 py-2 bg-secondary text-white rounded-xl font-bold shadow-sm"
              >
                Upgrade to Pro
              </button>
            </div>
          )}
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
            <MessageSquare className="text-secondary w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Telehealth Chat</h3>
          <p className="text-on-surface-variant">Connect with a specialist in minutes.</p>
          <button 
            onClick={handleConsultation}
            className="mt-6 w-full py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all active:scale-95"
          >
            Start Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
