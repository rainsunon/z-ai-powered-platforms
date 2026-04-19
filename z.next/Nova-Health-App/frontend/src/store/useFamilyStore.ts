import { create } from 'zustand';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: string;
  avatar: string;
  color: string;
  gradient: string;
  bloodType: string;
  heartRate: number;
  sleep: number;
  steps: number;
  bp: string;
  wellness: number;
  lastSync: string;
  status: string;
  lastCheckup: string;
  vaccination: string;
}

interface FamilyState {
  members: FamilyMember[];
  addMember: (member: FamilyMember) => void;
  removeMember: (id: string) => void;
}

const defaultMembers: FamilyMember[] = [
  {
    id: 'sarah', name: 'Sarah Rivera', age: 42, role: 'Account Owner', avatar: 'face_4',
    color: 'bg-primary', gradient: 'from-primary to-primary/70', bloodType: 'A+',
    heartRate: 72, sleep: 7.5, steps: 8200, bp: '118/76', wellness: 87,
    lastSync: '2 min ago', status: 'Excellent', lastCheckup: 'Oct 12, 2024', vaccination: 'Up to date',
  },
  {
    id: 'leo', name: 'Leo Rivera', age: 14, role: 'Teen Member', avatar: 'face_3',
    color: 'bg-tertiary', gradient: 'from-tertiary to-tertiary/70', bloodType: 'O+',
    heartRate: 78, sleep: 8.2, steps: 12400, bp: '110/70', wellness: 92,
    lastSync: '5 min ago', status: 'Great', lastCheckup: 'Sep 28, 2024', vaccination: 'Up to date',
  },
  {
    id: 'maya', name: 'Maya Rivera', age: 8, role: 'Child Member', avatar: 'face_5',
    color: 'bg-secondary', gradient: 'from-secondary to-secondary/70', bloodType: 'A+',
    heartRate: 88, sleep: 9.5, steps: 15600, bp: '98/64', wellness: 95,
    lastSync: '1 min ago', status: 'Excellent', lastCheckup: 'Nov 03, 2024', vaccination: 'Due Dec 2024',
  },
];

export const useFamilyStore = create<FamilyState>((set) => ({
  members: defaultMembers,
  addMember: (member) => set((state) => ({ members: [...state.members, member] })),
  removeMember: (id) => set((state) => ({ members: state.members.filter((m) => m.id !== id) })),
}));
