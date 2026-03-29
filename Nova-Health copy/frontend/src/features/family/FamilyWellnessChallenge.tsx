
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dailyGoals as initialDailyGoals, leaderboard as initialLeaderboard } from './components/wellness-challenge-data';
import { ChallengeHero } from './components/ChallengeHero';
import { Leaderboard } from './components/Leaderboard';
import { DailyGoals } from './components/DailyGoals';
import { RewardMilestones } from './components/RewardMilestones';
import { ChallengeActions } from './components/ChallengeActions';

export function FamilyWellnessChallenge() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(initialDailyGoals);

  const toggleGoal = (index: number) => {
    setGoals(prev => prev.map((g, i) => i === index ? { ...g, checked: !g.checked } : g));
  };

  const handleResetGoals = () => {
    setGoals(initialDailyGoals);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      <ChallengeHero
        title="Step Up Together: 50,000 Steps"
        description="Unite the household and hit the pavement! Your collective movement fuels the family vitality meter."
        daysRemaining="04 Days"
        globalRank="#12"
        progress={{ current: '34,250', total: '50,000', percentage: 68.5 }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Leaderboard members={initialLeaderboard} />
        </div>
        <div className="lg:col-span-8">
          <DailyGoals goals={goals} onToggleGoal={toggleGoal} onReset={handleResetGoals} />
        </div>
      </div>
      <RewardMilestones progress={72} />
      <ChallengeActions
        onCreateCustom={() => navigate('/family/challenge/create')}
        onBrowseLibrary={() => navigate('/family/challenge/library')}
      />
    </div>
  );
}
