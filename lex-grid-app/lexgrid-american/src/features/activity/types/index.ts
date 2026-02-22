// src/features/activity/types/index.ts

export type ActivityType = 'all' | 'chat' | 'meeting' | 'email' | 'notification' | 'payment';

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: string;
    status?: string;
    statusType?: 'success' | 'warning' | 'info' | 'error';
    meta?: string;
}
