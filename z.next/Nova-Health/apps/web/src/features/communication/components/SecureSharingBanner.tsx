import React from 'react';
import { Button } from '@/components/ui/button';

export function SecureSharingBanner() {
  return (
    <section className="primary-gradient rounded-[3rem] p-10 md:p-14 relative overflow-hidden text-white shadow-2xl shadow-primary/30">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-6">
          <h3 className="text-3xl md:text-4xl font-extrabold font-headline leading-tight italic">
            Secure Sharing Made Simple
          </h3>
          <p className="text-emerald-50 text-lg">
            Need to share your records with a specialist? Generate a one-time secure link or add your
            doctor directly to your circle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="px-8 py-4 bg-white text-primary rounded-2xl font-bold font-headline shadow-xl shadow-black/10 hover:scale-105 hover:bg-white transition-transform"
            >
              Invite Doctor
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 bg-emerald-800/20 text-white border-emerald-400/30 backdrop-blur-md rounded-2xl font-bold font-headline hover:bg-emerald-800/40"
            >
              Learn About Security
            </Button>
          </div>
        </div>
        <div className="hidden lg:block relative shrink-0">
          <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-[8rem] text-emerald-200/40">lock_person</span>
          </div>
          <div className="absolute -top-4 -right-4 bg-secondary-fixed text-on-secondary-fixed p-4 rounded-3xl shadow-xl">
            <span
              className="material-symbols-outlined text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        </div>
      </div>
      {/* Decorative blobs */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -top-12 right-1/4 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl" />
    </section>
  );
}
