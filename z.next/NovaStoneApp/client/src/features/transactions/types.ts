export interface Transaction {
  id: string;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: number;
  isAutoUpdated?: boolean;
  hasReceipt?: boolean;
  isReconciled?: boolean;
  categoryIsUncertain?: boolean;
}
