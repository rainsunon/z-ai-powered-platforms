import { create } from 'zustand';
import {
  getCurrentUser,
  updateProfile as updateProfileApi,
  updateSecuritySettings,
  updateUserPreferences,
  getEmergencyContacts,
  addEmergencyContact as addEmergencyContactApi,
  updateEmergencyContact as updateEmergencyContactApi,
  deleteEmergencyContact as deleteEmergencyContactApi,
} from '@/services/user.service';

export interface EmergencyContact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
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
  profile: UserProfile | null;
  emergencyContacts: EmergencyContact[];
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchEmergencyContacts: () => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  updateEmergencyContact: (id: number, data: Partial<EmergencyContact>) => Promise<void>;
  removeEmergencyContact: (id: number) => Promise<void>;
}

const mapApiProfileToUserProfile = (apiData: any): UserProfile => ({
  fullName: `${apiData.profileData.firstName} ${apiData.profileData.lastName}`,
  dateOfBirth: apiData.profileData.dateOfBirth,
  gender: 'Not specified',
  bloodType: 'Not specified',
  height: 'Not specified',
  weight: 'Not specified',
  memberId: `NXH-${apiData.id}`,
  memberSince: new Date(apiData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  email: apiData.email,
  phone: apiData.profileData.phoneNumber || 'Not specified',
  address: 'Not specified',
  timezone: apiData.userPreferences.timezone || 'UTC',
});

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  emergencyContacts: [],
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCurrentUser();
      const profile = mapApiProfileToUserProfile(response.data);
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Map UserProfile fields to API fields
      const nameParts = data.fullName?.split(' ') || [];
      const apiData: any = {};
      
      if (nameParts.length >= 2) {
        apiData.firstName = nameParts[0];
        apiData.lastName = nameParts.slice(1).join(' ');
      }
      
      if (data.dateOfBirth) apiData.dateOfBirth = data.dateOfBirth;
      if (data.phone) apiData.phoneNumber = data.phone;
      
      const response = await updateProfileApi(apiData);
      const profile = mapApiProfileToUserProfile({ ...response.data.profileData });
      
      set((state) => ({ 
        profile: { ...state.profile, ...profile, ...data }, 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchEmergencyContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getEmergencyContacts();
      set({ 
        emergencyContacts: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addEmergencyContact: async (contact) => {
    set({ isLoading: true, error: null });
    try {
      const response = await addEmergencyContactApi(contact);
      set((state) => ({
        emergencyContacts: [...state.emergencyContacts, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateEmergencyContact: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateEmergencyContactApi(id, data);
      set((state) => ({
        emergencyContacts: state.emergencyContacts.map((c) =>
          c.id === id ? response.data : c
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeEmergencyContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteEmergencyContactApi(id);
      set((state) => ({
        emergencyContacts: state.emergencyContacts.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

// Optimized selectors - components only re-render when selected values change
export const useProfile = () => useProfileStore((state) => state.profile);
export const useEmergencyContacts = () => useProfileStore((state) => state.emergencyContacts);

// Memoized action selectors - functions are stable and won't cause re-renders
export const useProfileActions = () => {
  const store = useProfileStore();
  return {
    fetchProfile: store.fetchProfile,
    updateProfile: store.updateProfile,
    fetchEmergencyContacts: store.fetchEmergencyContacts,
    addEmergencyContact: store.addEmergencyContact,
    updateEmergencyContact: store.updateEmergencyContact,
    removeEmergencyContact: store.removeEmergencyContact,
  };
};

// Combined selector for components that need both profile and actions
export const useProfileWithActions = () => {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  return { profile, updateProfile, fetchProfile };
};

// Combined selector for emergency contacts with actions
export const useEmergencyContactsWithActions = () => {
  const emergencyContacts = useProfileStore((state) => state.emergencyContacts);
  const addEmergencyContact = useProfileStore((state) => state.addEmergencyContact);
  const updateEmergencyContact = useProfileStore((state) => state.updateEmergencyContact);
  const removeEmergencyContact = useProfileStore((state) => state.removeEmergencyContact);
  const fetchEmergencyContacts = useProfileStore((state) => state.fetchEmergencyContacts);
  return { emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact, fetchEmergencyContacts };
};
