import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '@/config/database';
import { users, emergencyContacts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ValidationError, NotFoundError, BadRequestError } from '@/types/errors';
import { authMiddleware, requirePermission } from '@/middleware/auth';
import { validateBody, getValidatedBody } from '@/middleware/validation';
import {
  updateUserProfileSchema,
  updateSecuritySettingsSchema,
  updateUserPreferencesSchema,
  emergencyContactSchema,
  paginationSchema,
} from '@/lib/validators';

const userRoutes = new Hono();

// Apply authentication middleware to all routes
userRoutes.use('*', authMiddleware);

/**
 * @route GET /api/users/me
 * @description Get current user profile
 * @access Private
 */
userRoutes.get('/me', async (c) => {
  const userId = c.get('userId');

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return c.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profileData: user.profileData,
      securitySettings: user.securitySettings,
      userPreferences: user.userPreferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

/**
 * @route PUT /api/users/me/profile
 * @description Update user profile
 * @access Private
 */
userRoutes.put('/me/profile', validateBody(updateUserProfileSchema), async (c) => {
  const userId = c.get('userId');
  const validatedData = getValidatedBody(c);

  const [updatedUser] = await db
    .update(users)
    .set({
      profileData: validatedData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return c.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      profileData: updatedUser.profileData,
    },
  });
});

/**
 * @route PUT /api/users/me/security
 * @description Update security settings
 * @access Private
 */
userRoutes.put('/me/security', validateBody(updateSecuritySettingsSchema), async (c) => {
  const userId = c.get('userId');
  const validatedData = getValidatedBody(c);

  const [updatedUser] = await db
    .update(users)
    .set({
      securitySettings: validatedData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return c.json({
    success: true,
    message: 'Security settings updated successfully',
    data: {
      securitySettings: updatedUser.securitySettings,
    },
  });
});

/**
 * @route PUT /api/users/me/preferences
 * @description Update user preferences
 * @access Private
 */
userRoutes.put('/me/preferences', validateBody(updateUserPreferencesSchema), async (c) => {
  const userId = c.get('userId');
  const validatedData = getValidatedBody(c);

  const [updatedUser] = await db
    .update(users)
    .set({
      userPreferences: validatedData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return c.json({
    success: true,
    message: 'Preferences updated successfully',
    data: {
      userPreferences: updatedUser.userPreferences,
    },
  });
});

/**
 * @route GET /api/users/me/emergency-contacts
 * @description Get emergency contacts
 * @access Private
 */
userRoutes.get('/me/emergency-contacts', async (c) => {
  const userId = c.get('userId');

  const contacts = await db
    .select()
    .from(emergencyContacts)
    .where(eq(emergencyContacts.userId, userId))
    .orderBy(emergencyContacts.isPrimary ? 'desc' : null);

  return c.json({
    success: true,
    data: contacts,
  });
});

/**
 * @route POST /api/users/me/emergency-contacts
 * @description Add emergency contact
 * @access Private
 */
userRoutes.post('/me/emergency-contacts', validateBody(emergencyContactSchema), async (c) => {
  const userId = c.get('userId');
  const validatedData = getValidatedBody(c);

  // If this is the primary contact, remove primary status from others
  if (validatedData.isPrimary) {
    await db
      .update(emergencyContacts)
      .set({ isPrimary: false })
      .where(eq(emergencyContacts.userId, userId));
  }

  const [newContact] = await db
    .insert(emergencyContacts)
    .values({
      userId,
      ...validatedData,
    })
    .returning();

  return c.json({
    success: true,
    message: 'Emergency contact added successfully',
    data: newContact,
  });
});

/**
 * @route PUT /api/users/me/emergency-contacts/:id
 * @description Update emergency contact
 * @access Private
 */
userRoutes.put('/me/emergency-contacts/:id', validateBody(emergencyContactSchema.partial()), async (c) => {
  const userId = c.get('userId');
  const contactId = parseInt(c.req.param('id'));
  const validatedData = getValidatedBody(c);

  // Check if contact belongs to user
  const [existingContact] = await db
    .select()
    .from(emergencyContacts)
    .where(
      and(
        eq(emergencyContacts.id, contactId),
        eq(emergencyContacts.userId, userId)
      )
    )
    .limit(1);

  if (!existingContact) {
    throw new NotFoundError('Emergency contact not found');
  }

  // If this is the primary contact, remove primary status from others
  if (validatedData.isPrimary) {
    await db
      .update(emergencyContacts)
      .set({ isPrimary: false })
      .where(eq(emergencyContacts.userId, userId));
  }

  const [updatedContact] = await db
    .update(emergencyContacts)
    .set({
      ...validatedData,
      updatedAt: new Date(),
    })
    .where(eq(emergencyContacts.id, contactId))
    .returning();

  return c.json({
    success: true,
    message: 'Emergency contact updated successfully',
    data: updatedContact,
  });
});

/**
 * @route DELETE /api/users/me/emergency-contacts/:id
 * @description Delete emergency contact
 * @access Private
 */
userRoutes.delete('/me/emergency-contacts/:id', async (c) => {
  const userId = c.get('userId');
  const contactId = parseInt(c.req.param('id'));

  // Check if contact belongs to user
  const [existingContact] = await db
    .select()
    .from(emergencyContacts)
    .where(
      and(
        eq(emergencyContacts.id, contactId),
        eq(emergencyContacts.userId, userId)
      )
    )
    .limit(1);

  if (!existingContact) {
    throw new NotFoundError('Emergency contact not found');
  }

  await db.delete(emergencyContacts).where(eq(emergencyContacts.id, contactId));

  return c.json({
    success: true,
    message: 'Emergency contact deleted successfully',
  });
});

/**
 * @route GET /api/users/:id
 * @description Get user by ID (admin or family member access)
 * @access Private
 */
userRoutes.get('/:id', requirePermission('view_user_data'), async (c) => {
  const targetUserId = parseInt(c.req.param('id'));
  const currentUserId = c.get('userId');
  const currentUserRole = c.get('role');

  // Admins can view any user
  // Family members can view family members' data
  // Users can only view their own data
  if (targetUserId !== currentUserId && currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
    throw new BadRequestError('You do not have permission to view this user');
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, targetUserId))
    .limit(1);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return c.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profileData: user.profileData,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

/**
 * @route DELETE /api/users/me
 * @description Delete user account
 * @access Private
 */
userRoutes.delete('/me', async (c) => {
  const userId = c.get('userId');

  // TODO: Add confirmation logic
  // TODO: Delete all user data or mark as deleted

  await db.delete(users).where(eq(users.id, userId));

  return c.json({
    success: true,
    message: 'Account deleted successfully',
  });
});

export { userRoutes };
