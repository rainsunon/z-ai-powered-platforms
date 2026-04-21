import { Knex, knex } from 'knex';
import { getLogger, Logger } from '@cms/logger';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
  poolMin: number;
  poolMax: number;
}

let _db: Knex | null = null;
let _logger: Logger;

export function createDatabase(config: DatabaseConfig): Knex {
  _logger = getLogger({ service: 'database' });

  const db = knex({
    client: 'pg',
    connection: {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
    },
    pool: {
      min: config.poolMin,
      max: config.poolMax,
      afterCreate: (conn: unknown, done: (err: Error | null, conn: unknown) => void) => {
        _logger.debug('New database connection created');
        done(null, conn);
      },
    },
    acquireConnectionTimeout: 10000,
  });

  _db = db;
  return db;
}

export function getDatabase(): Knex {
  if (!_db) {
    throw new Error('Database not initialized. Call createDatabase() first.');
  }
  return _db;
}

export async function closeDatabase(): Promise<void> {
  if (_db) {
    await _db.destroy();
    _db = null;
    _logger?.info('Database connection closed');
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const db = getDatabase();
    await db.raw('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

// ─── Tenant-scoped query builder ───────────────────────────

export function tenantQuery(table: string, tenantId: string): Knex.QueryBuilder {
  const db = getDatabase();
  return db(table).where({ tenant_id: tenantId });
}

// ─── Transaction helper ───────────────────────────────────

export async function withTransaction<T>(
  fn: (trx: Knex.Transaction) => Promise<T>,
): Promise<T> {
  const db = getDatabase();
  return db.transaction(fn);
}

// ─── Pagination helper ───────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function paginate<T>(
  query: Knex.QueryBuilder,
  params: PaginationParams,
): Promise<PaginatedResult<T>> {
  const { page, limit, sortBy = 'created_at', sortOrder = 'desc' } = params;
  const offset = (page - 1) * limit;

  const countQuery = query.clone().count('* as total').first();
  const dataQuery = query.clone().orderBy(sortBy, sortOrder).limit(limit).offset(offset);

  const [countResult, data] = await Promise.all([countQuery, dataQuery]);
  const total = Number((countResult as Record<string, unknown>)?.total ?? 0);
  const totalPages = Math.ceil(total / limit);

  return {
    data: data as T[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export { Knex, knex };
