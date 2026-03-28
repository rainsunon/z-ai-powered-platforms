import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SuccessHeader } from './components/SuccessHeader';
import { RewardCard } from './components/RewardCard';
import { ShareSection } from './components/ShareSection';

export function RewardRedeemed() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 max-w-2xl mx-auto w-full pb-20">
      <div className="w-full space-y-8">
        {/* Success Message Header */}
        <SuccessHeader userName="Sarah" />

        {/* Main Visual Card */}
        <RewardCard />

        {/* Sharing Section */}
        <ShareSection />

        {/* Primary Action */}
        <div className="pt-4">
          <Button
            onClick={() => navigate('/family/rewards')}
            className="w-full primary-gradient text-on-primary font-headline font-bold py-5 rounded-[1.5rem] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Rewards
          </Button>
        </div>
      </div>
    </div>
  );
}
