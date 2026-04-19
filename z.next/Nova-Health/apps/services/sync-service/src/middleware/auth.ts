import { Context, Next } from 'hono';
import { verifyAccessToken } from '@/config/jwt';
import { AuthenticationError, AuthorizationError } from '@/types/errors';

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No authorization token provided');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token) as AuthContext;

    // Add user info to context
    c.set('userId', decoded.userId);
    c.set('email', decoded.email);
    c.set('role', decoded.role);

    await next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Invalid or expired token');
  }
}

export function requireRole(...allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const userRole = c.get('role');

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    await next();
  };
}

export function requirePermission(permission: string) {
  return async (c: Context, next: Next) => {
    const userRole = c.get('role');

    // Admin has all permissions
    if (userRole === 'admin' || userRole === 'super_admin') {
      await next();
      return;
    }

    // Check if user has the required permission
    // This would typically be checked against a user's permissions in the database
    // For now, we'll implement a simple role-based check
    const rolePermissions: Record<string, string[]> = {
      user: ['view_own_data', 'edit_own_data'],
      family_member: ['view_own_data', 'edit_own_data', 'view_family_data'],
      doctor: ['view_patient_data', 'edit_patient_data', 'prescribe_medications'],
      nurse: ['view_patient_data', 'update_vitals'],
    };

    const permissions = rolePermissions[userRole] || [];

    if (!permissions.includes(permission)) {
      throw new AuthorizationError(`Permission '${permission}' required`);
    }

    await next();
  };
}
