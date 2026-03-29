import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface InsuranceVerifiedCardProps {
  provider?: string;
  description?: string;
}

export function InsuranceVerifiedCard({
  provider = 'Lumina Premium',
  description,
}: InsuranceVerifiedCardProps) {
  return (
    <Card className="bg-surface-container/40 backdrop-blur-xl border-white/20 rounded-[2rem]">
      <CardContent className="p-8 flex items-center gap-6">
        <div className="p-4 bg-white/60 rounded-full text-tertiary">
          <span className="material-symbols-outlined text-3xl">verified_user</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-on-surface">Insurance Verified</h4>
          <p className="text-sm text-on-surface-variant max-w-sm">
            {description ??
              `We've automatically applied your ${provider} coverage to these items. Your maximum out-of-pocket benefits are active.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
