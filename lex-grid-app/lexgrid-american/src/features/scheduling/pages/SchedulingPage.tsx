// src/features/scheduling/pages/SchedulingPage.tsx
import React from 'react';
import Layout from '../../../components/layout/Layout';
import { SchedulingHeader } from '../components/SchedulingHeader';
import { CalendarWidget } from '../components/CalendarWidget';
import { AvailableSlots } from '../components/AvailableSlots';
import { ConsultationCard } from '../components/ConsultationCard';
import { CameraPreview } from '../components/CameraPreview';

interface SchedulingPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const SchedulingPage: React.FC<SchedulingPageProps> = ({ theme, toggleTheme }) => {
    const handleJoinConsultation = () => {
        // Initiates a phone call using the tel: protocol
        window.location.href = 'tel:+18005550199';
    };

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 font-sans">
                <SchedulingHeader />

                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 lg:col-span-7 space-y-10">
                        <CalendarWidget />
                        <AvailableSlots />
                    </div>

                    <div className="col-span-12 lg:col-span-5 space-y-10">
                        <ConsultationCard onJoin={handleJoinConsultation} />
                        <CameraPreview />

                        <div className="bg-brand/10 dark:bg-brand/5 border-2 border-brand/20 dark:border-brand/30 backdrop-blur-2xl rounded-[40px] p-8 flex items-center gap-6 group cursor-pointer transition-all hover:scale-[1.02]">
                            <div className="w-14 h-14 bg-primary/20 dark:bg-primary/30 rounded-2xl flex items-center justify-center text-primary dark:text-primary-400 group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                                <span className="material-icons text-2xl">security</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary dark:text-primary-400 uppercase tracking-[0.3em] mb-1">Secure Consultation</p>
                                <p className="text-xs text-brand dark:text-brand-400 font-bold uppercase tracking-tighter">AES-256 Encrypted & HIPAA Compliant</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SchedulingPage;
