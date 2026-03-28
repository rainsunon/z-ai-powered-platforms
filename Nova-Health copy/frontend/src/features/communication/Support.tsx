import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportCategoryCard } from './components/SupportCategoryCard';
import { TicketItem } from './components/TicketItem';

const faqCategories = [
  {
    icon: 'verified_user', title: 'Account Security',
    description: 'Two-factor authentication, password resets, and login activity management.',
    linkText: 'View Articles',
    iconBgClass: 'bg-primary/10', cardBgClass: 'bg-surface-container', cardHoverClass: 'hover:bg-surface-container-highest',
  },
  {
    icon: 'database', title: 'Health Data',
    description: 'How we protect your privacy and export your medical history securely.',
    linkText: 'Privacy Policy',
    iconBgClass: 'bg-secondary-container', cardBgClass: 'bg-surface-container-low', cardHoverClass: 'hover:bg-surface-container-high',
  },
  {
    icon: 'calendar_today', title: 'Appointments',
    description: 'Scheduling, rescheduling, or canceling tele-health consultations.',
    linkText: 'Manage Booking',
    iconBgClass: 'bg-tertiary-fixed', iconColorClass: 'text-tertiary',
    cardBgClass: 'bg-white', cardHoverClass: 'hover:shadow-2xl hover:shadow-primary/5',
  },
  {
    icon: 'receipt_long', title: 'Billing',
    description: 'Insurance claims, payment methods, and monthly subscription details.',
    linkText: 'Invoices',
    iconBgClass: 'bg-primary/10', cardBgClass: 'bg-surface-container', cardHoverClass: 'hover:bg-surface-container-highest',
  },
];

const tickets = [
  {
    id: '#NH-9021', status: 'In Review', statusVariant: 'secondary' as const,
    title: 'Health Records Sync Error',
    description: 'Data from my Apple Watch is not syncing with the app dashboard...',
  },
  {
    id: '#NH-8842', status: 'Resolved', statusVariant: 'outline' as const,
    title: 'Billing Address Update',
    description: 'I need to change my primary billing address for my insurance...',
    isResolved: true,
  },
];

export function Support() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <div className="p-4 md:p-12 lg:p-20 overflow-x-hidden">
        {/* Hero Header Section */}
        <header className="max-w-5xl mx-auto mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-primary font-bold tracking-widest text-xs uppercase">
              <span className="w-12 h-px bg-primary/30"></span>
              Help & Support
            </div>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.1]">
              Welcome to your <br/><span className="text-primary italic">Luminous Sanctuary.</span>
            </h2>

            {/* Search Bar Bento-Style */}
            <div className="mt-8 relative max-w-2xl group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-primary/60">search</span>
              </div>
              <input 
                type="text" 
                placeholder="Search for answers..." 
                className="w-full pl-16 pr-6 py-6 bg-surface-container-low border-none rounded-[2rem] focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium placeholder:text-on-surface/40"
              />
              <div className="absolute right-3 inset-y-3">
                <button className="h-full px-8 bg-on-surface text-surface rounded-full font-bold hover:bg-primary transition-colors">Search</button>
              </div>
            </div>
          </div>
        </header>

        {/* Grid Layout for Support Modules */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQ Categories Section (Bento Style) */}
          <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqCategories.map((cat) => (
              <SupportCategoryCard key={cat.title} {...cat} />
            ))}
          </section>

          {/* Sidebar Content (Live Chat & Tickets) */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            {/* Live Chat Card */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white relative overflow-hidden shadow-[0px_20px_40px_rgba(21,30,18,0.06)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-bold text-primary uppercase tracking-widest">Live Now</span>
              </div>
              <h4 className="text-3xl font-headline font-extrabold mb-4 leading-tight">Need immediate assistance?</h4>
              <p className="text-on-surface/70 mb-8">Our specialists are ready to help you with any urgent health data concerns.</p>
              
              <div className="flex -space-x-3 mb-8">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMqB1gPOgGuuA744kkK0WvM5tJVgf0AfGRhOBkmZPtO1me3y_57tJKqGToKV3Ci7QyKzWmGf--ppHDC3CqaPE9gZ6zGfA8Sx8TITFesfU-Lr-NEwUEVFg7oCSpjpn2Rl1NEPqGZnBCMTqnbbd6xg-nX_hmQ2ePK8c80PrvvkQxJIPM65SVnP-wSXkxQcCPz6a_PtsUy8U6QavraTfULXXxSfiuzN3LyOn_LXusMtFOMLQToVVXrdCUDnZRba-vtcYJRhy-acuKZIc" alt="Agent 1" className="w-12 h-12 rounded-full border-4 border-white object-cover" />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTpmhiRkwZO_FI4AJIErrYWh0REtYoSVNLKzWGfAlkHXxbPKz51ZxMFeA7WNy0xE_vEiaw-iojIUzh0U2fDzFt3fEhqsQ28bFWtoEWn0uWpMBR0xgyBUiKw1wbz-cpfaMdTSJDEujOSk0uK_xaSUNGld0GmXKYAbpWH6b_FkGxLdcSRebDK-ZjzBJj03lpqcOCZibiEeruOV_nJGXWrBvmVVaOz5XoAA99sctWZLUJn41BNjIZR91cGT4f5zEmgixL7NVVz7rXNco" alt="Agent 2" className="w-12 h-12 rounded-full border-4 border-white object-cover" />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcKzsu-m8CtXoDRi3NCLZac3OGhdF4QKA1lMg_Vc1Z4_JvTYIFwqfaS-xKlm1X2yoh7GQACEGpLT4XB89t8DdU5x_76NT5UY6LMV_37Uf1TwBImtbjDf1p6HTM7wF1fDTSId3uJBngaQ4hnCSra5-oRasoQTRU_4xVVEeR8dgTBLOZ4Hwm15JFbfEx5zj1Aa5RXjmEr5_eLSU9cmsPmndkMpxpaKWIXo7wmliACflAny6K8e9OYr-QueNDdyCNstoKueARgRN8zks" alt="Agent 3" className="w-12 h-12 rounded-full border-4 border-white object-cover" />
                <div className="w-12 h-12 rounded-full border-4 border-white bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">+12</div>
              </div>

              <button 
                onClick={() => navigate('/chat')}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-on-primary-container transition-colors shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">forum</span>
                Start Live Chat
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-4">Estimated wait time: <span className="font-bold text-primary">2 mins</span></p>
            </div>

            {/* My Tickets Section */}
            <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/15">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-bold tracking-tight">My Tickets</h4>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">2 Active</span>
              </div>
              
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <TicketItem key={ticket.id} {...ticket} />
                ))}
              </div>

              <button className="w-full mt-6 py-4 text-primary font-bold text-sm border-2 border-primary/20 rounded-2xl hover:bg-primary/5 transition-colors">
                View All History
              </button>
            </div>
          </aside>
        </div>

        {/* Community CTA Section */}
        <section className="max-w-7xl mx-auto mt-24 mb-12">
          <div className="bg-on-surface text-surface p-12 md:p-16 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 tracking-tighter">Join the Vitality Community</h2>
              <p className="text-surface/70 text-lg leading-relaxed mb-8">Can't find what you're looking for? Ask our global community of NovaHealth users and medical experts.</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-surface text-on-surface px-8 py-4 rounded-full font-bold hover:bg-secondary-fixed transition-colors">Visit Forums</button>
                <button className="border border-surface/30 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">Browse Topics</button>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-1/3 aspect-square max-w-[300px]">
              <div className="w-full h-full rounded-[3rem] rotate-12 bg-primary-container/20 backdrop-blur-3xl border border-white/10 flex items-center justify-center p-8">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFPJiPKDv4vBhowal9TnT9Kr83WQCu_Q1xIdwreZXXHhlkBiaLPynkzAn0yY8w8o_P2sVOnz0ykw0ep6o4KUq9zfN49kJdeINk5hYY8XM-Bh18LunwlMsNAHytfXdRs94ICy3XeaB_6G93kl_-u5muigi_z6vNRrzz3VqYagGraA5LBchpTEr-RhObRZj4VNfKnXou0NVJZQKaDoB-FfkRqNmYElgP2kZACvitLGCB2MmRUJjwyh9XBvXU8ZXThkRKUZ-EAI-yv10" alt="Community" className="w-full h-full object-cover rounded-2xl shadow-2xl -rotate-12" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
