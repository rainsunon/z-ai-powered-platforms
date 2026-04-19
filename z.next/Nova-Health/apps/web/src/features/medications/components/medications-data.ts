/**
 * @deprecated This file contains mock data that has been replaced with API service calls.
 * Please use the medication service in src/services/medication.service.ts instead.
 * 
 * This file is kept for reference and will be removed in a future update.
 */

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
