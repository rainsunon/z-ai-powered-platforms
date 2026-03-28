export interface MemberData {
  name: string;
  role: string;
  avatar: string;
  color: string;
  gradient: string;
  heartRate: number;
  heartRateHistory: number[];
  sleepHours: number;
  sleepMinutes: number;
  deepSleep: string;
  remSleep: string;
  lightSleep: string;
  awake: string;
  steps: number;
  stepGoal: number;
  bloodOxygen: number;
  bp: string;
  temp: number;
  respiratory: number;
  upcomingTasks: {
    title: string;
    date: string;
    icon: string;
    color: string;
  }[];
}

export const memberData: Record<string, MemberData> = {
  sarah: {
    name: 'Sarah Rivera',
    role: 'Account Owner',
    avatar: 'face_4',
    color: 'bg-primary',
    gradient: 'from-primary to-primary/70',
    heartRate: 72,
    heartRateHistory: [68, 72, 75, 70, 72, 69, 74, 71, 73, 72, 70, 72],
    sleepHours: 8,
    sleepMinutes: 24,
    deepSleep: '2h 15m',
    remSleep: '1h 48m',
    lightSleep: '3h 42m',
    awake: '39m',
    steps: 8432,
    stepGoal: 10000,
    bloodOxygen: 98,
    bp: '118/74',
    temp: 98.6,
    respiratory: 14,
    upcomingTasks: [
      { title: 'Annual Check-up', date: 'Nov 15, 2024', icon: 'stethoscope', color: 'bg-primary/10 text-primary' },
      { title: 'Flu Vaccination', date: 'Dec 01, 2024', icon: 'vaccines', color: 'bg-tertiary/10 text-tertiary' },
    ],
  },
  leo: {
    name: 'Leo Rivera',
    role: 'Teen Member',
    avatar: 'face_3',
    color: 'bg-tertiary',
    gradient: 'from-tertiary to-tertiary/70',
    heartRate: 78,
    heartRateHistory: [76, 80, 78, 75, 78, 82, 77, 79, 78, 76, 80, 78],
    sleepHours: 8,
    sleepMinutes: 12,
    deepSleep: '2h 30m',
    remSleep: '1h 55m',
    lightSleep: '3h 20m',
    awake: '27m',
    steps: 12400,
    stepGoal: 12000,
    bloodOxygen: 99,
    bp: '110/70',
    temp: 98.4,
    respiratory: 16,
    upcomingTasks: [
      { title: 'Sports Physical', date: 'Nov 20, 2024', icon: 'sports', color: 'bg-tertiary/10 text-tertiary' },
      { title: 'Dental Cleaning', date: 'Dec 10, 2024', icon: 'dentistry', color: 'bg-secondary/10 text-secondary' },
    ],
  },
  maya: {
    name: 'Maya Rivera',
    role: 'Child Member',
    avatar: 'face_5',
    color: 'bg-secondary',
    gradient: 'from-secondary to-secondary/70',
    heartRate: 88,
    heartRateHistory: [86, 90, 88, 85, 88, 92, 87, 89, 88, 86, 90, 88],
    sleepHours: 9,
    sleepMinutes: 30,
    deepSleep: '3h 05m',
    remSleep: '2h 10m',
    lightSleep: '3h 40m',
    awake: '35m',
    steps: 15600,
    stepGoal: 10000,
    bloodOxygen: 99,
    bp: '98/64',
    temp: 98.2,
    respiratory: 18,
    upcomingTasks: [
      { title: 'Pediatric Visit', date: 'Nov 25, 2024', icon: 'child_care', color: 'bg-secondary/10 text-secondary' },
      { title: 'Vaccination Booster', date: 'Dec 15, 2024', icon: 'vaccines', color: 'bg-primary/10 text-primary' },
    ],
  },
};
