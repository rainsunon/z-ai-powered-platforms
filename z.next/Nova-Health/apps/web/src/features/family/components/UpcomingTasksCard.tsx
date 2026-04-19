import React from 'react';
import { MemberData } from './health-summary-data';

interface UpcomingTasksCardProps {
  member: MemberData;
}

export function UpcomingTasksCard({ member }: UpcomingTasksCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          event
        </span>
        Upcoming Medical Tasks
      </h3>
      <div className="space-y-4">
        {member.upcomingTasks.map((task) => (
          <div key={task.title} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
            <div className={`w-12 h-12 rounded-xl ${task.color} flex items-center justify-center flex-shrink-0`}>
              <span className="material-symbols-outlined">{task.icon}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-on-surface">{task.title}</p>
              <p className="text-sm text-on-surface-variant">{task.date}</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">
              chevron_right
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
