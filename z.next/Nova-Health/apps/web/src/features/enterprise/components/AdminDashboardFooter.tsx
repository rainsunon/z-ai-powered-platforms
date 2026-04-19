import React from 'react';
import { Separator } from '@/components/ui/separator';

interface AdminDashboardFooterProps {
  encryptionStandard?: string;
  sessionInfo?: string;
}

export function AdminDashboardFooter({
  encryptionStandard = 'NovaHealth Encryption Standard v4.2',
  sessionInfo = 'Secure Session: XA-4819-B2 • Connected to Primary Cluster'
}: AdminDashboardFooterProps) {
  return (
    <footer className="pt-8 pb-12 flex flex-col items-center justify-center gap-2 opacity-50">
      <Separator className="mb-4 border-outline-variant/10" />
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{encryptionStandard}</p>
      <p className="text-[10px] text-on-surface-variant">{sessionInfo}</p>
    </footer>
  );
}
