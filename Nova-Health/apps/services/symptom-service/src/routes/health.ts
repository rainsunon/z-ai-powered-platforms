import { Hono } from 'hono';
import { authMiddleware } from '@/middleware/auth';

const healthRoutes = new Hono();

// Apply authentication middleware to all routes
healthRoutes.use('*', authMiddleware);

/**
 * @route GET /api/health/vitals
 * @description Get vital readings
 * @access Private
 */
healthRoutes.get('/vitals', async (c) => {
  // TODO: Implement vital readings listing
  return c.json({
    success: true,
    data: [],
    message: 'Vitals endpoint - to be implemented',
  });
});

/**
 * @route POST /api/health/vitals
 * @description Add vital reading
 * @access Private
 */
healthRoutes.post('/vitals', async (c) => {
  // TODO: Implement vital reading addition
  return c.json({
    success: true,
    message: 'Add vital reading endpoint - to be implemented',
  });
});

/**
 * @route GET /api/health/symptoms
 * @description Get symptoms
 * @access Private
 */
healthRoutes.get('/symptoms', async (c) => {
  // TODO: Implement symptoms listing
  return c.json({
    success: true,
    data: [],
    message: 'Symptoms endpoint - to be implemented',
  });
});

/**
 * @route POST /api/health/symptoms
 * @description Add symptom
 * @access Private
 */
healthRoutes.post('/symptoms', async (c) => {
  // TODO: Implement symptom addition
  return c.json({
    success: true,
    message: 'Add symptom endpoint - to be implemented',
  });
});

/**
 * @route GET /api/health/goals
 * @description Get health goals
 * @access Private
 */
healthRoutes.get('/goals', async (c) => {
  // TODO: Implement health goals listing
  return c.json({
    success: true,
    data: [],
    message: 'Health goals endpoint - to be implemented',
  });
});

/**
 * @route POST /api/health/goals
 * @description Add health goal
 * @access Private
 */
healthRoutes.post('/goals', async (c) => {
  // TODO: Implement health goal addition
  return c.json({
    success: true,
    message: 'Add health goal endpoint - to be implemented',
  });
});

export { healthRoutes };
