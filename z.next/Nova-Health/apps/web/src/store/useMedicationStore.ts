import { create } from 'zustand';
import {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  toggleMedicationTaken,
} from '@/services/medication.service';

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

interface MedicationState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
  fetchMedications: () => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  toggleTaken: (id: string) => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set) => ({
  medications: [],
  isLoading: false,
  error: null,

  fetchMedications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getMedications();
      set({ medications: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addMedication: async (medication) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createMedication(medication);
      set((state) => ({
        medications: [...state.medications, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateMedication: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateMedication(id, updates);
      set((state) => ({
        medications: state.medications.map((m) =>
          m.id === id ? response.data : m
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteMedication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteMedication(id);
      set((state) => ({
        medications: state.medications.filter((m) => m.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  toggleTaken: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const medication = await getMedications().then((res) =>
        res.data.find((m) => m.id === id)
      );
      
      if (medication) {
        const response = await toggleMedicationTaken(id, !medication.taken);
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? response.data : m
          ),
          isLoading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
