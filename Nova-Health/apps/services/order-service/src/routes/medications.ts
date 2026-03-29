import { Hono } from 'hono';
import { authMiddleware } from '@/middleware/auth';

const medicationRoutes = new Hono();

// Apply authentication middleware to all routes
medicationRoutes.use('*', authMiddleware);

/**
 * @route GET /api/medications
 * @description Get all medications for current user
 * @access Private
 */
medicationRoutes.get('/', async (c) => {
  // TODO: Implement medication listing
  return c.json({
    success: true,
    data: [],
    message: 'Medications endpoint - to be implemented',
  });
});

/**
 * @route POST /api/medications
 * @description Create new medication
 * @access Private
 */
medicationRoutes.post('/', async (c) => {
  // TODO: Implement medication creation
  return c.json({
    success: true,
    message: 'Create medication endpoint - to be implemented',
  });
});

/**
 * @route GET /api/medications/:id
 * @description Get medication by ID
 * @access Private
 */
medicationRoutes.get('/:id', async (c) => {
  // TODO: Implement medication details
  return c.json({
    success: true,
    message: 'Get medication endpoint - to be implemented',
  });
});

/**
 * @route PUT /api/medications/:id
 * @description Update medication
 * @access Private
 */
medicationRoutes.put('/:id', async (c) => {
  // TODO: Implement medication update
  return c.json({
    success: true,
    message: 'Update medication endpoint - to be implemented',
  });
});

/**
 * @route DELETE /api/medications/:id
 * @description Delete medication
 * @access Private
 */
medicationRoutes.delete('/:id', async (c) => {
  // TODO: Implement medication deletion
  return c.json({
    success: true,
    message: 'Delete medication endpoint - to be implemented',
  });
});

export { medicationRoutes };
