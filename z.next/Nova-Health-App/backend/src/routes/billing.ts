import { stripe } from '../config/stripe';

/**
 * @route POST /api/billing/payment-intent
 * @description Create a Stripe payment intent
 * @access Private
 */
billingRoutes.post('/payment-intent', async (c) => {
  const { amount, currency = 'usd' } = await c.req.json();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return c.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});
import { Hono } from 'hono';
import { authMiddleware } from '@/middleware/auth';

const billingRoutes = new Hono();

// Apply authentication middleware to all routes
billingRoutes.use('*', authMiddleware);

/**
 * @route GET /api/billing/payment-methods
 * @description Get payment methods
 * @access Private
 */
billingRoutes.get('/payment-methods', async (c) => {
  // TODO: Implement payment methods listing
  return c.json({
    success: true,
    data: [],
    message: 'Payment methods endpoint - to be implemented',
  });
});

/**
 * @route POST /api/billing/payment-methods
 * @description Add payment method
 * @access Private
 */
billingRoutes.post('/payment-methods', async (c) => {
  // TODO: Implement payment method addition
  return c.json({
    success: true,
    message: 'Add payment method endpoint - to be implemented',
  });
});

/**
 * @route DELETE /api/billing/payment-methods/:id
 * @description Remove payment method
 * @access Private
 */
billingRoutes.delete('/payment-methods/:id', async (c) => {
  // TODO: Implement payment method removal
  return c.json({
    success: true,
    message: 'Remove payment method endpoint - to be implemented',
  });
});

/**
 * @route GET /api/billing/invoices
 * @description Get invoices
 * @access Private
 */
billingRoutes.get('/invoices', async (c) => {
  // TODO: Implement invoice listing
  return c.json({
    success: true,
    data: [],
    message: 'Invoices endpoint - to be implemented',
  });
});

/**
 * @route GET /api/billing/subscription
 * @description Get subscription details
 * @access Private
 */
billingRoutes.get('/subscription', async (c) => {
  // TODO: Implement subscription details
  return c.json({
    success: true,
    message: 'Subscription endpoint - to be implemented',
  });
});

export { billingRoutes };
