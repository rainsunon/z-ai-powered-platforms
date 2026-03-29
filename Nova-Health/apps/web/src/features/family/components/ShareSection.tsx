import React from 'react';
import { Button } from '@/components/ui/button';

interface ShareButton {
  icon: string;
  label: string;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  hoverTextColor: string;
}

interface ShareSectionProps {
  title?: string;
  shareButtons?: ShareButton[];
}

const defaultShareButtons: ShareButton[] = [
  {
    icon: 'chat',
    label: 'WhatsApp',
    bgColor: 'bg-[#25D366]/10',
    hoverBgColor: 'hover:bg-[#25D366]',
    textColor: 'text-[#25D366]',
    hoverTextColor: 'group-hover:text-white'
  },
  {
    icon: 'photo_camera',
    label: 'Instagram',
    bgColor: 'bg-[#E4405F]/10',
    hoverBgColor: 'hover:bg-[#E4405F]',
    textColor: 'text-[#E4405F]',
    hoverTextColor: 'group-hover:text-white'
  },
  {
    icon: 'content_copy',
    label: 'Copy Link',
    bgColor: 'bg-surface-container-highest',
    hoverBgColor: 'hover:bg-primary',
    textColor: 'text-on-surface',
    hoverTextColor: 'group-hover:text-on-primary'
  }
];

export function ShareSection({
  title = 'Share with the World',
  shareButtons = defaultShareButtons
}: ShareSectionProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 space-y-6 text-center">
      <h4 className="text-sm font-headline font-bold text-on-surface-variant uppercase tracking-[0.2em]">
        {title}
      </h4>
      <div className="flex justify-center items-center gap-6">
        {shareButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            className="group flex flex-col items-center gap-2 h-auto p-0"
          >
            <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${button.bgColor} ${button.textColor} ${button.hoverBgColor} ${button.hoverTextColor} transition-all duration-300`}>
              <span className="material-symbols-outlined text-2xl">{button.icon}</span>
            </div>
            <span className="text-xs font-medium text-on-surface-variant">{button.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
