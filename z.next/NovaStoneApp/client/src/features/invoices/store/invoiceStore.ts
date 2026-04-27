import { create } from "zustand";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface Invoice {
  id: string;
  status: "Paid" | "Unpaid" | "Draft" | "Overdue";
  date: string;
  number: string;
  customer: string;
  customerId?: string;
  total: number;
  amountDue: number;
  lineItems?: LineItem[];
  notes?: string;
}

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  selectInvoice: (invoice: Invoice | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInvoiceStore = create<InvoiceState>()((set) => ({
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,
  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) => 
    set((state) => ({ invoices: [invoice, ...state.invoices] })),
  updateInvoice: (id, updates) => 
    set((state) => ({
      invoices: state.invoices.map((i) => 
        i.id === id ? { ...i, ...updates } : i
      )
    })),
  deleteInvoice: (id) => 
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id)
    })),
  selectInvoice: (invoice) => set({ selectedInvoice: invoice }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));
