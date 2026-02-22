// src/features/scheduling/components/ConsultationCard.tsx
import React from 'react';

interface ConsultationCardProps {
    onJoin: () => void;
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({ onJoin }) => {
    return (
        <div className="relative overflow-hidden bg-primary rounded-[40px] p-10 text-white shadow-[0_30px_60px_-15px_rgba(32,132,104,0.4)] transition-all transform hover:scale-[1.01]">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                    <span className="bg-white/20 border border-white/20 px-4 py-1.5 rounded-full text-[9px] font-black backdrop-blur-xl uppercase tracking-[0.3em]">Starting in 15 Minutes</span>
                    <span className="material-icons cursor-pointer hover:scale-110 transition-transform">more_horiz</span>
                </div>
                <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter">Corporate Tax Strategy</h3>
                <p className="text-white/60 text-xs font-bold mb-10 flex items-center gap-2 uppercase tracking-widest">
                    <span className="material-icons text-sm">schedule</span> 11:15 AM — 12:00 PM
                </p>
                <div className="flex items-center -space-x-3 mb-10">
                    <img src="https://picsum.photos/id/1/100/100" className="w-12 h-12 rounded-full border-4 border-primary object-cover shadow-2xl" alt="P1" />
                    <img src="https://picsum.photos/id/2/100/100" className="w-12 h-12 rounded-full border-4 border-primary object-cover shadow-2xl" alt="P2" />
                    <div className="w-12 h-12 rounded-full border-4 border-primary bg-white/20 flex items-center justify-center text-[10px] font-black backdrop-blur-xl shadow-2xl">+1</div>
                </div>
                <button
                    onClick={onJoin}
                    className="w-full bg-white text-primary py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <span className="material-icons">phone_in_talk</span>
                    Join Consultation
                </button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        </div>
    );
};
