import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AmbientBackground } from './components/AmbientBackground';
import { MilestoneBadge } from './components/MilestoneBadge';
import { MilestoneHeader } from './components/MilestoneHeader';
import { MilestoneStats } from './components/MilestoneStats';
import { ShareActions } from './components/ShareActions';

export function MilestoneAchieved() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 max-w-4xl mx-auto pb-20">
      {/* Ambient Background Elements */}
      <AmbientBackground />

      <div className="w-full space-y-12 text-center">
        {/* Hero Badge Display */}
        <MilestoneBadge />

        {/* Headline & Details */}
        <MilestoneHeader />

        {/* Summary Stats Bento */}
        <MilestoneStats />

        {/* Share Actions Cluster */}
        <ShareActions />

        {/* Primary Action */}
        <div className="pt-8">
          <Button
            onClick={() => navigate('/')}
            className="w-full max-w-sm px-8 py-5 primary-gradient text-white font-headline font-bold text-lg rounded-[2rem] shadow-lg shadow-primary/20 transform hover:scale-[1.02] transition-all active:scale-95"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
