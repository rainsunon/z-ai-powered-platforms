import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const items = [
  { icon: 'lock', label: 'Change Password', trailing: 'chevron' as const },
  { icon: 'shield', label: 'Two-Factor Auth', trailing: 'badge' as const, badgeText: 'Active' },
  { icon: 'devices', label: 'Active Sessions', trailing: 'chevron' as const },
];

export function SecurityCard() {
  return (
    <Card className="rounded-[2rem] shadow-sm bg-surface-container-low border-none">
      <CardHeader>
        <CardTitle className="font-headline font-bold text-xl">Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(({ icon, label, trailing, badgeText }) => (
          <Button
            key={label}
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl hover:bg-surface-bright h-auto"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
            {trailing === 'badge' ? (
              <Badge variant="secondary" className="bg-secondary-container text-primary font-bold text-xs">
                {badgeText}
              </Badge>
            ) : (
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
