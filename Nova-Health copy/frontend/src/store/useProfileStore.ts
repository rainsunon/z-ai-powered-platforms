import { create } from 'zustand';

export interface EmergencyContact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface UserProfile {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  memberId: string;
  memberSince: string;
  email: string;
  phone: string;
  address: string;
  timezone: string;
}

interface ProfileState {
  profile: UserProfile;
  emergencyContacts: EmergencyContact[];
  updateProfile: (data: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: number) => void;
}

const defaultProfile: UserProfile = {
  fullName: 'Elena Vance',
  dateOfBirth: 'March 15, 1992',
  gender: 'Female',
  bloodType: 'O+',
  height: '5\'7"',
  weight: '138 lbs',
  memberId: 'NXH-00482',
  memberSince: 'January 2023',
  email: 'elena.vance@email.com',
  phone: '+1 (555) 234-8821',
  address: '482 Greenfield Lane, Austin, TX 78701',
  timezone: 'Pacific Time (PT)',
};

const defaultContacts: EmergencyContact[] = [
  { id: 1, name: 'Sarah Jane Doe', relationship: 'Spouse', phone: '+1 (555) 987-6543', isPrimary: true },
  { id: 2, name: 'Michael Doe', relationship: 'Parent', phone: '+1 (555) 654-3210', isPrimary: false },
];

export const useProfileStore = create<ProfileState>((set) => ({
  profile: defaultProfile,
  emergencyContacts: defaultContacts,
  updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
  addEmergencyContact: (contact) =>
    set((state) => ({
      emergencyContacts: [
        ...state.emergencyContacts,
        { ...contact, id: Math.max(0, ...state.emergencyContacts.map((c) => c.id)) + 1 },
      ],
    })),
  removeEmergencyContact: (id) =>
    set((state) => ({
      emergencyContacts: state.emergencyContacts.filter((c) => c.id !== id),
    })),
}));

// Optimized selectors - components only re-render when selected values change
export const useProfile = () => useProfileStore((state) => state.profile);
export const useEmergencyContacts = () => useProfileStore((state) => state.emergencyContacts);

// Memoized action selectors - functions are stable and won't cause re-renders
export const useProfileActions = () => {
  const store = useProfileStore();
  return {
    updateProfile: store.updateProfile,
    addEmergencyContact: store.addEmergencyContact,
    removeEmergencyContact: store.removeEmergencyContact,
  };
};

// Combined selector for components that need both profile and actions
export const useProfileWithActions = () => {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  return { profile, updateProfile };
};

// Combined selector for emergency contacts with actions
export const useEmergencyContactsWithActions = () => {
  const emergencyContacts = useProfileStore((state) => state.emergencyContacts);
  const addEmergencyContact = useProfileStore((state) => state.addEmergencyContact);
  const removeEmergencyContact = useProfileStore((state) => state.removeEmergencyContact);
  return { emergencyContacts, addEmergencyContact, removeEmergencyContact };
};
