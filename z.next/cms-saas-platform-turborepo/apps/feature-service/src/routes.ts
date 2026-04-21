import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ValidationError } from '@cms/errors';
import { cacheDel, cacheThrough, tenantCacheKey } from '@cms/cache';
import { generateId } from '@cms/utils';

export async function featureFlagRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST / (create flag) ───
  app.post('/', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const body = request.body as {
      key: string;
      name: string;
      description?: string;
      defaultValue: boolean;
      rules?: Array<{ scope: string; scopeValue: string; value: boolean; percentage?: number }>;
    };

    if (!body.key || !body.name) throw new ValidationError('key and name are required');

    const db = getDatabase();

    const existing = await db('feature_flags').where({ tenant_id: user.tenantId, key: body.key }).first();
    if (existing) throw new ValidationError('Feature flag with this key already exists');

    const result = await withTransaction(async (trx) => {
      const flagId = generateId();

      const [flag] = await trx('feature_flags')
        .insert({
          id: flagId,
          tenant_id: user.tenantId,
          key: body.key,
          name: body.name,
          description: body.description || null,
          is_enabled: body.defaultValue,
          created_by: user.userId,
        })
        .returning('*');

      if (body.rules?.length) {
        for (const rule of body.rules) {
          await trx('feature_flag_rules').insert({
            feature_flag_id: flagId,
            scope: rule.scope,
            scope_value: rule.scopeValue,
            value: rule.value,
            percentage: rule.percentage || null,
          });
        }
      }

      return flag;
    });

    return reply.status(201).send({ flag: result });
  });

  // ─── GET / (list flags) ───
  app.get('/', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const flags = await db('feature_flags')
      .where({ tenant_id: user.tenantId })
      .orderBy('key');

    return { flags };
  });

  // ─── GET /evaluate (evaluate flags for context) ───
  app.get('/evaluate', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const query = request.query as Record<string, string>;

    return cacheThrough(tenantCacheKey(user.tenantId, 'features', `eval_${user.userId}`), 60, async () => {
      const db = getDatabase();

      const flags = await db('feature_flags')
        .where({ tenant_id: user.tenantId })
        .select('id', 'key', 'is_enabled');

      const rules = await db('feature_flag_rules')
        .whereIn('feature_flag_id', flags.map((f: any) => f.id));

      const evaluated: Record<string, boolean> = {};

      for (const flag of flags) {
        let value = flag.is_enabled;

        // Check rules for this flag
        const flagRules = rules.filter((r: any) => r.feature_flag_id === flag.id);
        for (const rule of flagRules) {
          if (rule.scope === 'user' && rule.scope_value === user.userId) {
            value = rule.value;
            break;
          }
          if (rule.scope === 'role' && user.roles?.includes(rule.scope_value)) {
            value = rule.value;
          }
          if (rule.scope === 'tenant' && rule.scope_value === user.tenantId) {
            value = rule.value;
          }
          if (rule.scope === 'percentage' && rule.percentage) {
            // Deterministic percentage based on user ID
            const hash = simpleHash(user.userId + flag.key);
            value = (hash % 100) < rule.percentage;
          }
        }

        // Check overrides
        const override = await db('feature_flag_overrides')
          .where({ feature_flag_id: flag.id, user_id: user.userId })
          .first();

        if (override) value = override.value;

        evaluated[flag.key] = value;
      }

      return { flags: evaluated };
    });
  });

  // ─── PATCH /:id (toggle flag) ───
  app.patch<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const body = request.body as { isEnabled?: boolean; name?: string; description?: string };
    const db = getDatabase();

    const updateData: Record<string, unknown> = { updated_at: new Date() };
    if (body.isEnabled !== undefined) updateData.is_enabled = body.isEnabled;
    if (body.name) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;

    const [updated] = await db('feature_flags')
      .where({ id, tenant_id: user.tenantId })
      .update(updateData)
      .returning('*');

    if (!updated) throw new NotFoundError('Feature flag', id);

    await cacheDel(tenantCacheKey(user.tenantId, 'features', `eval_${user.userId}`));

    return reply.send({ flag: updated });
  });

  // ─── DELETE /:id ───
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    await withTransaction(async (trx) => {
      await trx('feature_flag_overrides').where({ feature_flag_id: id }).delete();
      await trx('feature_flag_rules').where({ feature_flag_id: id }).delete();
      await trx('feature_flags').where({ id, tenant_id: user.tenantId }).delete();
    });

    return reply.status(204).send();
  });

  // ─── PUT /:id/rules ───
  app.put<{ Params: { id: string } }>('/:id/rules', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const { rules } = request.body as {
      rules: Array<{ scope: string; scopeValue: string; value: boolean; percentage?: number }>;
    };
    const db = getDatabase();

    const flag = await db('feature_flags').where({ id, tenant_id: user.tenantId }).first();
    if (!flag) throw new NotFoundError('Feature flag', id);

    await withTransaction(async (trx) => {
      await trx('feature_flag_rules').where({ feature_flag_id: id }).delete();
      for (const rule of rules) {
        await trx('feature_flag_rules').insert({
          feature_flag_id: id,
          scope: rule.scope,
          scope_value: rule.scopeValue,
          value: rule.value,
          percentage: rule.percentage || null,
        });
      }
    });

    return reply.send({ message: 'Rules updated' });
  });
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
