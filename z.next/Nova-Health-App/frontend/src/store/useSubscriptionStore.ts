import { create } from 'zustand';

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  savingsNote?: string;
}

interface SubscriptionState {
  currentPlanId: string;
  billingCycle: 'monthly' | 'yearly';
  plans: Plan[];
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void;
  selectPlan: (planId: string) => void;
}

const defaultPlans: Plan[] = [
  {
    id: 'daily',
    name: 'Daily',
    price: 2,
    period: '/day',
    features: ['Basic Health Sync', 'Ad-free Experience'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 29,
    period: '/month',
    features: ['AI Health Coach', 'Unlimited Family Members', 'Priority Support'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 290,
    period: '/year',
    features: ['Everything in Monthly', 'Personal Lab Reviews'],
    savingsNote: 'SAVE $58 ANNUALLY',
  },
];

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentPlanId: 'monthly',
  billingCycle: 'monthly',
  plans: defaultPlans,
  setBillingCycle: (cycle) => set({ billingCycle: cycle }),
  selectPlan: (planId) => set({ currentPlanId: planId }),
}));
