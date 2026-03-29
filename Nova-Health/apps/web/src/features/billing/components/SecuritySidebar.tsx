import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const badges = [
  { icon: 'workspace_premium', label: 'SSL Secure' },
  { icon: 'shield', label: 'Safe Pay' },
  { icon: 'monitoring', label: '24/7 Monitoring' },
];

const features = [
  {
    icon: 'security',
    title: 'SSL Encrypted',
    desc: '256-bit SSL encryption ensures your transaction data is protected.',
  },
  {
    icon: 'admin_panel_settings',
    title: 'PCI-DSS Compliant',
    desc: 'Adhering to global standards for secure credit card handling.',
  },
];

export function SecuritySidebar() {
  return (
    <div className="space-y-8">
      {/* Security Assurance */}
      <Card className="rounded-3xl bg-surface-container border-none">
        <CardHeader className="pb-0">
          <CardTitle className="font-headline font-bold text-primary flex items-center gap-2 text-base">
            <span className="material-symbols-outlined">verified_user</span>
            Security Assurance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div>
                <div className="font-bold text-sm text-on-surface">{title}</div>
                <div className="text-xs text-on-surface-variant leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}

          <Separator className="bg-outline-variant/30" />

          <div className="flex justify-between items-center opacity-60">
            {badges.map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest mt-1">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Note */}
      <Card className="rounded-3xl bg-tertiary-fixed border-none">
        <CardContent className="p-6">
          <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed font-medium">
            <strong>Need help?</strong> Our support team is available 24/7 for payment-related
            inquiries.{' '}
            <a href="#" className="underline font-bold">
              Contact Support
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
