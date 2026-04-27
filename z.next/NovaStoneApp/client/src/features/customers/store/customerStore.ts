import { create } from "zustand";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  savedCards: number;
  balance: number;
  overdue: number;
  subtitle?: string;
  address?: Record<string, any>;
  contacts?: Record<string, any>[];
  customFields?: Record<string, any>;
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  selectCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCustomerStore = create<CustomerState>()((set) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) => 
    set((state) => ({ customers: [customer, ...state.customers] })),
  updateCustomer: (id, updates) => 
    set((state) => ({
      customers: state.customers.map((c) => 
        c.id === id ? { ...c, ...updates } : c
      )
    })),
  deleteCustomer: (id) => 
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id)
    })),
  selectCustomer: (customer) => set({ selectedCustomer: customer }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));
