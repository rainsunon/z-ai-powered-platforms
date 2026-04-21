import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { paginationSchema, validate } from '@cms/validation';

export async function auditRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── GET / (search audit logs) ───
  app.get('/', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const params = validate(paginationSchema, request.query) as PaginationParams;
    const query = request.query as Record<string, string>;
    const db = getDatabase();

    let baseQuery = db('audit_logs')
      .where({ tenant_id: user.tenantId })
      .leftJoin('users', 'audit_logs.user_id', 'users.id')
      .select(
        'audit_logs.*',
        'users.email as user_email',
        'users.display_name as user_name',
      )
      .orderBy('audit_logs.created_at', 'desc');

    if (query.action) baseQuery = baseQuery.where('audit_logs.action', query.action);
    if (query.userId) baseQuery = baseQuery.where('audit_logs.user_id', query.userId);
    if (query.resourceType) baseQuery = baseQuery.where('audit_logs.resource_type', query.resourceType);
    if (query.resourceId) baseQuery = baseQuery.where('audit_logs.resource_id', query.resourceId);
    if (query.dateFrom) baseQuery = baseQuery.where('audit_logs.created_at', '>=', query.dateFrom);
    if (query.dateTo) baseQuery = baseQuery.where('audit_logs.created_at', '<=', query.dateTo);
    if (query.source) baseQuery = baseQuery.where('audit_logs.source', query.source);

    return paginate(baseQuery, params);
  });

  // ─── GET /actions (list distinct actions) ───
  app.get('/actions', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const actions = await db('audit_logs')
      .where({ tenant_id: user.tenantId })
      .distinct('action')
      .orderBy('action')
      .pluck('action');

    return { actions };
  });

  // ─── GET /summary (activity summary) ───
  app.get('/summary', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { period?: string };
    const db = getDatabase();

    const since = new Date();
    since.setDate(since.getDate() - (query.period === '30d' ? 30 : 7));

    const byAction = await db('audit_logs')
      .where({ tenant_id: user.tenantId })
      .where('created_at', '>=', since)
      .groupBy('action')
      .select('action', db.raw('COUNT(*) as count'))
      .orderBy('count', 'desc')
      .limit(20);

    const byUser = await db('audit_logs')
      .where({ 'audit_logs.tenant_id': user.tenantId })
      .where('audit_logs.created_at', '>=', since)
      .whereNotNull('audit_logs.user_id')
      .join('users', 'audit_logs.user_id', 'users.id')
      .groupBy('users.id', 'users.email', 'users.display_name')
      .select('users.id', 'users.email', 'users.display_name', db.raw('COUNT(*) as count'))
      .orderBy('count', 'desc')
      .limit(10);

    const [total] = await db('audit_logs')
      .where({ tenant_id: user.tenantId })
      .where('created_at', '>=', since)
      .count('* as count');

    return { total: Number(total.count), byAction, byUser };
  });

  // ─── GET /export (export audit logs) ───
  app.get('/export', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { dateFrom?: string; dateTo?: string; format?: string };
    const db = getDatabase();

    let baseQuery = db('audit_logs')
      .where({ tenant_id: user.tenantId })
      .leftJoin('users', 'audit_logs.user_id', 'users.id')
      .select(
        'audit_logs.created_at',
        'audit_logs.action',
        'audit_logs.resource_type',
        'audit_logs.resource_id',
        'audit_logs.source',
        'users.email as user_email',
      )
      .orderBy('audit_logs.created_at', 'desc')
      .limit(10000);

    if (query.dateFrom) baseQuery = baseQuery.where('audit_logs.created_at', '>=', query.dateFrom);
    if (query.dateTo) baseQuery = baseQuery.where('audit_logs.created_at', '<=', query.dateTo);

    const logs = await baseQuery;

    if (query.format === 'csv') {
      const header = 'timestamp,action,resource_type,resource_id,source,user_email\n';
      const rows = logs.map((l: any) =>
        `${l.created_at},${l.action},${l.resource_type},${l.resource_id || ''},${l.source},${l.user_email || ''}`
      ).join('\n');

      return reply
        .header('Content-Type', 'text/csv')
        .header('Content-Disposition', 'attachment; filename=audit-log.csv')
        .send(header + rows);
    }

    return { logs };
  });
}
