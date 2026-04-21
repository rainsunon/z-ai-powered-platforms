import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction } from '@cms/database';
import { hashPassword, verifyPassword, generateSecureToken, sha256 } from '@cms/security';
import { signAccessToken, signRefreshToken, verifyToken, createAuthMiddleware, AuthenticatedRequest } from '@cms/auth';
import { UnauthorizedError, ValidationError, ConflictError, NotFoundError } from '@cms/errors';
import { loginSchema, createUserSchema, refreshTokenSchema, validate } from '@cms/validation';
import { createEvent, EventType, getEventBus } from '@cms/messaging';
import { createServiceLogger } from '@cms/logger';
import { generateId, nowISO } from '@cms/utils';

const logger = createServiceLogger('auth-routes');

export async function authRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST /register ───────────────────────────
  app.post('/register', async (request, reply) => {
    const body = validate(createUserSchema, request.body);
    const db = getDatabase();

    const existing = await db('users').where({ email: body.email }).first();
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await hashPassword(body.password);
    const userId = generateId();

    const user = await withTransaction(async (trx) => {
      const [newUser] = await trx('users')
        .insert({
          id: userId,
          email: body.email,
          username: body.username,
          password_hash: passwordHash,
          first_name: body.firstName,
          last_name: body.lastName,
          status: 'active',
        })
        .returning(['id', 'email', 'username', 'first_name', 'last_name', 'status', 'created_at']);

      // Record login attempt
      await trx('login_attempts').insert({
        email: body.email,
        ip_address: request.ip,
        success: true,
        user_agent: request.headers['user-agent'],
      });

      return newUser;
    });

    // Emit event
    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.USER_REGISTERED, '', { userId, email: body.email }, { source: 'auth-service' }),
    );

    logger.info({ userId }, 'User registered');

    return reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  });

  // ─── POST /login ───────────────────────────
  app.post('/login', async (request, reply) => {
    const body = validate(loginSchema, request.body);
    const db = getDatabase();

    // Check rate limiting: max 5 failed attempts in 15 minutes
    const recentFailures = await db('login_attempts')
      .where({ email: body.email, success: false })
      .where('created_at', '>', new Date(Date.now() - 15 * 60 * 1000))
      .count('* as count')
      .first();

    if (Number(recentFailures?.count) >= 5) {
      throw new UnauthorizedError('Too many failed login attempts. Try again later.');
    }

    const user = await db('users')
      .where({ email: body.email, status: 'active' })
      .first();

    if (!user) {
      await db('login_attempts').insert({
        email: body.email,
        ip_address: request.ip,
        success: false,
        user_agent: request.headers['user-agent'],
        failure_reason: 'User not found',
      });
      throw new UnauthorizedError('Invalid email or password');
    }

    const validPassword = await verifyPassword(user.password_hash, body.password);
    if (!validPassword) {
      await db('login_attempts').insert({
        email: body.email,
        ip_address: request.ip,
        success: false,
        user_agent: request.headers['user-agent'],
        failure_reason: 'Invalid password',
      });
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check 2FA
    if (body.twoFactorCode) {
      const twoFactor = await db('two_factor_secrets')
        .where({ user_id: user.id, enabled: true })
        .first();

      if (twoFactor) {
        // In production: verify TOTP code
        // For now, placeholder
        logger.info({ userId: user.id }, '2FA verification');
      }
    }

    // Get user roles and permissions
    const memberships = await db('tenant_members')
      .join('tenant_roles', 'tenant_members.role_id', 'tenant_roles.id')
      .where({ 'tenant_members.user_id': user.id, 'tenant_members.status': 'active' })
      .select('tenant_members.tenant_id', 'tenant_roles.slug as role_slug');

    const tenantId = memberships[0]?.tenant_id ?? '';
    const roles = memberships.map((m) => m.role_slug);

    // Get permissions for roles
    const roleRecords = await db('roles').whereIn('slug', roles.length > 0 ? roles : ['viewer']);
    const roleIds = roleRecords.map((r) => r.id);
    const perms = await db('role_permissions')
      .join('permissions', 'role_permissions.permission_id', 'permissions.id')
      .whereIn('role_permissions.role_id', roleIds)
      .select('permissions.slug');

    const permissions = [...new Set(perms.map((p) => p.slug))];

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      tenantId,
      email: user.email,
      roles: roles.length > 0 ? roles : ['viewer'],
      permissions,
    };

    const accessToken = signAccessToken(tokenPayload, config.jwt.secret, config.jwt.expiresIn);
    const refreshToken = signRefreshToken(tokenPayload, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);

    // Store session
    const refreshTokenHash = sha256(refreshToken);
    await db('sessions').insert({
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      ip_address: request.ip,
      user_agent: request.headers['user-agent'],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Record successful login
    await db('login_attempts').insert({
      email: body.email,
      ip_address: request.ip,
      success: true,
      user_agent: request.headers['user-agent'],
    });

    await db('users').where({ id: user.id }).update({ last_login_at: nowISO() });

    // Emit event
    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.USER_LOGIN, tenantId, { userId: user.id }, { userId: user.id, source: 'auth-service' }),
    );

    return reply.send({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        roles,
        permissions,
      },
    });
  });

  // ─── POST /refresh ───────────────────────────
  app.post('/refresh', async (request, reply) => {
    const body = validate(refreshTokenSchema, request.body);
    const db = getDatabase();

    const payload = verifyToken(body.refreshToken, config.jwt.refreshSecret);
    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }

    const tokenHash = sha256(body.refreshToken);
    const session = await db('sessions')
      .where({ refresh_token_hash: tokenHash, revoked: false })
      .where('expires_at', '>', new Date())
      .first();

    if (!session) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate refresh token
    await db('sessions').where({ id: session.id }).update({ revoked: true });

    const newTokenPayload = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };

    const accessToken = signAccessToken(newTokenPayload, config.jwt.secret, config.jwt.expiresIn);
    const newRefreshToken = signRefreshToken(newTokenPayload, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);

    await db('sessions').insert({
      user_id: payload.userId,
      refresh_token_hash: sha256(newRefreshToken),
      ip_address: request.ip,
      user_agent: request.headers['user-agent'],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return reply.send({ accessToken, refreshToken: newRefreshToken });
  });

  // ─── POST /logout ───────────────────────────
  app.post('/logout', { preHandler: [authenticate] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    // Revoke all sessions for this user
    await db('sessions').where({ user_id: user.userId }).update({ revoked: true });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.USER_LOGOUT, user.tenantId, { userId: user.userId }, { userId: user.userId, source: 'auth-service' }),
    );

    return reply.send({ message: 'Logged out successfully' });
  });

  // ─── POST /forgot-password ───────────────────
  app.post('/forgot-password', async (request, reply) => {
    const { email } = request.body as { email: string };
    const db = getDatabase();

    const user = await db('users').where({ email, status: 'active' }).first();
    if (user) {
      const token = generateSecureToken(32);
      const tokenHash = sha256(token);

      await db('password_resets').insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      const eventBus = getEventBus();
      await eventBus.publish(
        createEvent(EventType.PASSWORD_RESET_REQUESTED, '', { userId: user.id, tokenHash }, { source: 'auth-service' }),
      );
    }

    // Always return success (prevent email enumeration)
    return reply.send({ message: 'If the email exists, a reset link has been sent' });
  });

  // ─── POST /reset-password ───────────────────
  app.post('/reset-password', async (request, reply) => {
    const { token, newPassword } = request.body as { token: string; newPassword: string };
    const db = getDatabase();

    const tokenHash = sha256(token);
    const reset = await db('password_resets')
      .where({ token_hash: tokenHash, used: false })
      .where('expires_at', '>', new Date())
      .first();

    if (!reset) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const passwordHash = await hashPassword(newPassword);

    await withTransaction(async (trx) => {
      await trx('users').where({ id: reset.user_id }).update({ password_hash: passwordHash });
      await trx('password_resets').where({ id: reset.id }).update({ used: true });
      // Revoke all sessions
      await trx('sessions').where({ user_id: reset.user_id }).update({ revoked: true });
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.PASSWORD_CHANGED, '', { userId: reset.user_id }, { source: 'auth-service' }),
    );

    return reply.send({ message: 'Password reset successfully' });
  });

  // ─── GET /me ───────────────────────────
  app.get('/me', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const profile = await db('users')
      .where({ id: user.userId })
      .select('id', 'email', 'username', 'first_name', 'last_name', 'avatar_url', 'bio', 'status', 'created_at')
      .first();

    if (!profile) {
      throw new NotFoundError('User', user.userId);
    }

    return {
      user: {
        ...profile,
        roles: user.roles,
        permissions: user.permissions,
        tenantId: user.tenantId,
      },
    };
  });
}
