import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { ValidationError } from '@cms/errors';
import { cacheThrough, tenantCacheKey } from '@cms/cache';
import { generateId } from '@cms/utils';
import UAParser from 'ua-parser-js';

export async function analyticsRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST /events (track event) ──────────────
  app.post('/events', async (request, reply) => {
    const body = request.body as {
      tenantId: string;
      sessionId?: string;
      eventType: string;
      contentId?: string;
      properties?: Record<string, unknown>;
    };

    if (!body.tenantId || !body.eventType) {
      throw new ValidationError('tenantId and eventType are required');
    }

    const db = getDatabase();
    const ua = new UAParser(request.headers['user-agent'] || '');
    const browser = ua.getBrowser();
    const os = ua.getOS();
    const device = ua.getDevice();

    const ip = (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || request.ip;

    const [event] = await db('analytics_events')
      .insert({
        id: generateId(),
        tenant_id: body.tenantId,
        session_id: body.sessionId || null,
        event_type: body.eventType,
        content_id: body.contentId || null,
        properties: JSON.stringify(body.properties ?? {}),
        user_agent: request.headers['user-agent'] || null,
        ip_address: ip,
        browser_name: browser.name || null,
        browser_version: browser.version || null,
        os_name: os.name || null,
        device_type: device.type || 'desktop',
      })
      .returning('*');

    // Track pageview separately for fast queries
    if (body.eventType === 'pageview' && body.contentId) {
      await db('analytics_pageviews').insert({
        tenant_id: body.tenantId,
        content_id: body.contentId,
        session_id: body.sessionId || null,
        referrer: (body.properties?.referrer as string) || null,
        path: (body.properties?.path as string) || null,
      });
    }

    return reply.status(201).send({ eventId: event.id });
  });

  // ─── POST /sessions (start session) ──────────
  app.post('/sessions', async (request, reply) => {
    const body = request.body as { tenantId: string; visitorId?: string };
    if (!body.tenantId) throw new ValidationError('tenantId is required');

    const db = getDatabase();
    const sessionId = generateId();

    const [session] = await db('analytics_sessions')
      .insert({
        id: sessionId,
        tenant_id: body.tenantId,
        visitor_id: body.visitorId || generateId(),
        started_at: new Date(),
      })
      .returning('*');

    return reply.status(201).send({ session });
  });

  // ─── Dashboard endpoints (authenticated) ─────

  // ─── GET /overview ───────────────────
  app.get('/overview', { preHandler: [authenticate, requirePermissions('analytics.view')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { period?: string };
    const period = query.period || '7d';

    return cacheThrough(tenantCacheKey(user.tenantId, 'analytics', `overview_${period}`), 300, async () => {
      const db = getDatabase();
      const since = getPeriodDate(period);

      const [totalPageviews] = await db('analytics_pageviews')
        .where({ tenant_id: user.tenantId })
        .where('created_at', '>=', since)
        .count('* as count');

      const [totalSessions] = await db('analytics_sessions')
        .where({ tenant_id: user.tenantId })
        .where('started_at', '>=', since)
        .count('* as count');

      const [uniqueVisitors] = await db('analytics_sessions')
        .where({ tenant_id: user.tenantId })
        .where('started_at', '>=', since)
        .countDistinct('visitor_id as count');

      const [totalEvents] = await db('analytics_events')
        .where({ tenant_id: user.tenantId })
        .where('created_at', '>=', since)
        .count('* as count');

      return {
        period,
        pageviews: Number(totalPageviews.count),
        sessions: Number(totalSessions.count),
        uniqueVisitors: Number(uniqueVisitors.count),
        events: Number(totalEvents.count),
      };
    });
  });

  // ─── GET /top-content ───────────────
  app.get('/top-content', { preHandler: [authenticate, requirePermissions('analytics.view')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { period?: string; limit?: string };
    const period = query.period || '7d';
    const limit = Math.min(Number(query.limit) || 10, 100);

    return cacheThrough(tenantCacheKey(user.tenantId, 'analytics', `top_content_${period}`), 300, async () => {
      const db = getDatabase();
      const since = getPeriodDate(period);

      const topContent = await db('analytics_pageviews')
        .join('content', 'analytics_pageviews.content_id', 'content.id')
        .where({ 'analytics_pageviews.tenant_id': user.tenantId })
        .where('analytics_pageviews.created_at', '>=', since)
        .groupBy('content.id', 'content.title', 'content.slug')
        .select(
          'content.id',
          'content.title',
          'content.slug',
          db.raw('COUNT(*) as pageviews'),
          db.raw('COUNT(DISTINCT analytics_pageviews.session_id) as unique_views'),
        )
        .orderBy('pageviews', 'desc')
        .limit(limit);

      return { topContent, period };
    });
  });

  // ─── GET /referrers ───────────────
  app.get('/referrers', { preHandler: [authenticate, requirePermissions('analytics.view')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { period?: string };
    const period = query.period || '7d';

    return cacheThrough(tenantCacheKey(user.tenantId, 'analytics', `referrers_${period}`), 300, async () => {
      const db = getDatabase();
      const since = getPeriodDate(period);

      const referrers = await db('analytics_pageviews')
        .where({ tenant_id: user.tenantId })
        .where('created_at', '>=', since)
        .whereNotNull('referrer')
        .where('referrer', '!=', '')
        .groupBy('referrer')
        .select('referrer', db.raw('COUNT(*) as count'))
        .orderBy('count', 'desc')
        .limit(20);

      return { referrers, period };
    });
  });

  // ─── GET /devices ───────────────
  app.get('/devices', { preHandler: [authenticate, requirePermissions('analytics.view')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { period?: string };
    const period = query.period || '7d';

    return cacheThrough(tenantCacheKey(user.tenantId, 'analytics', `devices_${period}`), 300, async () => {
      const db = getDatabase();
      const since = getPeriodDate(period);

      const browsers = await db('analytics_events')
        .where({ tenant_id: user.tenantId })
        .where('created_at', '>=', since)
        .whereNotNull('browser_name')
        .groupBy('browser_name')
        .select('browser_name', db.raw('COUNT(*) as count'))
        .orderBy('count', 'desc')
        .limit(10);

      const operatingSystems = await db('analytics_events')
        .where({ tenant_id: user.tenantId })
        .where('created_at', '>=', since)
        .whereNotNull('os_name')
        .groupBy('os_name')
        .select('os_name', db.raw('COUNT(*) as count'))
        .orderBy('count', 'desc')
        .limit(10);

      const deviceTypes = await db('analytics_events')
        .where({ tenant_id: user.tenantId })
        .where('created_at', '>=', since)
        .groupBy('device_type')
        .select('device_type', db.raw('COUNT(*) as count'))
        .orderBy('count', 'desc');

      return { browsers, operatingSystems, deviceTypes, period };
    });
  });

  // ─── GET /timeseries ───────────────
  app.get('/timeseries', { preHandler: [authenticate, requirePermissions('analytics.view')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as { period?: string; metric?: string };
    const period = query.period || '7d';
    const metric = query.metric || 'pageviews';

    return cacheThrough(tenantCacheKey(user.tenantId, 'analytics', `timeseries_${period}_${metric}`), 300, async () => {
      const db = getDatabase();
      const since = getPeriodDate(period);
      const interval = getInterval(period);

      let data;
      if (metric === 'pageviews') {
        data = await db('analytics_pageviews')
          .where({ tenant_id: user.tenantId })
          .where('created_at', '>=', since)
          .select(db.raw(`date_trunc('${interval}', created_at) as date`))
          .count('* as value')
          .groupByRaw(`date_trunc('${interval}', created_at)`)
          .orderBy('date');
      } else if (metric === 'sessions') {
        data = await db('analytics_sessions')
          .where({ tenant_id: user.tenantId })
          .where('started_at', '>=', since)
          .select(db.raw(`date_trunc('${interval}', started_at) as date`))
          .count('* as value')
          .groupByRaw(`date_trunc('${interval}', started_at)`)
          .orderBy('date');
      } else {
        data = await db('analytics_events')
          .where({ tenant_id: user.tenantId, event_type: metric })
          .where('created_at', '>=', since)
          .select(db.raw(`date_trunc('${interval}', created_at) as date`))
          .count('* as value')
          .groupByRaw(`date_trunc('${interval}', created_at)`)
          .orderBy('date');
      }

      return { data, period, metric, interval };
    });
  });

  // ─── GET /content/:contentId (content-specific analytics) ───
  app.get<{ Params: { contentId: string } }>(
    '/content/:contentId',
    { preHandler: [authenticate, requirePermissions('analytics.view')] },
    async (request) => {
      const { contentId } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const query = request.query as { period?: string };
      const period = query.period || '30d';
      const db = getDatabase();
      const since = getPeriodDate(period);

      const [pageviews] = await db('analytics_pageviews')
        .where({ tenant_id: user.tenantId, content_id: contentId })
        .where('created_at', '>=', since)
        .count('* as total');

      const [uniqueViews] = await db('analytics_pageviews')
        .where({ tenant_id: user.tenantId, content_id: contentId })
        .where('created_at', '>=', since)
        .countDistinct('session_id as total');

      const timeseries = await db('analytics_pageviews')
        .where({ tenant_id: user.tenantId, content_id: contentId })
        .where('created_at', '>=', since)
        .select(db.raw("date_trunc('day', created_at) as date"))
        .count('* as views')
        .groupByRaw("date_trunc('day', created_at)")
        .orderBy('date');

      return {
        contentId,
        period,
        pageviews: Number(pageviews.total),
        uniqueViews: Number(uniqueViews.total),
        timeseries,
      };
    },
  );
}

function getPeriodDate(period: string): Date {
  const now = new Date();
  const match = period.match(/^(\d+)(h|d|w|m|y)$/);
  if (!match) return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'h': return new Date(now.getTime() - value * 60 * 60 * 1000);
    case 'd': return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
    case 'w': return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
    case 'm': return new Date(now.setMonth(now.getMonth() - value));
    case 'y': return new Date(now.setFullYear(now.getFullYear() - value));
    default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

function getInterval(period: string): string {
  const match = period.match(/^(\d+)(h|d|w|m|y)$/);
  if (!match) return 'day';
  const value = parseInt(match[1], 10);
  const unit = match[2];

  if (unit === 'h' && value <= 24) return 'hour';
  if (unit === 'd' && value <= 7) return 'hour';
  if (unit === 'd' && value <= 90) return 'day';
  if (unit === 'w' && value <= 12) return 'day';
  if (unit === 'm' && value <= 6) return 'week';
  return 'month';
}
