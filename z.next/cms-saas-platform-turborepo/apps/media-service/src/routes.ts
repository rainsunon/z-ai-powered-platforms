import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ValidationError } from '@cms/errors';
import { paginationSchema, validate } from '@cms/validation';
import { EventType, getEventBus, createEvent } from '@cms/messaging';
import { cacheDel, cacheDelPattern } from '@cms/cache';
import { generateId } from '@cms/utils';
import {
  uploadToS3,
  deleteFromS3,
  getPresignedUrl,
  isImage,
  processImage,
  generateVariant,
  computeFileHash,
  getMimeType,
  generateStorageKey,
  DEFAULT_VARIANTS,
} from './storage';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime',
  'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm',
  'application/pdf', 'application/zip',
  'text/plain', 'text/csv',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export async function mediaRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST / (upload file) ───────────────────
  app.post('/', { preHandler: [authenticate, requirePermissions('media.upload')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const file = await request.file();
    if (!file) throw new ValidationError('No file uploaded');

    const buffer = await file.toBuffer();
    const mimeType = getMimeType(file.filename);

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new ValidationError(`File type ${mimeType} is not allowed`);
    }

    // Check tenant storage limits
    const usage = await db('tenant_usage').where({ tenant_id: user.tenantId }).first();
    if (usage) {
      const limit = await db('tenant_limits').where({ tenant_id: user.tenantId }).first();
      if (limit && usage.storage_used_bytes + buffer.length > limit.max_storage_bytes) {
        throw new ValidationError('Storage limit exceeded');
      }
    }

    const fileHash = computeFileHash(buffer);
    const key = generateStorageKey(user.tenantId, file.filename);
    const bucket = config.s3.bucket;

    const mediaId = generateId();

    const result = await withTransaction(async (trx) => {
      // Upload original
      const url = await uploadToS3(buffer, key, mimeType, bucket);

      let width: number | undefined;
      let height: number | undefined;

      // Process image metadata and variants
      if (isImage(mimeType)) {
        const meta = await processImage(buffer);
        width = meta.width;
        height = meta.height;

        // Generate image variants
        for (const variantConfig of DEFAULT_VARIANTS) {
          const variant = await generateVariant(buffer, variantConfig);
          const variantKey = key.replace(/(\.[^.]+)$/, `_${variantConfig.name}$1`).replace(/\.[^.]+$/, `.${variantConfig.format ?? 'webp'}`);
          const variantUrl = await uploadToS3(variant.buffer, variantKey, variant.mimeType, bucket);

          await trx('media_variants').insert({
            media_id: mediaId,
            variant_name: variantConfig.name,
            storage_key: variantKey,
            url: variantUrl,
            mime_type: variant.mimeType,
            width: variant.width,
            height: variant.height,
            file_size: variant.buffer.length,
          });
        }
      }

      // Store metadata
      const [media] = await trx('media')
        .insert({
          id: mediaId,
          tenant_id: user.tenantId,
          uploaded_by: user.userId,
          filename: file.filename,
          original_filename: file.filename,
          mime_type: mimeType,
          file_size: buffer.length,
          storage_key: key,
          storage_provider: 's3',
          url,
          width,
          height,
          file_hash: fileHash,
        })
        .returning('*');

      // Update tenant storage usage
      await trx('tenant_usage')
        .where({ tenant_id: user.tenantId })
        .increment('storage_used_bytes', buffer.length);

      return media;
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.MEDIA_UPLOADED, user.tenantId, { mediaId, filename: file.filename, mimeType },
        { userId: user.userId, source: 'media-service' }),
    );

    return reply.status(201).send({ media: result });
  });

  // ─── GET / (list media) ───────────────────
  app.get('/', { preHandler: [authenticate, requirePermissions('media.read')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const params = validate(paginationSchema, request.query) as PaginationParams;
    const query = request.query as Record<string, string>;
    const db = getDatabase();

    let baseQuery = db('media')
      .where({ tenant_id: user.tenantId })
      .whereNull('deleted_at');

    if (query.mimeType) baseQuery = baseQuery.where('mime_type', 'like', `${query.mimeType}%`);
    if (query.folderId) baseQuery = baseQuery.where('folder_id', query.folderId);
    if (query.search) baseQuery = baseQuery.where('filename', 'ilike', `%${query.search}%`);

    return paginate(baseQuery, params);
  });

  // ─── GET /:id ───────────────────
  app.get<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('media.read')] }, async (request) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const media = await db('media')
      .where({ id, tenant_id: user.tenantId })
      .whereNull('deleted_at')
      .first();

    if (!media) throw new NotFoundError('Media', id);

    const variants = await db('media_variants').where({ media_id: id });
    const tags = await db('media_tags')
      .join('tags', 'media_tags.tag_id', 'tags.id')
      .where({ media_id: id })
      .select('tags.id', 'tags.name', 'tags.slug');

    return { media: { ...media, variants, tags } };
  });

  // ─── DELETE /:id ───────────────────
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('media.delete')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();
    const bucket = config.s3.bucket;

    const media = await db('media')
      .where({ id, tenant_id: user.tenantId })
      .whereNull('deleted_at')
      .first();

    if (!media) throw new NotFoundError('Media', id);

    await withTransaction(async (trx) => {
      // Delete variants from S3
      const variants = await trx('media_variants').where({ media_id: id });
      for (const variant of variants) {
        await deleteFromS3(variant.storage_key, bucket);
      }

      // Delete original from S3
      await deleteFromS3(media.storage_key, bucket);

      // Soft delete
      await trx('media').where({ id }).update({ deleted_at: new Date() });
      await trx('media_variants').where({ media_id: id }).delete();

      // Update storage usage
      const totalSize = media.file_size + variants.reduce((sum: number, v: any) => sum + v.file_size, 0);
      await trx('tenant_usage')
        .where({ tenant_id: user.tenantId })
        .decrement('storage_used_bytes', totalSize);
    });

    const eventBus = getEventBus();
    await eventBus.publish(
      createEvent(EventType.MEDIA_DELETED, user.tenantId, { mediaId: id, filename: media.filename },
        { userId: user.userId, source: 'media-service' }),
    );

    return reply.status(204).send();
  });

  // ─── GET /:id/presigned-url ───────────────────
  app.get<{ Params: { id: string } }>('/:id/presigned-url', { preHandler: [authenticate, requirePermissions('media.read')] }, async (request) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();
    const bucket = config.s3.bucket;

    const media = await db('media').where({ id, tenant_id: user.tenantId }).first();
    if (!media) throw new NotFoundError('Media', id);

    const url = await getPresignedUrl(media.storage_key, bucket);
    return { url, expiresIn: 3600 };
  });

  // ─── Folder management ───────────────────

  app.post('/folders', { preHandler: [authenticate, requirePermissions('media.upload')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const { name, parentId } = request.body as { name: string; parentId?: string };
    const db = getDatabase();

    if (!name || name.trim().length === 0) throw new ValidationError('Folder name is required');

    const [folder] = await db('media_folders')
      .insert({
        tenant_id: user.tenantId,
        name: name.trim(),
        parent_id: parentId || null,
        created_by: user.userId,
      })
      .returning('*');

    return reply.status(201).send({ folder });
  });

  app.get('/folders', { preHandler: [authenticate, requirePermissions('media.read')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as Record<string, string>;
    const db = getDatabase();

    const folders = await db('media_folders')
      .where({ tenant_id: user.tenantId })
      .modify((qb) => {
        if (query.parentId) qb.where('parent_id', query.parentId);
        else qb.whereNull('parent_id');
      })
      .orderBy('name');

    return { folders };
  });

  app.delete<{ Params: { id: string } }>('/folders/:id', { preHandler: [authenticate, requirePermissions('media.delete')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    // Check for child items
    const childFolders = await db('media_folders').where({ parent_id: id }).first();
    const childMedia = await db('media').where({ folder_id: id }).whereNull('deleted_at').first();
    if (childFolders || childMedia) {
      throw new ValidationError('Folder is not empty');
    }

    await db('media_folders')
      .where({ id, tenant_id: user.tenantId })
      .delete();

    return reply.status(204).send();
  });

  // ─── PATCH /:id/move (move to folder) ───────
  app.patch<{ Params: { id: string } }>('/:id/move', { preHandler: [authenticate, requirePermissions('media.upload')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const { folderId } = request.body as { folderId: string | null };
    const db = getDatabase();

    const [updated] = await db('media')
      .where({ id, tenant_id: user.tenantId })
      .update({ folder_id: folderId })
      .returning('*');

    if (!updated) throw new NotFoundError('Media', id);
    return reply.send({ media: updated });
  });
}
