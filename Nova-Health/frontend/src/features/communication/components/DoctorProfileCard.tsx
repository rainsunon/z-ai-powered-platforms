import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DoctorProfileCardProps {
  name: string;
  hospital: string;
  avatarSrc: string;
  experience: string;
  rating: string;
}

export function DoctorProfileCard({ name, hospital, avatarSrc, experience, rating }: DoctorProfileCardProps) {
  return (
    <Card className="bg-surface-container-high/40 p-6 rounded-[2rem] border border-white/30 ring-0">
      <CardContent className="p-0 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img alt={name} className="w-24 h-24 rounded-3xl object-cover shadow-xl" src={avatarSrc} />
          <Badge className="absolute -top-2 -right-2 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-1 rounded-full shadow-sm h-auto">
            MD
          </Badge>
        </div>
        <h4 className="font-headline font-extrabold text-on-surface tracking-tight">{name}</h4>
        <p className="text-xs text-stone-500 font-medium mt-1">{hospital}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 w-full">
          <div className="bg-white/60 p-3 rounded-2xl text-center">
            <p className="text-[10px] text-stone-400 font-bold uppercase">Experience</p>
            <p className="text-sm font-bold text-on-surface">{experience}</p>
          </div>
          <div className="bg-white/60 p-3 rounded-2xl text-center">
            <p className="text-[10px] text-stone-400 font-bold uppercase">Rating</p>
            <p className="text-sm font-bold text-on-surface">{rating}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
