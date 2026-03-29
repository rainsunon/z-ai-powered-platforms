export interface DailyGoal {
  icon: string;
  bg: string;
  color: string;
  title: string;
  subtitle: string;
  checked: boolean;
}

export interface LeaderboardMember {
  name: string;
  steps: string;
  rank: string;
  rankBg: string;
  badge?: string | null;
  badgeStyle?: string;
  badgeFilled?: boolean;
  tag?: string;
  tagBg?: string;
}

export const dailyGoals: DailyGoal[] = [
  { icon: 'water_drop', bg: 'bg-blue-50', color: 'text-blue-500', title: '8 Glasses of Water', subtitle: 'Completed by 3 members', checked: true },
  { icon: 'bedtime', bg: 'bg-purple-50', color: 'text-purple-500', title: '7 Hours of Sleep', subtitle: 'Goal: Everyone rests', checked: false },
  { icon: 'self_improvement', bg: 'bg-orange-50', color: 'text-orange-500', title: 'Mindful Minute', subtitle: 'Pause and breathe', checked: false },
  { icon: 'nutrition', bg: 'bg-green-50', color: 'text-green-500', title: '5 Colors on Plate', subtitle: 'Veggie power only', checked: true },
];

export const leaderboard: LeaderboardMember[] = [
  { name: 'Sarah', steps: '15,400', rank: '1st', rankBg: 'bg-yellow-400', badge: 'workspace_premium', badgeStyle: 'text-primary', badgeFilled: true },
  { name: 'Leo', steps: '10,200', rank: '2nd', rankBg: 'bg-slate-300', badge: null, tag: 'MVP', tagBg: 'bg-secondary-container text-on-secondary-container' },
  { name: 'Maya', steps: '8,650', rank: '3rd', rankBg: 'bg-orange-400', badge: null, tag: 'Hot Streak', tagBg: 'bg-primary-container/20 text-primary' },
];
