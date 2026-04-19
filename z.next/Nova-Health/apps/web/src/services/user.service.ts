import { api } from '@/lib/api';

// Types
export interface UserProfile {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
  profileData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    passwordHistory: string[];
    loginAttempts: number;
    lastPasswordChange?: string;
    lockedUntil?: string;
  };
  userPreferences: {
    language: string;
    timezone: string;
    theme: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      appointmentReminders: boolean;
      medicationReminders: boolean;
      healthAlerts: boolean;
    };
    privacy: {
      shareHealthData: boolean;
      shareWithFamily: boolean;
      allowResearch: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

export interface UpdateSecuritySettingsData {
  twoFactorEnabled?: boolean;
}

export interface UpdateUserPreferencesData {
  language?: string;
  timezone?: string;
  theme?: string;
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    appointmentReminders?: boolean;
    medicationReminders?: boolean;
    healthAlerts?: boolean;
  };
  privacy?: {
    shareHealthData?: boolean;
    shareWithFamily?: boolean;
    allowResearch?: boolean;
  };
}

export interface EmergencyContact {
  id: number;
  userId: number;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyContactData {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface UpdateEmergencyContactData {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<{ success: boolean; data: UserProfile }> {
  return api('/users/me');
}

/**
 * Update user profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<{ success: boolean; message: string; data: { profileData: any } }> {
  return api('/users/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Update security settings
 */
export async function updateSecuritySettings(data: UpdateSecuritySettingsData): Promise<{ success: boolean; message: string; data: { securitySettings: any } }> {
  return api('/users/me/security', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(data: UpdateUserPreferencesData): Promise<{ success: boolean; message: string; data: { userPreferences: any } }> {
  return api('/users/me/preferences', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Get emergency contacts
 */
export async function getEmergencyContacts(): Promise<{ success: boolean; data: EmergencyContact[] }> {
  return api('/users/me/emergency-contacts');
}

/**
 * Add emergency contact
 */
export async function addEmergencyContact(data: CreateEmergencyContactData): Promise<{ success: boolean; message: string; data: EmergencyContact }> {
  return api('/users/me/emergency-contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update emergency contact
 */
export async function updateEmergencyContact(id: number, data: UpdateEmergencyContactData): Promise<{ success: boolean; message: string; data: EmergencyContact }> {
  return api(`/users/me/emergency-contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete emergency contact
 */
export async function deleteEmergencyContact(id: number): Promise<{ success: boolean; message: string }> {
  return api(`/users/me/emergency-contacts/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Delete user account
 */
export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  return api('/users/me', {
    method: 'DELETE',
  });
}
