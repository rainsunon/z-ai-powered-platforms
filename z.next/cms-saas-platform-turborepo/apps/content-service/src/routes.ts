import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ForbiddenError, ValidationError } from '@cms/errors';
import { createContentSchema, updateContentSchema, paginationSchema, validate, ContentBlock } from '@cms/validation';
import { createEvent, EventType, getEventBus } from '@cms/messaging';
import { cacheThrough, cacheDel, cacheDelPattern, tenantCacheKey } from '@cms/cache';
import { generateId } from '@cms/utils';
import { countWords, estimateReadingTime, validateBlockTree, generateSlug, extractText } from './blocks';

export async function contentRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST / (create content) ───────────────────
  app.post('/', { preHandler: [authenticate, requirePermissions('content.create')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const body = validate(createContentSchema, request.body);
    const db = getDatabase();

    // Validate blocks
    const blockErrors = validateBlockTree(body.blocks);
    if (blockErrors.length > 0) {
      throw new ValidationError('Invalid block structure', { errors: blockErrors });
    }

    const slug = body.slug ?? generateSlug(body.title);
    const wordCount = countWords(body.blocks);
    const readingTime = estimateReadingTime(wordCount);
    const contentId = generateId();

    const content = await withTransaction(async (trx) => {
      // Check for duplicate slug in tenant
      const existing = await trx('content')
        .where({ tenant_id: user.tenantId, slug })
        .whereNull('deleted_at')
        .first();

      if (existing) throw new ValidationError('Content with this slug already exists');

      // Create content
      const [newContent] = await trx('content')
        .insert({
          id: contentId,
          tenant_id: user.tenantId,
          author_id: user.userId,
          title: body.title,
          slug,
          status: body.status,
          word_count: wordCount,
          reading_time_minutes: readingTime,
          current_version: 1,
          seo_metadata: JSON.stringify(body.meta ?? {}),
          published_at: body.status === 'published' ? new Date() : null,
          scheduled_at: body.publishAt ? new Date(body.publishAt) : null,
        })
        .returning('*');

      // Create version 1
      await trx('content_versions').insert({
        content_id: contentId,
        version_number: 1,
        title: body.title,
        blocks: JSON.stringify(body.blocks),
        raw_text: extractText(body.blocks),
        created_by: user.userId,
        change_summary: 'Initial creation',
      });

      // Store individual blocks
      for (let i = 0; i < body.blocks.length; i++) {
        const block = body.blocks[i];
        await trx('content_blocks').insert({
          id: block.id,
          content_id: contentId,
          parent_block_id: null,
          type: block.type,
          data: JSON.stringify(block.data),
          sort_order: i,
        });

        // Insert children
        if (block.children) {
          for (let j = 0; j < block.children.length; j++) {
            const child = block.children[j];
            await trx('content_blocks').insert({
              id: child.id,
              content_id: contentId,
              parent_block_id: block.id,
              type: child.type,
              data: JSON.stringify(child.data),
              sort_order: j,
            });
          }
        }
      }

      // Add tags
      if (body.tags?.length) {
        for (const tagName of body.tags) {
          const tagSlug = generateSlug(tagName);
          let tag = await trx('tags').where({ tenant_id: user.tenantId, slug: tagSlug }).first();
          if (!tag) {
            [tag] = await trx('tags')
              .insert({ tenant_id: user.tenantId, name: tagName, slug: tagSlug })
              .returning('*');
          }
          await trx('content_tags').insert({ content_id: contentId, tag_id: tag.id }).onConflict().ignore();
        }
      }

      // Add categories
      if (body.categories?.length) {
        for (const catId of body.categories) {
          await trx('content_categories').insert({ content_id: contentId, category_id: catId }).onConflict().ignore();
        }
      }

      return newContent;
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.CONTENT_CREATED, user.tenantId, { contentId, title: body.title, status: body.status },
        { userId: user.userId, source: 'content-service' }),
    );

    if (body.status === 'published') {
      await eventBus.publish(
        createEvent(EventType.CONTENT_PUBLISHED, user.tenantId, { contentId, title: body.title },
          { userId: user.userId, source: 'content-service' }),
      );
    }

    return reply.status(201).send({ content });
  });

  // ─── GET / (list content) ───────────────────
  app.get('/', { preHandler: [authenticate, requirePermissions('content.read')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const params = validate(paginationSchema, request.query) as PaginationParams;
    const query = request.query as Record<string, string>;
    const db = getDatabase();

    let baseQuery = db('content')
      .where({ tenant_id: user.tenantId })
      .whereNull('deleted_at')
      .select(
        'id', 'title', 'slug', 'excerpt', 'featured_image_url', 'status',
        'content_type', 'word_count', 'reading_time_minutes', 'published_at',
        'author_id', 'created_at', 'updated_at',
      );

    // Filters
    if (query.status) baseQuery = baseQuery.where('status', query.status);
    if (query.contentType) baseQuery = baseQuery.where('content_type', query.contentType);
    if (query.authorId) baseQuery = baseQuery.where('author_id', query.authorId);

    return paginate(baseQuery, params);
  });

  // ─── GET /:id ───────────────────
  app.get<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('content.read')] }, async (request) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;

    return cacheThrough(tenantCacheKey(user.tenantId, 'content', id), 300, async () => {
      const db = getDatabase();

      const content = await db('content')
        .where({ id, tenant_id: user.tenantId })
        .whereNull('deleted_at')
        .first();

      if (!content) throw new NotFoundError('Content', id);

      // Get latest version blocks
      const version = await db('content_versions')
        .where({ content_id: id, version_number: content.current_version })
        .first();

      // Get tags
      const tags = await db('content_tags')
        .join('tags', 'content_tags.tag_id', 'tags.id')
        .where({ content_id: id })
        .select('tags.id', 'tags.name', 'tags.slug');

      // Get categories
      const categories = await db('content_categories')
        .join('categories', 'content_categories.category_id', 'categories.id')
        .where({ content_id: id })
        .select('categories.id', 'categories.name', 'categories.slug');

      return {
        content: {
          ...content,
          blocks: version?.blocks ?? [],
          tags,
          categories,
        },
      };
    });
  });

  // ─── PATCH /:id ───────────────────
  app.patch<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('content.update')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const body = validate(updateContentSchema, request.body);
    const db = getDatabase();

    const existing = await db('content')
      .where({ id, tenant_id: user.tenantId })
      .whereNull('deleted_at')
      .first();

    if (!existing) throw new NotFoundError('Content', id);

    // Check lock
    const lock = await db('content_locks').where({ content_id: id }).where('expires_at', '>', new Date()).first();
    if (lock && lock.locked_by !== user.userId) {
      throw new ForbiddenError('Content is locked by another user');
    }

    const result = await withTransaction(async (trx) => {
      const updateData: Record<string, unknown> = { updated_at: new Date() };
      if (body.title) updateData.title = body.title;
      if (body.slug) updateData.slug = body.slug;
      if (body.status) {
        updateData.status = body.status;
        if (body.status === 'published' && existing.status !== 'published') {
          updateData.published_at = new Date();
        }
      }

      if (body.blocks) {
        const wordCount = countWords(body.blocks);
        updateData.word_count = wordCount;
        updateData.reading_time_minutes = estimateReadingTime(wordCount);
        updateData.current_version = existing.current_version + 1;

        // Create new version
        await trx('content_versions').insert({
          content_id: id,
          version_number: existing.current_version + 1,
          title: body.title ?? existing.title,
          blocks: JSON.stringify(body.blocks),
          raw_text: extractText(body.blocks),
          created_by: user.userId,
          change_summary: `Version ${existing.current_version + 1}`,
        });

        // Replace blocks
        await trx('content_blocks').where({ content_id: id }).delete();
        for (let i = 0; i < body.blocks.length; i++) {
          const block = body.blocks[i];
          await trx('content_blocks').insert({
            id: block.id,
            content_id: id,
            type: block.type,
            data: JSON.stringify(block.data),
            sort_order: i,
          });
        }
      }

      const [updated] = await trx('content').where({ id }).update(updateData).returning('*');
      return updated;
    });

    await cacheDel(tenantCacheKey(user.tenantId, 'content', id));

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.CONTENT_UPDATED, user.tenantId, { contentId: id },
        { userId: user.userId, source: 'content-service' }),
    );

    if (body.status === 'published' && existing.status !== 'published') {
      await eventBus.publish(
        createEvent(EventType.CONTENT_PUBLISHED, user.tenantId, { contentId: id },
          { userId: user.userId, source: 'content-service' }),
      );
    }

    return reply.send({ content: result });
  });

  // ─── DELETE /:id ───────────────────
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('content.delete')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    await db('content')
      .where({ id, tenant_id: user.tenantId })
      .update({ status: 'archived', deleted_at: new Date() });

    await cacheDel(tenantCacheKey(user.tenantId, 'content', id));

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.CONTENT_DELETED, user.tenantId, { contentId: id },
        { userId: user.userId, source: 'content-service' }),
    );

    return reply.status(204).send();
  });

  // ─── GET /:id/versions ───────────────────
  app.get<{ Params: { id: string } }>('/:id/versions', { preHandler: [authenticate, requirePermissions('content.read')] }, async (request) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const versions = await db('content_versions')
      .where({ content_id: id })
      .orderBy('version_number', 'desc')
      .select('id', 'version_number', 'title', 'change_summary', 'created_by', 'created_at');

    return { versions };
  });

  // ─── POST /:id/versions/:version/restore ───────
  app.post<{ Params: { id: string; version: string } }>(
    '/:id/versions/:version/restore',
    { preHandler: [authenticate, requirePermissions('content.update')] },
    async (request, reply) => {
      const { id, version } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const db = getDatabase();

      const versionRecord = await db('content_versions')
        .where({ content_id: id, version_number: Number(version) })
        .first();

      if (!versionRecord) throw new NotFoundError('Version');

      const existing = await db('content').where({ id }).first();
      if (!existing) throw new NotFoundError('Content', id);

      await withTransaction(async (trx) => {
        const newVersion = existing.current_version + 1;

        await trx('content_versions').insert({
          content_id: id,
          version_number: newVersion,
          title: versionRecord.title,
          blocks: versionRecord.blocks,
          raw_text: versionRecord.raw_text,
          created_by: user.userId,
          change_summary: `Restored from version ${version}`,
        });

        await trx('content').where({ id }).update({
          title: versionRecord.title,
          current_version: newVersion,
          updated_at: new Date(),
        });
      });

      await cacheDel(tenantCacheKey(user.tenantId, 'content', id));

      return reply.send({ message: `Restored to version ${version}` });
    },
  );

  // ─── POST /:id/publish ───────────────────
  app.post<{ Params: { id: string } }>('/:id/publish', { preHandler: [authenticate, requirePermissions('content.publish')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const [updated] = await db('content')
      .where({ id, tenant_id: user.tenantId })
      .update({ status: 'published', published_at: new Date(), updated_at: new Date() })
      .returning('*');

    if (!updated) throw new NotFoundError('Content', id);

    await cacheDel(tenantCacheKey(user.tenantId, 'content', id));

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.CONTENT_PUBLISHED, user.tenantId, { contentId: id, title: updated.title },
        { userId: user.userId, source: 'content-service' }),
    );

    return reply.send({ content: updated });
  });

  // ─── POST /:id/unpublish ───────────────────
  app.post<{ Params: { id: string } }>('/:id/unpublish', { preHandler: [authenticate, requirePermissions('content.publish')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const [updated] = await db('content')
      .where({ id, tenant_id: user.tenantId })
      .update({ status: 'draft', updated_at: new Date() })
      .returning('*');

    if (!updated) throw new NotFoundError('Content', id);

    await cacheDel(tenantCacheKey(user.tenantId, 'content', id));

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.CONTENT_UNPUBLISHED, user.tenantId, { contentId: id },
        { userId: user.userId, source: 'content-service' }),
    );

    return reply.send({ content: updated });
  });
}
