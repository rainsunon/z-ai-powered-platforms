import { Hono } from 'hono';
import { z } from 'zod';
import { hashPassword, comparePassword } from '@/lib/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/config/jwt';
import { db } from '@/config/database';
import { users, refreshTokens } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ValidationError, AuthenticationError, ConflictError, NotFoundError } from '@/types/errors';
import { rateLimits } from '@/middleware';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from '@/lib/validators';

// Notification service integration
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3008';

const authRoutes = new Hono();

// Apply stricter rate limiting to auth routes
authRoutes.use('*', rateLimits.auth);

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: validatedData.email,
        password: hashedPassword,
        role: 'user',
        isVerified: false,
        verificationToken: generateVerificationToken(),
        profileData: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          dateOfBirth: validatedData.dateOfBirth,
          phoneNumber: validatedData.phoneNumber,
        },
        securitySettings: {
          twoFactorEnabled: false,
          passwordHistory: [],
          loginAttempts: 0,
        },
        userPreferences: {
          language: 'en',
          timezone: 'UTC',
          theme: 'light',
          notifications: {
            email: true,
            sms: false,
            push: true,
            appointmentReminders: true,
            medicationReminders: true,
            healthAlerts: true,
          },
          privacy: {
            shareHealthData: false,
            shareWithFamily: false,
            allowResearch: false,
          },
        },
      })
      .returning();

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Save refresh token
    await db.insert(refreshTokens).values({
      userId: newUser.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
 
    // Send verification email via notification service
    try {
      const response = await fetch(`${CUSTOMER_SERVICE_URL}/api/notifications/send-otp-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          userId: newUser.id,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send verification email:', await response.text());
      }
    } catch (error) {
      console.error('Error calling notification service:', error);
    }

    return c.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            isVerified: newUser.isVerified,
          },
          accessToken,
          refreshToken,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

/**
 * @route POST /api/auth/login
 * @description Login user
 * @access Public
 */
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = loginSchema.parse(body);

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if account is locked
    const securitySettings = user.securitySettings as any;
    if (securitySettings?.lockedUntil && new Date(securitySettings.lockedUntil) > new Date()) {
      throw new AuthenticationError('Account is temporarily locked. Please try again later.');
    }

    // Verify password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);

    if (!isPasswordValid) {
      // Increment login attempts
      const newAttempts = (securitySettings?.loginAttempts || 0) + 1;
      const updateData: any = {
        securitySettings: {
          ...securitySettings,
          loginAttempts: newAttempts,
        },
      };

      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        updateData.securitySettings.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, user.id));

      throw new AuthenticationError('Invalid email or password');
    }

    // Reset login attempts on successful login
    await db
      .update(users)
      .set({
        securitySettings: {
          ...securitySettings,
          loginAttempts: 0,
          lockedUntil: null,
        },
      })
      .where(eq(users.id, user.id));

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Save refresh token
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return c.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

/**
 * @route POST /api/auth/refresh
 * @description Refresh access token
 * @access Public
 */
authRoutes.post('/refresh', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = refreshTokenSchema.parse(body);

    // Verify refresh token
    const decoded = verifyRefreshToken(validatedData.refreshToken) as any;

    // Check if refresh token exists in database
    const [tokenRecord] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, validatedData.refreshToken),
          eq(refreshTokens.userId, decoded.userId)
        )
      )
      .limit(1);

    if (!tokenRecord) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Check if token is expired
    if (new Date(tokenRecord.expiresAt) < new Date()) {
      await db.delete(refreshTokens).where(eq(refreshTokens.id, tokenRecord.id));
      throw new AuthenticationError('Refresh token expired');
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Delete old refresh token and save new one
    await db.delete(refreshTokens).where(eq(refreshTokens.id, tokenRecord.id));
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return c.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

/**
 * @route POST /api/auth/logout
 * @description Logout user
 * @access Private
 */
authRoutes.post('/logout', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = refreshTokenSchema.parse(body);

    // Delete refresh token
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, validatedData.refreshToken));

    return c.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

/**
 * @route POST /api/auth/verify-email
 * @description Verify email address
 * @access Public
 */
authRoutes.post('/verify-email', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = verifyEmailSchema.parse(body);

    // Find user with verification token
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, validatedData.token))
      .limit(1);

    if (!user) {
      throw new NotFoundError('Invalid verification token');
    }

    // Update user
    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
      })
      .where(eq(users.id, user.id));

    return c.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

/**
 * @route POST /api/auth/forgot-password
 * @description Request password reset
 * @access Public
 */
authRoutes.post('/forgot-password', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (!user) {
      // Don't reveal if user exists
      return c.json({
        success: true,
        message: 'If an account exists with this email, a password reset link will be sent.',
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user
    await db
      .update(users)
      .set({
        resetToken,
        resetTokenExpires,
      })
      .where(eq(users.id, user.id));
 
    // Send password reset email via notification service
    try {
      const response = await fetch(`${CUSTOMER_SERVICE_URL}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user.email,
          subject: 'Password Reset Request',
          html: `<p>Click the following link to reset your password: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}">Reset Password</a></p><p>This link will expire in 1 hour.</p>`,
          text: `Click the following link to reset your password: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}. This link will expire in 1 hour.`,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send password reset email:', await response.text());
      }
    } catch (error) {
      console.error('Error calling notification service:', error);
    }

    return c.json({
      success: true,
      message: 'If an account exists with this email, a password reset link will be sent.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

/**
 * @route POST /api/auth/reset-password
 * @description Reset password
 * @access Public
 */
authRoutes.post('/reset-password', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Find user with reset token
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, validatedData.token))
      .limit(1);

    if (!user) {
      throw new NotFoundError('Invalid reset token');
    }

    // Check if token is expired
    if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
      throw new AuthenticationError('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.newPassword);

    // Update user
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        securitySettings: {
          ...(user.securitySettings as any),
          lastPasswordChange: new Date().toISOString(),
          passwordHistory: [
            ...(user.securitySettings as any)?.passwordHistory || [],
            user.password,
          ].slice(-5), // Keep last 5 passwords
        },
      })
      .where(eq(users.id, user.id));

    return c.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

// Helper functions
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export { authRoutes };
