import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ValidationError } from '@cms/errors';
import { paginationSchema, validate } from '@cms/validation';
import { generateId } from '@cms/utils';
import { sendEmail, createNotification } from './email';

export async function notificationRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── GET / (list user notifications) ───
  app.get('/', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const params = validate(paginationSchema, request.query) as PaginationParams;
    const query = request.query as Record<string, string>;
    const db = getDatabase();

    let baseQuery = db('notifications')
      .where({ user_id: user.userId })
      .orderBy('created_at', 'desc');

    if (query.unreadOnly === 'true') baseQuery = baseQuery.whereNull('read_at');
    if (query.type) baseQuery = baseQuery.where('type', query.type);

    return paginate(baseQuery, params);
  });

  // ─── GET /unread-count ───
  app.get('/unread-count', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const [result] = await db('notifications')
      .where({ user_id: user.userId })
      .whereNull('read_at')
      .count('* as count');

    return { count: Number(result.count) };
  });

  // ─── PATCH /:id/read ───
  app.patch<{ Params: { id: string } }>('/:id/read', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const [updated] = await db('notifications')
      .where({ id, user_id: user.userId })
      .update({ read_at: new Date() })
      .returning('*');

    if (!updated) throw new NotFoundError('Notification', id);
    return reply.send({ notification: updated });
  });

  // ─── POST /read-all ───
  app.post('/read-all', { preHandler: [authenticate] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    await db('notifications')
      .where({ user_id: user.userId })
      .whereNull('read_at')
      .update({ read_at: new Date() });

    return reply.send({ message: 'All notifications marked as read' });
  });

  // ─── DELETE /:id ───
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    await db('notifications').where({ id, user_id: user.userId }).delete();
    return reply.status(204).send();
  });

  // ─── Notification preferences ───

  app.get('/preferences', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const prefs = await db('notification_preferences')
      .where({ user_id: user.userId })
      .first();

    return { preferences: prefs?.preferences ?? getDefaultPreferences() };
  });

  app.put('/preferences', { preHandler: [authenticate] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const { preferences } = request.body as { preferences: Record<string, boolean> };
    const db = getDatabase();

    const existing = await db('notification_preferences').where({ user_id: user.userId }).first();

    if (existing) {
      await db('notification_preferences')
        .where({ user_id: user.userId })
        .update({ preferences: JSON.stringify(preferences), updated_at: new Date() });
    } else {
      await db('notification_preferences').insert({
        user_id: user.userId,
        preferences: JSON.stringify(preferences),
      });
    }

    return reply.send({ preferences });
  });

  // ─── Webhook management ───

  app.post('/webhooks', { preHandler: [authenticate] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const body = request.body as {
      url: string;
      events: string[];
      secret?: string;
    };

    if (!body.url || !body.events?.length) {
      throw new ValidationError('url and events are required');
    }

    const db = getDatabase();
    const [webhook] = await db('webhooks')
      .insert({
        id: generateId(),
        tenant_id: user.tenantId,
        url: body.url,
        events: JSON.stringify(body.events),
        secret: body.secret || null,
        is_active: true,
        created_by: user.userId,
      })
      .returning('*');

    return reply.status(201).send({ webhook });
  });

  app.get('/webhooks', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const webhooks = await db('webhooks')
      .where({ tenant_id: user.tenantId })
      .orderBy('created_at', 'desc');

    return { webhooks };
  });

  app.delete<{ Params: { id: string } }>('/webhooks/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    await db('webhooks').where({ id, tenant_id: user.tenantId }).delete();
    return reply.status(204).send();
  });

  app.get<{ Params: { id: string } }>('/webhooks/:id/deliveries', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const deliveries = await db('webhook_deliveries')
      .where({ webhook_id: id })
      .orderBy('created_at', 'desc')
      .limit(50);

    return { deliveries };
  });
}

function getDefaultPreferences(): Record<string, boolean> {
  return {
    content_published_in_app: true,
    content_published_email: true,
    comment_created_in_app: true,
    comment_created_email: false,
    workflow_action_required_in_app: true,
    workflow_action_required_email: true,
    welcome_in_app: true,
    welcome_email: true,
  };
}
