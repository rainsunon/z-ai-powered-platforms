import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const fields = [
  { label: 'Email Address', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'Timezone', key: 'timezone' },
] as const;

export function PersonalDetailsCard() {
  const { profile } = useProfileStore();

  return (
    <Card className="rounded-[2rem] shadow-sm bg-surface-container-low border-none">
      <CardHeader>
        <CardTitle className="font-headline font-bold text-xl">Personal Details</CardTitle>
        <CardAction>
          <Button variant="link" className="text-primary font-semibold text-sm p-0 h-auto">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">person</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Full Name</p>
            <p className="font-semibold">{profile.fullName}</p>
          </div>
        </div>
        <Separator className="bg-outline-variant/30" />
        {fields.map(({ label, key }) => (
          <div key={key}>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">{label}</p>
            <p className="font-medium">{profile[key]}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
