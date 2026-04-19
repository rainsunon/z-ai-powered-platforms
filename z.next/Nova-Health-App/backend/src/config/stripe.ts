import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});import Stripe from 'stripe';
import { Env } from './env';

export const stripe = new Stripe(Env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});