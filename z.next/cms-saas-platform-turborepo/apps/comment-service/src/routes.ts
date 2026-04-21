import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ForbiddenError, ValidationError } from '@cms/errors';
import { commentSchema, paginationSchema, validate } from '@cms/validation';
import { EventType, getEventBus, createEvent } from '@cms/messaging';
import { generateId, sanitizeHtml } from '@cms/utils';

export async function commentRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST /content/:contentId (create comment) ───
  app.post<{ Params: { contentId: string } }>(
    '/content/:contentId',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { contentId } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const body = validate(commentSchema, request.body);
      const db = getDatabase();

      // Verify content exists
      const content = await db('content').where({ id: contentId, tenant_id: user.tenantId }).first();
      if (!content) throw new NotFoundError('Content', contentId);

      const commentId = generateId();
      const sanitizedBody = sanitizeHtml(body.body);

      const result = await withTransaction(async (trx) => {
        // Handle threading
        let threadId = body.threadId;
        let parentId = body.parentId || null;

        if (!threadId) {
          // Create a new thread
          const [thread] = await trx('comment_threads')
            .insert({
              content_id: contentId,
              status: 'open',
            })
            .returning('*');
          threadId = thread.id;
        }

        const [comment] = await trx('comments')
          .insert({
            id: commentId,
            content_id: contentId,
            thread_id: threadId,
            author_id: user.userId,
            parent_id: parentId,
            body: sanitizedBody,
            status: 'approved', // Auto-approve for authenticated users
          })
          .returning('*');

        // Update thread comment count
        await trx('comment_threads')
          .where({ id: threadId })
          .increment('comment_count', 1)
          .update({ last_activity_at: new Date() });

        return comment;
      });

      const eventBus = getEventBus();
      await eventBus.publish(
        createEvent(EventType.COMMENT_CREATED, user.tenantId, {
          commentId, contentId, authorId: user.userId,
        }, { userId: user.userId, source: 'comment-service' }),
      );

      return reply.status(201).send({ comment: result });
    },
  );

  // ─── GET /content/:contentId (list comments) ───
  app.get<{ Params: { contentId: string } }>(
    '/content/:contentId',
    { preHandler: [authenticate] },
    async (request) => {
      const { contentId } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const params = validate(paginationSchema, request.query) as PaginationParams;
      const db = getDatabase();

      const baseQuery = db('comments')
        .join('users', 'comments.author_id', 'users.id')
        .where({ 'comments.content_id': contentId, 'comments.status': 'approved' })
        .whereNull('comments.parent_id') // Top-level comments only
        .select(
          'comments.*',
          'users.email as author_email',
          'users.display_name as author_name',
          'users.avatar_url as author_avatar',
        )
        .orderBy('comments.created_at', 'desc');

      const result = await paginate(baseQuery, params);

      // Load replies for each top-level comment
      for (const comment of result.data) {
        comment.replies = await db('comments')
          .join('users', 'comments.author_id', 'users.id')
          .where({ 'comments.parent_id': comment.id, 'comments.status': 'approved' })
          .select(
            'comments.*',
            'users.email as author_email',
            'users.display_name as author_name',
            'users.avatar_url as author_avatar',
          )
          .orderBy('comments.created_at', 'asc');

        // Load reaction counts
        const reactions = await db('comment_reactions')
          .where({ comment_id: comment.id })
          .groupBy('reaction_type')
          .select('reaction_type')
          .count('* as count');
        comment.reactions = reactions;
      }

      return result;
    },
  );

  // ─── PATCH /:id (update comment) ───
  app.patch<{ Params: { id: string } }>('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const { body } = request.body as { body: string };
    const db = getDatabase();

    const comment = await db('comments').where({ id }).first();
    if (!comment) throw new NotFoundError('Comment', id);
    if (comment.author_id !== user.userId) throw new ForbiddenError('You can only edit your own comments');

    const [updated] = await db('comments')
      .where({ id })
      .update({ body: sanitizeHtml(body), edited_at: new Date() })
      .returning('*');

    return reply.send({ comment: updated });
  });

  // ─── DELETE /:id ───
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const comment = await db('comments').where({ id }).first();
    if (!comment) throw new NotFoundError('Comment', id);

    // Only author or admin can delete
    if (comment.author_id !== user.userId && !user.roles?.includes('super_admin') && !user.roles?.includes('admin')) {
      throw new ForbiddenError('You can only delete your own comments');
    }

    await db('comments').where({ id }).update({ status: 'deleted', deleted_at: new Date() });

    // Update thread count
    await db('comment_threads')
      .where({ id: comment.thread_id })
      .decrement('comment_count', 1);

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.COMMENT_DELETED, user.tenantId, { commentId: id, contentId: comment.content_id },
        { userId: user.userId, source: 'comment-service' }),
    );

    return reply.status(204).send();
  });

  // ─── POST /:id/reactions ───
  app.post<{ Params: { id: string } }>('/:id/reactions', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const { reactionType } = request.body as { reactionType: string };
    const db = getDatabase();

    const allowedReactions = ['like', 'love', 'laugh', 'surprised', 'sad', 'angry'];
    if (!allowedReactions.includes(reactionType)) {
      throw new ValidationError(`Invalid reaction type. Allowed: ${allowedReactions.join(', ')}`);
    }

    // Toggle reaction
    const existing = await db('comment_reactions')
      .where({ comment_id: id, user_id: user.userId, reaction_type: reactionType })
      .first();

    if (existing) {
      await db('comment_reactions').where({ id: existing.id }).delete();
      return reply.send({ action: 'removed', reactionType });
    }

    await db('comment_reactions').insert({
      comment_id: id,
      user_id: user.userId,
      reaction_type: reactionType,
    });

    return reply.status(201).send({ action: 'added', reactionType });
  });

  // ─── Moderation endpoints (admin) ───

  app.post<{ Params: { id: string } }>(
    '/:id/approve',
    { preHandler: [authenticate, requirePermissions('content.update')] },
    async (request, reply) => {
      const { id } = request.params;
      const db = getDatabase();

      const [updated] = await db('comments')
        .where({ id })
        .update({ status: 'approved', moderated_at: new Date() })
        .returning('*');

      if (!updated) throw new NotFoundError('Comment', id);
      return reply.send({ comment: updated });
    },
  );

  app.post<{ Params: { id: string } }>(
    '/:id/reject',
    { preHandler: [authenticate, requirePermissions('content.update')] },
    async (request, reply) => {
      const { id } = request.params;
      const db = getDatabase();

      const [updated] = await db('comments')
        .where({ id })
        .update({ status: 'rejected', moderated_at: new Date() })
        .returning('*');

      if (!updated) throw new NotFoundError('Comment', id);
      return reply.send({ comment: updated });
    },
  );

  // ─── GET /threads/:contentId ───
  app.get<{ Params: { contentId: string } }>(
    '/threads/:contentId',
    { preHandler: [authenticate] },
    async (request) => {
      const { contentId } = request.params;
      const db = getDatabase();

      const threads = await db('comment_threads')
        .where({ content_id: contentId })
        .orderBy('last_activity_at', 'desc');

      return { threads };
    },
  );
}
