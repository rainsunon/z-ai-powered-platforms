import { Hono } from 'hono';
import { authMiddleware } from '@/middleware/auth';

const supportRoutes = new Hono();

// Apply authentication middleware to all routes
supportRoutes.use('*', authMiddleware);

/**
 * @route GET /api/support/tickets
 * @description Get support tickets
 * @access Private
 */
supportRoutes.get('/tickets', async (c) => {
  // TODO: Implement support tickets listing
  return c.json({
    success: true,
    data: [],
    message: 'Support tickets endpoint - to be implemented',
  });
});

/**
 * @route POST /api/support/tickets
 * @description Create support ticket
 * @access Private
 */
supportRoutes.post('/tickets', async (c) => {
  // TODO: Implement support ticket creation
  return c.json({
    success: true,
    message: 'Create support ticket endpoint - to be implemented',
  });
});

/**
 * @route GET /api/support/tickets/:id
 * @description Get support ticket details
 * @access Private
 */
supportRoutes.get('/tickets/:id', async (c) => {
  // TODO: Implement support ticket details
  return c.json({
    success: true,
    message: 'Get support ticket endpoint - to be implemented',
  });
});

/**
 * @route POST /api/support/tickets/:id/messages
 * @description Add message to support ticket
 * @access Private
 */
supportRoutes.post('/tickets/:id/messages', async (c) => {
  // TODO: Implement message addition to support ticket
  return c.json({
    success: true,
    message: 'Add message to support ticket endpoint - to be implemented',
  });
});

export { supportRoutes };
