import React from 'react';
import { Button } from '@/components/ui/button';

interface ShareAction {
  icon: string;
  label: string;
}

interface ShareActionsProps {
  title?: string;
  shareActions?: ShareAction[];
}

const defaultShareActions: ShareAction[] = [
  { icon: 'chat', label: 'WhatsApp' },
  { icon: 'camera', label: 'Instagram' },
  { icon: 'link', label: 'Copy Link' }
];

export function ShareActions({
  title = 'Celebrate with world',
  shareActions = defaultShareActions
}: ShareActionsProps) {
  return (
    <div className="space-y-6 pt-8">
      <p className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant/70">
        {title}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {shareActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex items-center gap-3 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-2xl text-on-secondary-container font-semibold"
          >
            <span className="material-symbols-outlined">{action.icon}</span>
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
