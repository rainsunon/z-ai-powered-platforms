import React from 'react';
import { useNavigate } from 'react-router-dom';

export function AppointmentCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/appointments')}
      className="p-8 rounded-3xl primary-gradient text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="font-headline font-bold text-xl">Next Appointment</h2>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <span className="material-symbols-outlined">calendar_today</span>
        </div>
      </div>

      <div className="relative z-10">
        <p className="font-headline font-bold text-3xl mb-1">10:30 AM</p>
        <p className="font-body text-on-primary/80 text-sm mb-6">Today, Oct 24 • Video Call</p>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors">
          <img src="https://i.pravatar.cc/150?u=dr_aris" alt="Dr. Aris" className="w-12 h-12 rounded-full border-2 border-white/50" />
          <div>
            <p className="font-headline font-bold text-sm">Dr. Sarah Aris</p>
            <p className="font-body text-xs text-on-primary/80">Neurologist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
