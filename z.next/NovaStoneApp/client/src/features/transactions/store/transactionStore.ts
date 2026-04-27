import { create } from "zustand";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: number;
  type?: "income" | "expense" | "transfer";
  hasReceipt?: boolean;
  isReconciled?: boolean;
}

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  selectTransaction: (transaction: Transaction | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  error: null,
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => 
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  updateTransaction: (id, updates) => 
    set((state) => ({
      transactions: state.transactions.map((t) => 
        t.id === id ? { ...t, ...updates } : t
      )
    })),
  deleteTransaction: (id) => 
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    })),
  selectTransaction: (transaction) => set({ selectedTransaction: transaction }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));
