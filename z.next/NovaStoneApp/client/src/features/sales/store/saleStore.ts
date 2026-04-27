import { create } from "zustand";
import type { LineItem } from "@/features/invoices/store/invoiceStore";

export interface Sale {
  id: string;
  customer: string;
  customerId?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  category: string;
  reference: string;
  lineItems?: LineItem[];
  paymentTerms?: string;
}

interface SaleState {
  sales: Sale[];
  selectedSale: Sale | null;
  isLoading: boolean;
  error: string | null;
  setSales: (sales: Sale[]) => void;
  addSale: (sale: Sale) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  selectSale: (sale: Sale | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSaleStore = create<SaleState>()((set) => ({
  sales: [],
  selectedSale: null,
  isLoading: false,
  error: null,
  setSales: (sales) => set({ sales }),
  addSale: (sale) => 
    set((state) => ({ sales: [sale, ...state.sales] })),
  updateSale: (id, updates) => 
    set((state) => ({
      sales: state.sales.map((s) => 
        s.id === id ? { ...s, ...updates } : s
      )
    })),
  deleteSale: (id) => 
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id)
    })),
  selectSale: (sale) => set({ selectedSale: sale }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));
