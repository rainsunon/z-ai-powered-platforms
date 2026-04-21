import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { ValidationError } from '@cms/errors';
import { cacheThrough, tenantCacheKey } from '@cms/cache';
import { searchContent, suggest, reindexAll } from './elasticsearch';

export async function searchRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── GET / (search content) ───────────────────
  app.get('/', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as Record<string, string>;

    if (!query.q && !query.contentType && !query.tag && !query.category) {
      throw new ValidationError('At least one search parameter is required');
    }

    const result = await searchContent({
      tenantId: user.tenantId,
      query: query.q || '',
      contentType: query.contentType,
      tags: query.tags ? query.tags.split(',') : undefined,
      categories: query.categories ? query.categories.split(',') : undefined,
      authorId: query.authorId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 20,
      sort: query.sort,
    });

    return result;
  });

  // ─── GET /suggest (autocomplete) ──────────────
  app.get('/suggest', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { q: string };

    if (!query.q || query.q.length < 2) {
      return { suggestions: [] };
    }

    const cacheKey = tenantCacheKey(user.tenantId, 'search', `suggest_${query.q}`);
    return cacheThrough(cacheKey, 60, async () => {
      const suggestions = await suggest(user.tenantId, query.q);
      return { suggestions };
    });
  });

  // ─── POST /reindex (admin) ────────────────────
  app.post('/reindex', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const count = await reindexAll(user.tenantId);
    return reply.send({ message: `Reindexed ${count} documents` });
  });
}
