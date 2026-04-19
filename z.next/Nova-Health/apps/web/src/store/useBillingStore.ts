import { create } from 'zustand';
import {
  getInvoices,
  getSubscription,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  createPaymentIntent,
} from '@/services/billing.service';

export interface Invoice {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'overdue' | 'pending' | 'paid';
  icon: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  bankName?: string;
}

export interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
}

interface BillingState {
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  subscription: Subscription | null;
  totalExpenses: number;
  pendingAmount: number;
  insuranceCoverage: number;
  isLoading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (data: any) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  createPaymentIntent: (amount: number) => Promise<{ clientSecret: string }>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  invoices: [],
  paymentMethods: [],
  subscription: null,
  totalExpenses: 0,
  pendingAmount: 0,
  insuranceCoverage: 0,
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getInvoices();
      const invoices = response.data;
      
      // Calculate totals
      const totalExpenses = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const pendingAmount = invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      set({ 
        invoices, 
        totalExpenses, 
        pendingAmount, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getSubscription();
      set({ 
        subscription: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchPaymentMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPaymentMethods();
      set({ 
        paymentMethods: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addPaymentMethod: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await addPaymentMethod(data);
      set((state) => ({
        paymentMethods: [...state.paymentMethods, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removePaymentMethod: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await removePaymentMethod(id);
      set((state) => ({
        paymentMethods: state.paymentMethods.filter(pm => pm.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createPaymentIntent: async (amount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createPaymentIntent({ amount });
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
