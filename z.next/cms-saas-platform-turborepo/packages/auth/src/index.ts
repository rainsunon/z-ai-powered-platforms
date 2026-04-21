import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '@cms/errors';
import { FastifyRequest, FastifyReply } from 'fastify';

// ─── Types ───────────────────────────────────

export interface TokenPayload {
  userId: string;
  tenantId: string;
  email: string;
  roles: string[];
  permissions: string[];
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: TokenPayload;
}

// ─── Token Operations ───────────────────────────────────

export function signAccessToken(payload: Omit<TokenPayload, 'type'>, secret: string, expiresIn: string): string {
  return jwt.sign({ ...payload, type: 'access' }, secret, { expiresIn, algorithm: 'HS256' });
}

export function signRefreshToken(payload: Omit<TokenPayload, 'type'>, secret: string, expiresIn: string): string {
  return jwt.sign({ ...payload, type: 'refresh' }, secret, { expiresIn, algorithm: 'HS256' });
}

export function verifyToken(token: string, secret: string): TokenPayload {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
}

// ─── Middleware: Authenticate ───────────────────────────

export function createAuthMiddleware(jwtSecret: string) {
  return async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token, jwtSecret);

    if (payload.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }

    (request as AuthenticatedRequest).user = payload;
  };
}

// ─── Middleware: API Key Authentication ───────────────────

export function createApiKeyMiddleware(validateKey: (key: string) => Promise<TokenPayload | null>) {
  return async function authenticateApiKey(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const apiKey = request.headers['x-api-key'] as string;
    if (!apiKey) {
      throw new UnauthorizedError('Missing API key');
    }

    const payload = await validateKey(apiKey);
    if (!payload) {
      throw new UnauthorizedError('Invalid API key');
    }

    (request as AuthenticatedRequest).user = payload;
  };
}

// ─── Middleware: Require Permissions ───────────────────

export function requirePermissions(...requiredPermissions: string[]) {
  return async function checkPermissions(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const user = (request as AuthenticatedRequest).user;
    if (!user) {
      throw new UnauthorizedError('Not authenticated');
    }

    const hasAll = requiredPermissions.every((perm) => user.permissions.includes(perm));
    if (!hasAll) {
      throw new ForbiddenError(`Missing permissions: ${requiredPermissions.join(', ')}`);
    }
  };
}

// ─── Middleware: Require Roles ───────────────────

export function requireRoles(...requiredRoles: string[]) {
  return async function checkRoles(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const user = (request as AuthenticatedRequest).user;
    if (!user) {
      throw new UnauthorizedError('Not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenError(`Required role: ${requiredRoles.join(' or ')}`);
    }
  };
}

// ─── Middleware: Tenant Isolation ───────────────────

export function requireTenant() {
  return async function checkTenant(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const user = (request as AuthenticatedRequest).user;
    const tenantId = (request.params as Record<string, string>).tenantId ?? request.headers['x-tenant-id'];

    if (!user) {
      throw new UnauthorizedError('Not authenticated');
    }

    if (tenantId && user.tenantId !== tenantId) {
      throw new ForbiddenError('Tenant access denied');
    }
  };
}

export { jwt };
