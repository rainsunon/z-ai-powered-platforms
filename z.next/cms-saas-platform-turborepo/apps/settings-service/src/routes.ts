import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ValidationError } from '@cms/errors';
import { cacheDel, cacheThrough, tenantCacheKey } from '@cms/cache';
import { EventType, getEventBus, createEvent } from '@cms/messaging';

export async function settingsRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── GET / (get all tenant settings) ───
  app.get('/', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;

    return cacheThrough(tenantCacheKey(user.tenantId, 'settings', 'all'), 600, async () => {
      const db = getDatabase();
      const settings = await db('settings')
        .where({ tenant_id: user.tenantId })
        .orWhereNull('tenant_id') // Global defaults
        .orderBy('category')
        .orderBy('key');

      // Merge: tenant settings override global defaults
      const merged: Record<string, Record<string, unknown>> = {};
      for (const setting of settings) {
        const category = setting.category || 'general';
        if (!merged[category]) merged[category] = {};
        // Tenant settings override global
        if (setting.tenant_id === user.tenantId || !merged[category][setting.key]) {
          merged[category][setting.key] = {
            value: setting.value,
            type: setting.value_type,
            isPublic: setting.is_public,
            description: setting.description,
          };
        }
      }

      return { settings: merged };
    });
  });

  // ─── GET /:key (get single setting) ───
  app.get<{ Params: { key: string } }>('/:key', { preHandler: [authenticate] }, async (request) => {
    const { key } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    // Tenant setting first, then global
    const setting = await db('settings')
      .where({ key, tenant_id: user.tenantId })
      .orWhere(function () {
        this.where({ key }).whereNull('tenant_id');
      })
      .orderByRaw('tenant_id IS NULL') // Tenant settings first
      .first();

    if (!setting) throw new NotFoundError('Setting', key);

    return { key: setting.key, value: setting.value, type: setting.value_type };
  });

  // ─── PUT /:key (update setting) ───
  app.put<{ Params: { key: string } }>('/:key', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const { key } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const { value } = request.body as { value: unknown };
    const db = getDatabase();

    if (value === undefined) throw new ValidationError('value is required');

    const existing = await db('settings')
      .where({ key, tenant_id: user.tenantId })
      .first();

    if (existing) {
      await db('settings')
        .where({ key, tenant_id: user.tenantId })
        .update({ value: String(value), updated_at: new Date() });
    } else {
      await db('settings').insert({
        tenant_id: user.tenantId,
        key,
        value: String(value),
        value_type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string',
        category: 'custom',
        is_public: false,
      });
    }

    await cacheDel(tenantCacheKey(user.tenantId, 'settings', 'all'));

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.SETTINGS_UPDATED, user.tenantId, { key, value },
        { userId: user.userId, source: 'settings-service' }),
    );

    return reply.send({ key, value });
  });

  // ─── PUT /bulk (update multiple settings) ───
  app.put('/bulk/update', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const { settings: settingsMap } = request.body as { settings: Record<string, unknown> };
    const db = getDatabase();

    if (!settingsMap || typeof settingsMap !== 'object') {
      throw new ValidationError('settings object is required');
    }

    for (const [key, value] of Object.entries(settingsMap)) {
      const existing = await db('settings').where({ key, tenant_id: user.tenantId }).first();
      if (existing) {
        await db('settings')
          .where({ key, tenant_id: user.tenantId })
          .update({ value: String(value), updated_at: new Date() });
      } else {
        await db('settings').insert({
          tenant_id: user.tenantId,
          key,
          value: String(value),
          value_type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string',
          category: 'custom',
          is_public: false,
        });
      }
    }

    await cacheDel(tenantCacheKey(user.tenantId, 'settings', 'all'));

    return reply.send({ message: 'Settings updated', count: Object.keys(settingsMap).length });
  });

  // ─── GET /public (public settings, no auth) ───
  app.get('/public/:tenantId', async (request) => {
    const { tenantId } = request.params as { tenantId: string };

    return cacheThrough(tenantCacheKey(tenantId, 'settings', 'public'), 600, async () => {
      const db = getDatabase();
      const settings = await db('settings')
        .where({ is_public: true })
        .where(function () {
          this.where({ tenant_id: tenantId }).orWhereNull('tenant_id');
        });

      const result: Record<string, unknown> = {};
      for (const setting of settings) {
        if (setting.tenant_id === tenantId || !result[setting.key]) {
          result[setting.key] = setting.value;
        }
      }

      return { settings: result };
    });
  });

  // ─── Billing/Plan management ───

  app.get('/plans', { preHandler: [authenticate] }, async () => {
    const db = getDatabase();
    const plans = await db('plans')
      .where({ is_active: true })
      .orderBy('price_monthly');

    for (const plan of plans) {
      plan.features = await db('plan_features').where({ plan_id: plan.id });
    }

    return { plans };
  });

  app.get('/billing', { preHandler: [authenticate, requirePermissions('billing.manage')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const subscription = await db('subscriptions')
      .where({ tenant_id: user.tenantId, status: 'active' })
      .first();

    const invoices = await db('invoices')
      .where({ tenant_id: user.tenantId })
      .orderBy('created_at', 'desc')
      .limit(12);

    const usage = await db('tenant_usage')
      .where({ tenant_id: user.tenantId })
      .first();

    const limits = await db('tenant_limits')
      .where({ tenant_id: user.tenantId })
      .first();

    return { subscription, invoices, usage, limits };
  });
}
