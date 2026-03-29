import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportCategoryCard } from './components/SupportCategoryCard';
import { SupportSearchBar } from './components/SupportSearchBar';
import { LiveChatCard } from './components/LiveChatCard';
import { MyTicketsPanel, type Ticket } from './components/MyTicketsPanel';
import { CommunityCTA } from './components/CommunityCTA';

const FAQ_CATEGORIES = [
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

const TICKETS: Ticket[] = [
  {
    id: '#NH-9021', status: 'In Review', statusVariant: 'secondary',
    title: 'Health Records Sync Error',
    description: 'Data from my Apple Watch is not syncing with the app dashboard...',
  },
  {
    id: '#NH-8842', status: 'Resolved', statusVariant: 'outline',
    title: 'Billing Address Update',
    description: 'I need to change my primary billing address for my insurance...',
    isResolved: true,
  },
];

const CHAT_AGENTS = [
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMqB1gPOgGuuA744kkK0WvM5tJVgf0AfGRhOBkmZPtO1me3y_57tJKqGToKV3Ci7QyKzWmGf--ppHDC3CqaPE9gZ6zGfA8Sx8TITFesfU-Lr-NEwUEVFg7oCSpjpn2Rl1NEPqGZnBCMTqnbbd6xg-nX_hmQ2ePK8c80PrvvkQxJIPM65SVnP-wSXkxQcCPz6a_PtsUy8U6QavraTfULXXxSfiuzN3LyOn_LXusMtFOMLQToVVXrdCUDnZRba-vtcYJRhy-acuKZIc', alt: 'Agent 1' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTpmhiRkwZO_FI4AJIErrYWh0REtYoSVNLKzWGfAlkHXxbPKz51ZxMFeA7WNy0xE_vEiaw-iojIUzh0U2fDzFt3fEhqsQ28bFWtoEWn0uWpMBR0xgyBUiKw1wbz-cpfaMdTSJDEujOSk0uK_xaSUNGld0GmXKYAbpWH6b_FkGxLdcSRebDK-ZjzBJj03lpqcOCZibiEeruOV_nJGXWrBvmVVaOz5XoAA99sctWZLUJn41BNjIZR91cGT4f5zEmgixL7NVVz7rXNco', alt: 'Agent 2' },
  { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcKzsu-m8CtXoDRi3NCLZac3OGhdF4QKA1lMg_Vc1Z4_JvTYIFwqfaS-xKlm1X2yoh7GQACEGpLT4XB89t8DdU5x_76NT5UY6LMV_37Uf1TwBImtbjDf1p6HTM7wF1fDTSId3uJBngaQ4hnCSra5-oRasoQTRU_4xVVEeR8dgTBLOZ4Hwm15JFbfEx5zj1Aa5RXjmEr5_eLSU9cmsPmndkMpxpaKWIXo7wmliACflAny6K8e9OYr-QueNDdyCNstoKueARgRN8zks', alt: 'Agent 3' },
];

const COMMUNITY_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDFPJiPKDv4vBhowal9TnT9Kr83WQCu_Q1xIdwreZXXHhlkBiaLPynkzAn0yY8w8o_P2sVOnz0ykw0ep6o4KUq9zfN49kJdeINk5hYY8XM-Bh18LunwlMsNAHytfXdRs94ICy3XeaB_6G93kl_-u5muigi_z6vNRrzz3VqYagGraA5LBchpTEr-RhObRZj4VNfKnXou0NVJZQKaDoB-FfkRqNmYElgP2kZACvitLGCB2MmRUJjwyh9XBvXU8ZXThkRKUZ-EAI-yv10';

export function Support() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <div className="p-4 md:p-12 lg:p-20 overflow-x-hidden">
        {/* Hero Header Section */}
        <header className="max-w-5xl mx-auto mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-primary font-bold tracking-widest text-xs uppercase">
              <span className="w-12 h-px bg-primary/30" />
              Help & Support
            </div>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.1]">
              Welcome to your <br /><span className="text-primary italic">Luminous Sanctuary.</span>
            </h2>
            <SupportSearchBar />
          </div>
        </header>

        {/* Grid Layout for Support Modules */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQ Categories */}
          <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ_CATEGORIES.map((cat) => (
              <SupportCategoryCard key={cat.title} {...cat} />
            ))}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            <LiveChatCard
              agents={CHAT_AGENTS}
              extraCount={12}
              waitMinutes={2}
              onStartChat={() => navigate('/chat')}
            />
            <MyTicketsPanel tickets={TICKETS} />
          </aside>
        </div>

        <CommunityCTA imageUrl={COMMUNITY_IMAGE} />
      </div>
    </div>
  );
}
