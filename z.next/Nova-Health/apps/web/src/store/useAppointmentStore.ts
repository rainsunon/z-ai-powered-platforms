import { create } from 'zustand';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment as cancelAppointmentApi,
} from '@/services/appointment.service';

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

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  isLoading: false,
  error: null,

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAppointments();
      set({ appointments: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addAppointment: async (appointment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createAppointment(appointment);
      set((state) => ({
        appointments: [...state.appointments, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAppointment: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateAppointment(id, updates);
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === id ? response.data : a
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteAppointment(id);
      set((state) => ({
        appointments: state.appointments.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  cancelAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cancelAppointmentApi(id);
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === id ? response.data : a
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
