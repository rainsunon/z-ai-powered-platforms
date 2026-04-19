export interface Invoice {
  id: string;
  client: string;
  clientInitials: string;
  clientColor: string;
  description: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Sent' | 'Overdue' | 'Draft';
}

export interface Expense {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  status: 'Reconciled' | 'Pending' | 'Categorized' | 'Ready for Review';
  merchantLogo?: string;
  merchantInitials?: string;
  receiptName?: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  client: string;
  project: string;
  description: string;
  timeRange: string;
  duration: string;
  status: 'Billed' | 'Unbilled';
}

export interface Notification {
  id: string;
  sender: string;
  avatar?: string;
  initials?: string;
  color?: string;
  title: string;
  message: string;
  time: string;
  type: 'Billing' | 'Messages' | 'System';
  priority: 'High' | 'Medium' | 'Low';
  read: boolean;
}
