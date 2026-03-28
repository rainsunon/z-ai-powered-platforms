import React from 'react';

interface StatCardProps {
  icon: string;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  trend?: { direction: 'up' | 'down' | 'flat'; value: string };
  children?: React.ReactNode;
}

export function StatCard({ icon, iconBg, label, value, trend, children }: StatCardProps) {
  const trendColor = trend?.direction === 'up'
    ? 'text-primary bg-primary/10'
    : trend?.direction === 'down'
      ? 'text-error bg-error/10'
      : 'text-outline bg-surface-variant';

  const trendIcon = trend?.direction === 'up'
    ? 'trending_up'
    : trend?.direction === 'down'
      ? 'trending_down'
      : 'trending_flat';

  return (
    <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-bold ${trendColor} px-2 py-1 rounded-full`}>
            <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="font-body text-outline text-sm font-medium mb-1">{label}</h3>
      <div className="flex items-baseline gap-2">{value}</div>
      {children}
    </div>
  );
}
