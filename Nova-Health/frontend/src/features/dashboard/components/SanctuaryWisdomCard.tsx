import React from 'react';

export function SanctuaryWisdomCard() {
  return (
    <div className="bg-surface-container-lowest/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-xl overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/30 blur-3xl rounded-full"></div>
      <h3 className="font-headline font-bold text-xl mb-4">Sanctuary Wisdom</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
        "Prioritizing deep breathing for just 5 minutes today can reduce cortisol levels by up to 15%."
      </p>
      <a
        href="#"
        className="inline-flex items-center text-primary font-bold text-sm hover:translate-x-1 transition-transform"
      >
        Explore Guided Breathwork
        <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
      </a>
    </div>
  );
}
