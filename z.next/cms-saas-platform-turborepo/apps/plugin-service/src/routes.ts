import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ValidationError } from '@cms/errors';
import { EventType, getEventBus, createEvent } from '@cms/messaging';
import { generateId } from '@cms/utils';

export async function pluginRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── GET / (list installed plugins) ───
  app.get('/', { preHandler: [authenticate, requirePermissions('plugins.manage')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const plugins = await db('plugins')
      .where({ tenant_id: user.tenantId })
      .orderBy('installed_at', 'desc');

    return { plugins };
  });

  // ─── POST / (install plugin) ───
  app.post('/', { preHandler: [authenticate, requirePermissions('plugins.manage')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const body = request.body as {
      name: string;
      version: string;
      source: string; // npm, url, or local
      manifest: Record<string, unknown>;
    };

    if (!body.name || !body.version) throw new ValidationError('name and version are required');

    const db = getDatabase();

    // Check if already installed
    const existing = await db('plugins')
      .where({ tenant_id: user.tenantId, name: body.name })
      .first();

    if (existing) throw new ValidationError('Plugin is already installed');

    const result = await withTransaction(async (trx) => {
      const pluginId = generateId();

      const [plugin] = await trx('plugins')
        .insert({
          id: pluginId,
          tenant_id: user.tenantId,
          name: body.name,
          version: body.version,
          source: body.source || 'npm',
          manifest: JSON.stringify(body.manifest ?? {}),
          status: 'installed',
          installed_by: user.userId,
          installed_at: new Date(),
        })
        .returning('*');

      // Create default config
      await trx('plugin_configs').insert({
        plugin_id: pluginId,
        tenant_id: user.tenantId,
        config: JSON.stringify({}),
      });

      return plugin;
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.PLUGIN_INSTALLED, user.tenantId, { pluginId: result.id, name: body.name, version: body.version },
        { userId: user.userId, source: 'plugin-service' }),
    );

    return reply.status(201).send({ plugin: result });
  });

  // ─── GET /:id ───
  app.get<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('plugins.manage')] }, async (request) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const plugin = await db('plugins').where({ id, tenant_id: user.tenantId }).first();
    if (!plugin) throw new NotFoundError('Plugin', id);

    const pluginConfig = await db('plugin_configs').where({ plugin_id: id, tenant_id: user.tenantId }).first();

    return { plugin: { ...plugin, config: pluginConfig?.config ?? {} } };
  });

  // ─── POST /:id/activate ───
  app.post<{ Params: { id: string } }>('/:id/activate', { preHandler: [authenticate, requirePermissions('plugins.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const [updated] = await db('plugins')
      .where({ id, tenant_id: user.tenantId })
      .update({ status: 'active', activated_at: new Date() })
      .returning('*');

    if (!updated) throw new NotFoundError('Plugin', id);

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.PLUGIN_ACTIVATED, user.tenantId, { pluginId: id, name: updated.name },
        { userId: user.userId, source: 'plugin-service' }),
    );

    return reply.send({ plugin: updated });
  });

  // ─── POST /:id/deactivate ───
  app.post<{ Params: { id: string } }>('/:id/deactivate', { preHandler: [authenticate, requirePermissions('plugins.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const [updated] = await db('plugins')
      .where({ id, tenant_id: user.tenantId })
      .update({ status: 'inactive', deactivated_at: new Date() })
      .returning('*');

    if (!updated) throw new NotFoundError('Plugin', id);

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.PLUGIN_DEACTIVATED, user.tenantId, { pluginId: id, name: updated.name },
        { userId: user.userId, source: 'plugin-service' }),
    );

    return reply.send({ plugin: updated });
  });

  // ─── DELETE /:id (uninstall) ───
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('plugins.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const plugin = await db('plugins').where({ id, tenant_id: user.tenantId }).first();
    if (!plugin) throw new NotFoundError('Plugin', id);

    await withTransaction(async (trx) => {
      await trx('plugin_configs').where({ plugin_id: id }).delete();
      await trx('plugin_events').where({ plugin_id: id }).delete();
      await trx('plugins').where({ id }).delete();
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.PLUGIN_UNINSTALLED, user.tenantId, { pluginId: id, name: plugin.name },
        { userId: user.userId, source: 'plugin-service' }),
    );

    return reply.status(204).send();
  });

  // ─── PUT /:id/config ───
  app.put<{ Params: { id: string } }>('/:id/config', { preHandler: [authenticate, requirePermissions('plugins.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const { config: pluginConfig } = request.body as { config: Record<string, unknown> };
    const db = getDatabase();

    const plugin = await db('plugins').where({ id, tenant_id: user.tenantId }).first();
    if (!plugin) throw new NotFoundError('Plugin', id);

    await db('plugin_configs')
      .where({ plugin_id: id, tenant_id: user.tenantId })
      .update({ config: JSON.stringify(pluginConfig), updated_at: new Date() });

    return reply.send({ config: pluginConfig });
  });

  // ─── GET /marketplace (available plugins) ───
  app.get('/marketplace/browse', { preHandler: [authenticate] }, async (request) => {
    // In production, this would fetch from a plugin registry
    const marketplace = [
      {
        name: 'seo-optimizer',
        version: '1.0.0',
        description: 'Automatically optimize content for search engines',
        author: 'CMS Team',
        category: 'SEO',
        downloads: 12500,
        rating: 4.8,
      },
      {
        name: 'social-share',
        version: '2.1.0',
        description: 'Add social sharing buttons and OG metadata',
        author: 'CMS Team',
        category: 'Social',
        downloads: 8900,
        rating: 4.6,
      },
      {
        name: 'analytics-dashboard',
        version: '1.2.0',
        description: 'Enhanced analytics with custom dashboards',
        author: 'Community',
        category: 'Analytics',
        downloads: 6700,
        rating: 4.3,
      },
      {
        name: 'form-builder',
        version: '3.0.0',
        description: 'Create custom forms and collect submissions',
        author: 'Community',
        category: 'Forms',
        downloads: 15200,
        rating: 4.7,
      },
      {
        name: 'image-optimizer',
        version: '1.5.0',
        description: 'Automatic image compression and WebP conversion',
        author: 'CMS Team',
        category: 'Media',
        downloads: 9100,
        rating: 4.5,
      },
    ];

    return { plugins: marketplace };
  });
}
