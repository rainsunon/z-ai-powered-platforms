import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ForbiddenError } from '@cms/errors';
import { updateUserSchema, paginationSchema, validate } from '@cms/validation';
import { cacheThrough, cacheDel, userCacheKey } from '@cms/cache';

export async function userRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── GET / (list users) ───────────────────
  app.get('/', { preHandler: [authenticate, requirePermissions('users.read')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const params = validate(paginationSchema, request.query) as PaginationParams;
    const db = getDatabase();

    const query = db('tenant_members')
      .join('users', 'tenant_members.user_id', 'users.id')
      .where({ 'tenant_members.tenant_id': user.tenantId })
      .select(
        'users.id', 'users.email', 'users.username', 'users.first_name',
        'users.last_name', 'users.avatar_url', 'users.status', 'users.last_login_at',
        'users.created_at', 'tenant_members.role_id',
      );

    return paginate(query, params);
  });

  // ─── GET /:id ───────────────────
  app.get<{ Params: { id: string } }>('/:id', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params;
    const authUser = (request as AuthenticatedRequest).user;

    return cacheThrough(userCacheKey(id, 'profile'), 300, async () => {
      const db = getDatabase();

      const user = await db('users')
        .where({ 'users.id': id })
        .select('id', 'email', 'username', 'first_name', 'last_name', 'avatar_url', 'bio', 'status', 'created_at')
        .first();

      if (!user) throw new NotFoundError('User', id);

      // Check tenant membership
      const membership = await db('tenant_members')
        .where({ user_id: id, tenant_id: authUser.tenantId })
        .first();

      if (!membership && authUser.userId !== id) {
        throw new ForbiddenError('Cannot view users outside your tenant');
      }

      return { user };
    });
  });

  // ─── PATCH /:id ───────────────────
  app.patch<{ Params: { id: string } }>('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const authUser = (request as AuthenticatedRequest).user;

    if (authUser.userId !== id && !authUser.permissions.includes('users.manage')) {
      throw new ForbiddenError('Cannot update other users');
    }

    const body = validate(updateUserSchema, request.body);
    const db = getDatabase();

    const updateData: Record<string, unknown> = {};
    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.avatar !== undefined) updateData.avatar_url = body.avatar;
    if (body.bio !== undefined) updateData.bio = body.bio;

    const [updated] = await db('users')
      .where({ id })
      .update({ ...updateData, updated_at: new Date() })
      .returning(['id', 'email', 'username', 'first_name', 'last_name', 'avatar_url', 'bio']);

    if (!updated) throw new NotFoundError('User', id);

    await cacheDel(userCacheKey(id, 'profile'));

    return reply.send({ user: updated });
  });

  // ─── DELETE /:id ───────────────────
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('users.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const db = getDatabase();

    await db('users').where({ id }).update({ status: 'deleted', deleted_at: new Date() });
    await cacheDel(userCacheKey(id, 'profile'));

    return reply.status(204).send();
  });
}
