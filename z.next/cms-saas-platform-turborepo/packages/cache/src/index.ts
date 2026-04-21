import { createClient, RedisClientType } from 'redis';
import { getLogger, Logger } from '@cms/logger';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

let _client: RedisClientType | null = null;
let _logger: Logger;

export async function createCache(config: CacheConfig): Promise<RedisClientType> {
  _logger = getLogger({ service: 'cache' });

  const url = config.password
    ? `redis://:${config.password}@${config.host}:${config.port}/${config.db ?? 0}`
    : `redis://${config.host}:${config.port}/${config.db ?? 0}`;

  _client = createClient({ url }) as RedisClientType;

  _client.on('error', (err) => _logger.error({ err }, 'Redis error'));
  _client.on('connect', () => _logger.info('Redis connected'));
  _client.on('reconnecting', () => _logger.warn('Redis reconnecting'));

  await _client.connect();
  return _client;
}

export const initCache = createCache;

export function getCache(): RedisClientType {
  if (!_client) {
    throw new Error('Cache not initialized. Call createCache() first.');
  }
  return _client;
}

export async function closeCache(): Promise<void> {
  if (_client) {
    await _client.quit();
    _client = null;
    _logger?.info('Redis connection closed');
  }
}

// ─── Cache Operations ───────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getCache();
  const value = await client.get(key);
  if (!value) return null;
  return JSON.parse(value) as T;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  const client = getCache();
  const serialized = JSON.stringify(value);
  if (ttlSeconds) {
    await client.setEx(key, ttlSeconds, serialized);
  } else {
    await client.set(key, serialized);
  }
}

export async function cacheDel(key: string): Promise<void> {
  const client = getCache();
  await client.del(key);
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  const client = getCache();
  let cursor = 0;
  do {
    const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
    cursor = result.cursor;
    if (result.keys.length > 0) {
      await client.del(result.keys);
    }
  } while (cursor !== 0);
}

export async function cacheExists(key: string): Promise<boolean> {
  const client = getCache();
  const result = await client.exists(key);
  return result === 1;
}

// ─── Cache-Through Pattern ───────────────────────────────────

export async function cacheThrough<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached) return cached;

  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}

// ─── Tenant-Scoped Cache Keys ───────────────────────────────

export function tenantCacheKey(tenantId: string, ...parts: string[]): string {
  return `tenant:${tenantId}:${parts.join(':')}`;
}

export function userCacheKey(userId: string, ...parts: string[]): string {
  return `user:${userId}:${parts.join(':')}`;
}

export function contentCacheKey(tenantId: string, contentId: string): string {
  return `tenant:${tenantId}:content:${contentId}`;
}

// ─── Session Store ───────────────────────────────────

export async function setSession(sessionId: string, data: Record<string, unknown>, ttlSeconds: number = 86400): Promise<void> {
  await cacheSet(`session:${sessionId}`, data, ttlSeconds);
}

export async function getSession(sessionId: string): Promise<Record<string, unknown> | null> {
  return cacheGet(`session:${sessionId}`);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await cacheDel(`session:${sessionId}`);
}

// ─── Health Check ───────────────────────────────────

export async function cacheHealthCheck(): Promise<boolean> {
  try {
    const client = getCache();
    await client.ping();
    return true;
  } catch {
    return false;
  }
}
