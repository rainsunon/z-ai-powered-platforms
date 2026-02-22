"""
Redis cache service implementation.

Provides caching functionality using Redis for improved performance.
"""

import json
from typing import Optional, Any
from redis.asyncio import Redis, from_url
from redis.asyncio.connection import ConnectionPool

from src.infrastructure.config import get_settings


class CacheService:
    """Redis-based cache service."""

    def __init__(self):
        self._pool: Optional[ConnectionPool] = None
        self._client: Optional[Redis] = None
        self.settings = get_settings()

    async def connect(self) -> None:
        """Establish connection to Redis."""
        if self._client is None:
            self._pool = ConnectionPool.from_url(
                self.settings.redis_url,
                max_connections=self.settings.redis_max_connections,
                decode_responses=True,
            )
            self._client = Redis(connection_pool=self._pool)

    async def disconnect(self) -> None:
        """Close Redis connection."""
        if self._client:
            await self._client.close()
            self._client = None
        if self._pool:
            await self._pool.disconnect()
            self._pool = None

    async def get(self, key: str) -> Optional[Any]:
        """
        Get a value from cache.
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found
        """
        if not self._client:
            await self.connect()

        value = await self._client.get(key)
        if value is None:
            return None

        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
    ) -> bool:
        """
        Set a value in cache.
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds (default from settings)
            
        Returns:
            True if successful
        """
        if not self._client:
            await self.connect()

        if ttl is None:
            ttl = self.settings.redis_cache_ttl

        try:
            serialized_value = json.dumps(value)
            await self._client.setex(key, ttl, serialized_value)
            return True
        except (TypeError, ValueError):
            # If value can't be serialized, store as string
            await self._client.setex(key, ttl, str(value))
            return True

    async def delete(self, key: str) -> bool:
        """
        Delete a value from cache.
        
        Args:
            key: Cache key
            
        Returns:
            True if key was deleted
        """
        if not self._client:
            await self.connect()

        result = await self._client.delete(key)
        return result > 0

    async def exists(self, key: str) -> bool:
        """
        Check if a key exists in cache.
        
        Args:
            key: Cache key
            
        Returns:
            True if key exists
        """
        if not self._client:
            await self.connect()

        result = await self._client.exists(key)
        return result > 0

    async def expire(self, key: str, ttl: int) -> bool:
        """
        Set expiration time for a key.
        
        Args:
            key: Cache key
            ttl: Time to live in seconds
            
        Returns:
            True if successful
        """
        if not self._client:
            await self.connect()

        result = await self._client.expire(key, ttl)
        return result

    async def ttl(self, key: str) -> int:
        """
        Get remaining time to live for a key.
        
        Args:
            key: Cache key
            
        Returns:
            TTL in seconds, -1 if key exists but has no expiry,
            -2 if key does not exist
        """
        if not self._client:
            await self.connect()

        return await self._client.ttl(key)

    async def increment(self, key: str, amount: int = 1) -> int:
        """
        Increment a numeric value in cache.
        
        Args:
            key: Cache key
            amount: Amount to increment by
            
        Returns:
            New value
        """
        if not self._client:
            await self.connect()

        return await self._client.incrby(key, amount)

    async def decrement(self, key: str, amount: int = 1) -> int:
        """
        Decrement a numeric value in cache.
        
        Args:
            key: Cache key
            amount: Amount to decrement by
            
        Returns:
            New value
        """
        if not self._client:
            await self.connect()

        return await self._client.decrby(key, amount)

    async def get_many(self, keys: list[str]) -> dict[str, Any]:
        """
        Get multiple values from cache.
        
        Args:
            keys: List of cache keys
            
        Returns:
            Dictionary of key-value pairs
        """
        if not self._client:
            await self.connect()

        values = await self._client.mget(keys)
        result = {}

        for key, value in zip(keys, values):
            if value is not None:
                try:
                    result[key] = json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    result[key] = value

        return result

    async def set_many(
        self,
        mapping: dict[str, Any],
        ttl: Optional[int] = None,
    ) -> bool:
        """
        Set multiple values in cache.
        
        Args:
            mapping: Dictionary of key-value pairs
            ttl: Time to live in seconds (default from settings)
            
        Returns:
            True if successful
        """
        if not self._client:
            await self.connect()

        if ttl is None:
            ttl = self.settings.redis_cache_ttl

        pipe = self._client.pipeline()

        for key, value in mapping.items():
            try:
                serialized_value = json.dumps(value)
                pipe.setex(key, ttl, serialized_value)
            except (TypeError, ValueError):
                pipe.setex(key, ttl, str(value))

        await pipe.execute()
        return True

    async def delete_many(self, keys: list[str]) -> int:
        """
        Delete multiple keys from cache.
        
        Args:
            keys: List of cache keys
            
        Returns:
            Number of keys deleted
        """
        if not self._client:
            await self.connect()

        result = await self._client.delete(*keys)
        return result

    async def clear_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching a pattern.
        
        Args:
            pattern: Redis key pattern (e.g., "user:*")
            
        Returns:
            Number of keys deleted
        """
        if not self._client:
            await self.connect()

        keys = []
        async for key in self._client.scan_iter(match=pattern):
            keys.append(key)

        if keys:
            return await self._client.delete(*keys)

        return 0

    async def flush_db(self) -> bool:
        """
        Clear all keys from the current database.
        
        Warning: This is a destructive operation.
        
        Returns:
            True if successful
        """
        if not self._client:
            await self.connect()

        await self._client.flushdb()
        return True

    async def ping(self) -> bool:
        """
        Check if Redis connection is alive.
        
        Returns:
            True if connection is alive
        """
        if not self._client:
            await self.connect()

        result = await self._client.ping()
        return result

    async def get_info(self) -> dict[str, Any]:
        """
        Get Redis server information.
        
        Returns:
            Dictionary with server information
        """
        if not self._client:
            await self.connect()

        info = await self._client.info()
        return info


# Global cache service instance
_cache_service: Optional[CacheService] = None


async def get_cache() -> CacheService:
    """
    Get or create the global cache service instance.
    
    Returns:
        CacheService instance
    """
    global _cache_service

    if _cache_service is None:
        _cache_service = CacheService()
        await _cache_service.connect()

    return _cache_service


async def close_cache() -> None:
    """Close the global cache service connection."""
    global _cache_service

    if _cache_service:
        await _cache_service.disconnect()
        _cache_service = None
