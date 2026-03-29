import type { Medication } from '@/store/useMedicationStore';

export const emptyForm: Omit<Medication, 'id'> = {
  name: '',
  dosage: '',
  type: 'Tablet',
  frequency: 'morning',
  time: '08:00',
  taken: false,
  refillsLeft: 0,
  nextRefill: '',
  prescribedBy: '',
  notes: '',
};
