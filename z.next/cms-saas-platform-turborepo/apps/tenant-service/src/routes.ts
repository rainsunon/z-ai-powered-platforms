import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ConflictError } from '@cms/errors';
import { createTenantSchema, updateTenantSchema, paginationSchema, validate } from '@cms/validation';
import { createEvent, EventType, getEventBus } from '@cms/messaging';
import { cacheThrough, cacheDel, tenantCacheKey } from '@cms/cache';
import { generateId, addDays } from '@cms/utils';

export async function tenantRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST / (create tenant) ───────────────────
  app.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const body = validate(createTenantSchema, request.body);
    const db = getDatabase();

    const existing = await db('tenants').where({ slug: body.slug }).first();
    if (existing) throw new ConflictError('Tenant slug already taken');

    const tenantId = generateId();

    const tenant = await withTransaction(async (trx) => {
      const [newTenant] = await trx('tenants')
        .insert({
          id: tenantId,
          name: body.name,
          slug: body.slug,
          owner_id: user.userId,
          status: 'trial',
          plan: body.plan,
          trial_ends_at: addDays(new Date(), 14),
        })
        .returning('*');

      // Create default roles
      const defaultRoles = [
        { tenant_id: tenantId, name: 'Admin', slug: 'admin', is_default: false },
        { tenant_id: tenantId, name: 'Editor', slug: 'editor', is_default: false },
        { tenant_id: tenantId, name: 'Author', slug: 'author', is_default: true },
        { tenant_id: tenantId, name: 'Viewer', slug: 'viewer', is_default: false },
      ];
      const [adminRole] = await trx('tenant_roles').insert(defaultRoles).returning('*');

      // Add owner as admin
      await trx('tenant_members').insert({
        tenant_id: tenantId,
        user_id: user.userId,
        role_id: adminRole.id,
        status: 'active',
        joined_at: new Date(),
      });

      // Set default limits (free tier)
      await trx('tenant_limits').insert({
        tenant_id: tenantId,
        max_users: 5,
        max_content: 100,
        max_storage_bytes: 1073741824,
        max_api_requests_per_day: 10000,
        max_media_uploads_per_month: 500,
        max_plugins: 3,
      });

      return newTenant;
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.TENANT_CREATED, tenantId, { tenantId, name: body.name }, { userId: user.userId, source: 'tenant-service' }),
    );

    return reply.status(201).send({ tenant });
  });

  // ─── GET / (list user's tenants) ───────────────
  app.get('/', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const tenants = await db('tenant_members')
      .join('tenants', 'tenant_members.tenant_id', 'tenants.id')
      .where({ 'tenant_members.user_id': user.userId, 'tenant_members.status': 'active' })
      .whereNull('tenants.deleted_at')
      .select('tenants.*');

    return { tenants };
  });

  // ─── GET /:id ───────────────────
  app.get<{ Params: { id: string } }>('/:id', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params;

    return cacheThrough(tenantCacheKey(id, 'details'), 600, async () => {
      const db = getDatabase();
      const tenant = await db('tenants').where({ id }).whereNull('deleted_at').first();
      if (!tenant) throw new NotFoundError('Tenant', id);

      const limits = await db('tenant_limits').where({ tenant_id: id }).first();
      const memberCount = await db('tenant_members').where({ tenant_id: id, status: 'active' }).count('* as count').first();

      return { tenant: { ...tenant, limits, memberCount: Number(memberCount?.count ?? 0) } };
    });
  });

  // ─── PATCH /:id ───────────────────
  app.patch<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('tenant.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const body = validate(updateTenantSchema, request.body);
    const db = getDatabase();

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.settings) updateData.settings = JSON.stringify(body.settings);

    const [updated] = await db('tenants')
      .where({ id })
      .update({ ...updateData, updated_at: new Date() })
      .returning('*');

    if (!updated) throw new NotFoundError('Tenant', id);

    await cacheDel(tenantCacheKey(id, 'details'));

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.TENANT_UPDATED, id, { tenantId: id, changes: updateData }, { source: 'tenant-service' }),
    );

    return reply.send({ tenant: updated });
  });

  // ─── GET /:id/members ───────────────────
  app.get<{ Params: { id: string } }>('/:id/members', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params;
    const params = validate(paginationSchema, request.query) as PaginationParams;
    const db = getDatabase();

    const query = db('tenant_members')
      .join('users', 'tenant_members.user_id', 'users.id')
      .leftJoin('tenant_roles', 'tenant_members.role_id', 'tenant_roles.id')
      .where({ 'tenant_members.tenant_id': id })
      .select(
        'users.id', 'users.email', 'users.username', 'users.first_name', 'users.last_name',
        'users.avatar_url', 'tenant_members.status', 'tenant_members.joined_at',
        'tenant_roles.name as role_name', 'tenant_roles.slug as role_slug',
      );

    return paginate(query, params);
  });

  // ─── POST /:id/members (invite) ───────────────
  app.post<{ Params: { id: string } }>('/:id/members', { preHandler: [authenticate, requirePermissions('users.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const { email, roleSlug } = request.body as { email: string; roleSlug?: string };
    const authUser = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const role = roleSlug
      ? await db('tenant_roles').where({ tenant_id: id, slug: roleSlug }).first()
      : await db('tenant_roles').where({ tenant_id: id, is_default: true }).first();

    // Check limits
    const limits = await db('tenant_limits').where({ tenant_id: id }).first();
    const currentCount = await db('tenant_members').where({ tenant_id: id, status: 'active' }).count('* as count').first();

    if (limits && Number(currentCount?.count) >= limits.max_users) {
      return reply.status(402).send({ error: { code: 'PLAN_LIMIT_EXCEEDED', message: 'User limit reached for your plan' } });
    }

    const token = crypto.randomUUID();
    const tokenHash = token; // In production, hash this

    await db('tenant_invitations').insert({
      tenant_id: id,
      email,
      role_id: role?.id,
      token_hash: tokenHash,
      invited_by: authUser.userId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.TENANT_MEMBER_ADDED, id, { email, tenantId: id }, { userId: authUser.userId, source: 'tenant-service' }),
    );

    return reply.status(201).send({ message: 'Invitation sent', inviteToken: token });
  });

  // ─── GET /:id/usage ───────────────────
  app.get<{ Params: { id: string } }>('/:id/usage', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params;
    const db = getDatabase();

    const usage = await db('tenant_usage')
      .where({ tenant_id: id })
      .orderBy('period_start', 'desc')
      .first();

    const limits = await db('tenant_limits').where({ tenant_id: id }).first();

    return { usage, limits };
  });
}
