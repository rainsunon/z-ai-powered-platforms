import { api } from '@/lib/api';

// Types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  type: 'Tablet' | 'Capsule' | 'Liquid' | 'Injection' | 'Topical';
  frequency: 'morning' | 'evening' | 'both' | 'as-needed';
  time: string;
  taken: boolean;
  refillsLeft: number;
  nextRefill: string;
  prescribedBy: string;
  notes: string;
}

export interface CreateMedicationData {
  name: string;
  dosage: string;
  type: 'Tablet' | 'Capsule' | 'Liquid' | 'Injection' | 'Topical';
  frequency: 'morning' | 'evening' | 'both' | 'as-needed';
  time: string;
  taken: boolean;
  refillsLeft: number;
  nextRefill: string;
  prescribedBy: string;
  notes: string;
}

export interface UpdateMedicationData {
  name?: string;
  dosage?: string;
  type?: 'Tablet' | 'Capsule' | 'Liquid' | 'Injection' | 'Topical';
  frequency?: 'morning' | 'evening' | 'both' | 'as-needed';
  time?: string;
  taken?: boolean;
  refillsLeft?: number;
  nextRefill?: string;
  prescribedBy?: string;
  notes?: string;
}

/**
 * Get all medications for current user
 */
export async function getMedications(): Promise<{ success: boolean; data: Medication[] }> {
  return api('/medications');
}

/**
 * Create new medication
 */
export async function createMedication(data: CreateMedicationData): Promise<{ success: boolean; message: string; data: Medication }> {
  return api('/medications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get medication by ID
 */
export async function getMedication(id: string): Promise<{ success: boolean; data: Medication }> {
  return api(`/medications/${id}`);
}

/**
 * Update medication
 */
export async function updateMedication(id: string, data: UpdateMedicationData): Promise<{ success: boolean; message: string; data: Medication }> {
  return api(`/medications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete medication
 */
export async function deleteMedication(id: string): Promise<{ success: boolean; message: string }> {
  return api(`/medications/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Toggle medication taken status (convenience method)
 */
export async function toggleMedicationTaken(id: string, taken: boolean): Promise<{ success: boolean; message: string; data: Medication }> {
  return updateMedication(id, { taken });
}
