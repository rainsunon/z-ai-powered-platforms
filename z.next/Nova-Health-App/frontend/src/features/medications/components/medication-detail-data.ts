export const interactions = [
  {
    icon: 'report', iconColor: 'text-tertiary', name: 'Potassium Supplements', severity: 'Moderate' as const,
    description: 'May increase potassium levels. Monitor potassium regularly when taking together.',
    borderClass: 'border-tertiary-container', bgClass: 'bg-tertiary-container/30',
  },
  {
    icon: 'dangerous', iconColor: 'text-error', name: 'NSAIDs (Ibuprofen, Naproxen)', severity: 'High' as const,
    description: 'May reduce the blood-pressure-lowering effect and increase risk of kidney problems.',
    borderClass: 'border-error-container', bgClass: 'bg-error-container/30',
  },
  {
    icon: 'info', iconColor: 'text-on-surface-variant', name: 'Atorvastatin (Current Rx)', severity: 'Safe' as const,
    description: 'No significant interaction. Safe to take together as prescribed.',
    borderClass: 'border-outline-variant/30', bgClass: 'bg-surface-container',
  },
];

export const historyEntries = [
  { date: 'Mar 15, 2024', change: 'Initial prescription', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
  { date: 'Apr 15, 2024', change: '30-day refill', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
  { date: 'May 15, 2024', change: '30-day refill', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
  { date: 'Jun 10, 2024', change: 'Bloodwork check — stable', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
];

export const prescriptionFields = [
  { label: 'Rx Number', value: '#RX-20240315-A' },
  { label: 'Quantity', value: '30 tablets' },
  { label: 'Refills Left', value: '2 remaining', valueClass: 'text-secondary' },
  { label: 'Next Refill', value: 'Nov 15, 2024' },
  { label: 'Expires', value: 'Mar 14, 2025' },
];

export const sideEffectsData = {
  common: ['Dizziness', 'Dry Cough', 'Headache', 'Fatigue'],
  serious: ['Swelling of face/lips', 'Difficulty breathing', 'Chest pain']
};
