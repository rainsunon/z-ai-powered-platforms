import { api } from '@/lib/api';

// Types
export interface Appointment {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // e.g. '14:30'
  duration: number; // minutes
  location: string;
  type: 'in-person' | 'telehealth' | 'lab';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes: string;
  icon: string;
}

export interface CreateAppointmentData {
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: 'in-person' | 'telehealth' | 'lab';
  notes: string;
  icon: string;
}

export interface UpdateAppointmentData {
  title?: string;
  doctor?: string;
  specialty?: string;
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  type?: 'in-person' | 'telehealth' | 'lab';
  status?: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  icon?: string;
}

/**
 * Get all appointments for current user
 */
export async function getAppointments(): Promise<{ success: boolean; data: Appointment[] }> {
  return api('/appointments');
}

/**
 * Create new appointment
 */
export async function createAppointment(data: CreateAppointmentData): Promise<{ success: boolean; message: string; data: Appointment }> {
  return api('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get appointment by ID
 */
export async function getAppointment(id: string): Promise<{ success: boolean; data: Appointment }> {
  return api(`/appointments/${id}`);
}

/**
 * Update appointment
 */
export async function updateAppointment(id: string, data: UpdateAppointmentData): Promise<{ success: boolean; message: string; data: Appointment }> {
  return api(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete appointment
 */
export async function deleteAppointment(id: string): Promise<{ success: boolean; message: string }> {
  return api(`/appointments/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Cancel appointment (convenience method that updates status to cancelled)
 */
export async function cancelAppointment(id: string): Promise<{ success: boolean; message: string; data: Appointment }> {
  return updateAppointment(id, { status: 'cancelled' });
}
