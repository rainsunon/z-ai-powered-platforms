export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
    id: string;
    name: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    price?: string;
    desc: string;
    features: string[];
    current?: boolean;
    popular?: boolean;
}
