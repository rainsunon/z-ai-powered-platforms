import React from 'react';
import { Separator } from '@/components/ui/separator';

interface DashboardFooterProps {
  copyrightText?: string;
  links?: Array<{
    label: string;
    onClick?: () => void;
  }>;
}

export function DashboardFooter({
  copyrightText = '© 2024 NovaHealth Systems. All sensitive health data is encrypted.',
  links = [
    { label: 'Privacy Policy' },
    { label: 'HIPAA Compliance' },
    { label: 'System Status' }
  ]
}: DashboardFooterProps) {
  return (
    <footer className="mt-auto pt-8">
      <Separator className="mb-6 border-outline-variant/10" />
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant/60 font-medium">
        <p>{copyrightText}</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          {links.map((link, index) => (
            <span
              key={index}
              className="hover:text-primary transition-colors cursor-pointer"
              onClick={link.onClick}
            >
              {link.label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
