export interface GrowthDataPoint {
  month: string;
  height: number;
  peak?: boolean;
}

export interface EfficiencyItem {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  value: string;
  trend: string;
  trendIcon: string;
}

export const growthData: GrowthDataPoint[] = [
  { month: 'Jan', height: 45 },
  { month: 'Feb', height: 55 },
  { month: 'Mar', height: 50 },
  { month: 'Apr', height: 75 },
  { month: 'May', height: 85 },
  { month: 'Jun', height: 95, peak: true },
];

export const efficiencyItems: EfficiencyItem[] = [
  {
    icon: 'speed',
    iconBg: 'bg-secondary-fixed/30 text-secondary',
    title: 'Provider Response Time',
    subtitle: 'System-wide average efficiency',
    value: '12.4 min',
    trend: '2.1% (Ideal)',
    trendIcon: 'arrow_downward'
  },
  {
    icon: 'task_alt',
    iconBg: 'bg-tertiary-fixed/30 text-tertiary',
    title: 'Record Processing Latency',
    subtitle: 'Automated OCR & validation success',
    value: '99.2%',
    trend: '0.5% growth',
    trendIcon: 'arrow_upward'
  },
];
