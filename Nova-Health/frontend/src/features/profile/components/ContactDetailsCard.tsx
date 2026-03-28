import React from 'react';
import { useProfile } from '@/store/useProfileStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ContactDetailsCard() {
  const profile = useProfile();

  const fields = React.useMemo(() => [
    { label: 'Email Address', value: profile.email, icon: 'mail' },
    { label: 'Phone Number', value: profile.phone, icon: 'phone' },
    { label: 'Address', value: profile.address, icon: 'location_on' },
  ], [profile.email, profile.phone, profile.address]);

  return (
    <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2rem]">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>contact_mail</span>
          Contact Details
        </CardTitle>
        <Button variant="ghost" className="text-primary text-sm font-bold hover:underline p-0 h-auto">
          <span className="material-symbols-outlined text-[16px] mr-1">edit</span>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container/50">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-lg">{field.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{field.label}</p>
                <p className="font-headline font-bold text-on-surface mt-1">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
