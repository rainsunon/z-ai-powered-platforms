import { create } from 'zustand';

export type NotificationType = 'critical' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  actions?: { label: string; variant: 'primary' | 'secondary' }[];
}

interface NotificationState {
  notifications: Notification[];
  filter: 'all' | 'critical' | 'warning' | 'info';
  setFilter: (filter: NotificationState['filter']) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
}

const defaultNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'critical',
    title: 'Critical Vital Alert: Heart Rate',
    message:
      'Your resting heart rate has exceeded 110 bpm for the last 15 minutes. Please find a quiet place to sit and initiate a breathing exercise or contact your physician.',
    time: '2 mins ago',
    read: false,
    icon: 'warning',
    actions: [
      { label: 'Call Doctor', variant: 'primary' },
      { label: 'View Vitals', variant: 'secondary' },
    ],
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Medication Reminder',
    message:
      "You have a pending dose of Lysinopril (10mg) scheduled for 09:00 AM. Tap to confirm if you've taken it.",
    time: '45 mins ago',
    read: false,
    icon: 'error',
    actions: [{ label: 'Mark as Taken', variant: 'primary' }],
  },
  {
    id: 'n3',
    type: 'info',
    title: 'Lab Results Ready',
    message:
      'Your recent Blood Panel results from Nova Sanatorium have been uploaded to your health records.',
    time: '3 hours ago',
    read: true,
    icon: 'info',
    actions: [{ label: 'View Results', variant: 'secondary' }],
  },
  {
    id: 'n4',
    type: 'info',
    title: 'Upcoming Consultation',
    message:
      'Gentle reminder: Your tele-consultation with Dr. Aris Thorne is scheduled for tomorrow at 10:30 AM.',
    time: 'Yesterday',
    read: true,
    icon: 'calendar_today',
  },
  {
    id: 'n5',
    type: 'critical',
    title: 'Security Alert',
    message:
      "A new login was detected from an unrecognized device in Paris, France. If this wasn't you, please secure your account immediately.",
    time: '2 days ago',
    read: false,
    icon: 'lock_person',
    actions: [{ label: 'Secure Account', variant: 'primary' }],
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: defaultNotifications,
  filter: 'all',
  setFilter: (filter) => set({ filter }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
