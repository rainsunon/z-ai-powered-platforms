import React from 'react';
import { Button } from '@/components/ui/button';

interface CommunityCTAProps {
  imageUrl: string;
}

export function CommunityCTA({ imageUrl }: CommunityCTAProps) {
  return (
    <section className="max-w-7xl mx-auto mt-24 mb-12">
      <div className="bg-on-surface text-surface p-12 md:p-16 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 tracking-tighter">
            Join the Vitality Community
          </h2>
          <p className="text-surface/70 text-lg leading-relaxed mb-8">
            Can't find what you're looking for? Ask our global community of NovaHealth users and medical experts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-surface text-on-surface px-8 py-4 rounded-full font-bold hover:bg-secondary-fixed"
            >
              Visit Forums
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border border-surface/30 text-surface px-8 py-4 rounded-full font-bold hover:bg-white/10"
            >
              Browse Topics
            </Button>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/3 aspect-square max-w-[300px]">
          <div className="w-full h-full rounded-[3rem] rotate-12 bg-primary-container/20 backdrop-blur-3xl border border-white/10 flex items-center justify-center p-8">
            <img
              src={imageUrl}
              alt="Community"
              className="w-full h-full object-cover rounded-2xl shadow-2xl -rotate-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
