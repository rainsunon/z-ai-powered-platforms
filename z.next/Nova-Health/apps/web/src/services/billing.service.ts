import { api } from '@/lib/api';

// Types
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

export interface Invoice {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'overdue' | 'pending' | 'paid';
  icon: string;
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

export interface PaymentIntentData {
  amount: number;
  currency?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

/**
 * Get payment methods
 */
export async function getPaymentMethods(): Promise<{ success: boolean; data: PaymentMethod[] }> {
  return api('/billing/payment-methods');
}

/**
 * Add payment method
 */
export async function addPaymentMethod(data: any): Promise<{ success: boolean; message: string; data: PaymentMethod }> {
  return api('/billing/payment-methods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Remove payment method
 */
export async function removePaymentMethod(id: string): Promise<{ success: boolean; message: string }> {
  return api(`/billing/payment-methods/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Get invoices
 */
export async function getInvoices(): Promise<{ success: boolean; data: Invoice[] }> {
  return api('/billing/invoices');
}

/**
 * Get subscription details
 */
export async function getSubscription(): Promise<{ success: boolean; data: Subscription }> {
  return api('/billing/subscription');
}

/**
 * Create payment intent
 */
export async function createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResponse> {
  return api('/billing/payment-intent', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
