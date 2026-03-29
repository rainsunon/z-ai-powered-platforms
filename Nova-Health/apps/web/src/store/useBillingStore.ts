import { create } from 'zustand';

export interface Invoice {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'overdue' | 'pending' | 'paid';
  icon: string;
}

interface BillingState {
  invoices: Invoice[];
  totalExpenses: number;
  pendingAmount: number;
  insuranceCoverage: number;
  setInvoices: (invoices: Invoice[]) => void;
}

const defaultInvoices: Invoice[] = [
  { id: 'NH-89230', title: 'Dental Cleaning & X-Ray', date: 'Sep 12, 2024', amount: 425.0, status: 'overdue', icon: 'warning' },
  { id: 'NH-89245', title: 'Dermatology Consultation', date: 'Oct 05, 2024', amount: 150.0, status: 'pending', icon: 'hourglass_empty' },
  { id: 'NH-89190', title: 'Monthly Prescription Refill', date: 'Aug 22, 2024', amount: 42.5, status: 'paid', icon: 'check_circle' },
];

export const useBillingStore = create<BillingState>((set) => ({
  invoices: defaultInvoices,
  totalExpenses: 4280.5,
  pendingAmount: 240.0,
  insuranceCoverage: 85,
  setInvoices: (invoices) => set({ invoices }),
}));
