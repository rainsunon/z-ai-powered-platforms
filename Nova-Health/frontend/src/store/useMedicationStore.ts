import { create } from 'zustand';

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
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  toggleTaken: (id: string) => void;
}

const defaultMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    dosage: '10mg',
    type: 'Tablet',
    frequency: 'morning',
    time: '08:00',
    taken: true,
    refillsLeft: 2,
    nextRefill: 'Apr 15, 2026',
    prescribedBy: 'Dr. Aris Thorne',
    notes: 'Take with water. Monitor blood pressure.',
  },
  {
    id: 'med-2',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    type: 'Capsule',
    frequency: 'morning',
    time: '08:00',
    taken: true,
    refillsLeft: 5,
    nextRefill: 'Jun 01, 2026',
    prescribedBy: 'Dr. Sarah Mitchell',
    notes: 'Take with food for better absorption.',
  },
  {
    id: 'med-3',
    name: 'Atorvastatin',
    dosage: '20mg',
    type: 'Tablet',
    frequency: 'evening',
    time: '20:00',
    taken: false,
    refillsLeft: 0,
    nextRefill: 'Action Required',
    prescribedBy: 'Dr. Aris Thorne',
    notes: 'Cholesterol management. Avoid grapefruit.',
  },
  {
    id: 'med-4',
    name: 'Melatonin',
    dosage: '3mg',
    type: 'Tablet',
    frequency: 'evening',
    time: '21:00',
    taken: false,
    refillsLeft: 8,
    nextRefill: 'Aug 10, 2026',
    prescribedBy: 'Dr. James Winslow',
    notes: 'Take 30 minutes before bedtime.',
  },
];

export const useMedicationStore = create<MedicationState>((set) => ({
  medications: defaultMedications,
  addMedication: (medication) =>
    set((state) => ({
      medications: [
        ...state.medications,
        { ...medication, id: `med-${Date.now()}` },
      ],
    })),
  updateMedication: (id, updates) =>
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  deleteMedication: (id) =>
    set((state) => ({
      medications: state.medications.filter((m) => m.id !== id),
    })),
  toggleTaken: (id) =>
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id ? { ...m, taken: !m.taken } : m
      ),
    })),
}));
