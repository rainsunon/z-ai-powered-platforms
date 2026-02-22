"""
Cache partition handler for AP (Availability + Partition Tolerance) behavior.

This module provides fast-fail strategies and fallback mechanisms for cache operations
during network partitions while maintaining high availability.
"""

import asyncio
import logging
from typing import Callable, TypeVar, Optional, Any
from functools import wraps

from src.infrastructure.cache import CacheService

logger = logging.getLogger(__name__)

T = TypeVar('T')


class CachePartitionHandler:
    """Handle cache partitions with AP behavior."""
    
    @staticmethod
    async def get_with_fallback(
        cache_service: CacheService,
        key: str,
        fallback_operation: Callable[[], T],
        ttl: int = 300
    ) -> Optional[T]:
        """
        Get from cache with fallback to database.
        
        AP: Fast fail on cache error, use fallback.
        
        Args:
            cache_service: The cache service instance
            key: The cache key
            fallback_operation: The fallback operation to execute
            ttl: Time-to-live for cache updates
            
        Returns:
            The cached value or fallback result
        """
        try:
            value = await cache_service.get(key)
            if value is not None:
                return value
        except Exception as e:
            logger.warning(f"Cache read failed for key '{key}': {e}")
        
        # Fallback to database
        value = await fallback_operation()
        
        # Try to update cache asynchronously (fire and forget)
        try:
            asyncio.create_task(cache_service.set(key, value, ttl))
        except Exception as e:
            logger.warning(f"Cache update failed for key '{key}': {e}")
        
        return value
    
    @staticmethod
    async def set_with_retry(
        cache_service: CacheService,
        key: str,
        value: Any,
        ttl: int = 300,
        max_retries: int = 2
    ) -> bool:
        """
        Set in cache with limited retry.
        
        AP: Limited retry, fail fast for availability.
        
        Args:
            cache_service: The cache service instance
            key: The cache key
            value: The value to cache
            ttl: Time-to-live in seconds
            max_retries: Maximum number of retry attempts
            
        Returns:
            True if successful, False otherwise
        """
        for attempt in range(max_retries):
            try:
                await cache_service.set(key, value, ttl)
                return True
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.warning(
                        f"Cache set failed after {max_retries} attempts for key '{key}': {e}"
                    )
                    return False
                
                await asyncio.sleep(0.1 * (attempt + 1))
        
        return False
    
    @staticmethod
    async def delete_with_retry(
        cache_service: CacheService,
        key: str,
        max_retries: int = 2
    ) -> bool:
        """
        Delete from cache with limited retry.
        
        AP: Limited retry, fail fast for availability.
        
        Args:
            cache_service: The cache service instance
            key: The cache key
            max_retries: Maximum number of retry attempts
            
        Returns:
            True if successful, False otherwise
        """
        for attempt in range(max_retries):
            try:
                await cache_service.delete(key)
                return True
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.warning(
                        f"Cache delete failed after {max_retries} attempts for key '{key}': {e}"
                    )
                    return False
                
                await asyncio.sleep(0.1 * (attempt + 1))
        
        return False
    
    @staticmethod
    async def get_many_with_fallback(
        cache_service: CacheService,
        keys: list[str],
        fallback_operation: Callable[[list[str]], dict[str, Any]],
        ttl: int = 300
    ) -> dict[str, Any]:
        """
        Get multiple keys from cache with fallback.
        
        AP: Fast fail on cache error, use fallback.
        
        Args:
            cache_service: The cache service instance
            keys: List of cache keys
            fallback_operation: The fallback operation to execute
            ttl: Time-to-live for cache updates
            
        Returns:
            Dictionary of key-value pairs
        """
        result = {}
        missing_keys = []
        
        try:
            cached_values = await cache_service.get_many(keys)
            
            for key, value in cached_values.items():
                if value is not None:
                    result[key] = value
                else:
                    missing_keys.append(key)
        except Exception as e:
            logger.warning(f"Cache get_many failed: {e}")
            missing_keys = keys
        
        # Fallback for missing keys
        if missing_keys:
            fallback_values = await fallback_operation(missing_keys)
            result.update(fallback_values)
            
            # Try to update cache asynchronously
            try:
                asyncio.create_task(
                    cache_service.set_many(fallback_values, ttl)
                )
            except Exception as e:
                logger.warning(f"Cache set_many failed: {e}")
        
        return result
    
    @staticmethod
    async def invalidate_pattern(
        cache_service: CacheService,
        pattern: str,
        max_retries: int = 2
    ) -> int:
        """
        Invalidate all keys matching a pattern.
        
        AP: Limited retry, fail fast for availability.
        
        Args:
            cache_service: The cache service instance
            pattern: The key pattern to match
            max_retries: Maximum number of retry attempts
            
        Returns:
            Number of keys invalidated
        """
        for attempt in range(max_retries):
            try:
                return await cache_service.clear_pattern(pattern)
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.warning(
                        f"Cache clear_pattern failed after {max_retries} attempts: {e}"
                    )
                    return 0
                
                await asyncio.sleep(0.1 * (attempt + 1))
        
        return 0


def with_cache_fallback(
    key_func: Callable[..., str],
    ttl: int = 300,
    max_retries: int = 2
):
    """
    Decorator for adding cache fallback to async functions.
    
    Args:
        key_func: Function to generate cache key from arguments
        ttl: Time-to-live for cache entries
        max_retries: Maximum number of retry attempts for cache operations
        
    Returns:
        Decorated function with cache fallback
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_service = kwargs.get('cache_service')
            if cache_service is None:
                # No cache service, execute function directly
                return await func(*args, **kwargs)
            
            # Generate cache key
            cache_key = key_func(*args, **kwargs)
            
            # Try to get from cache with fallback
            return await CachePartitionHandler.get_with_fallback(
                cache_service,
                cache_key,
                lambda: func(*args, **kwargs),
                ttl=ttl
            )
        return wrapper
    return decorator


def with_cache_invalidation(
    key_func: Callable[..., str],
    max_retries: int = 2
):
    """
    Decorator for invalidating cache after function execution.
    
    Args:
        key_func: Function to generate cache key from arguments
        max_retries: Maximum number of retry attempts for cache operations
        
    Returns:
        Decorated function that invalidates cache after execution
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_service = kwargs.get('cache_service')
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Invalidate cache if cache service is available
            if cache_service is not None:
                cache_key = key_func(*args, **kwargs)
                await CachePartitionHandler.delete_with_retry(
                    cache_service,
                    cache_key,
                    max_retries=max_retries
                )
            
            return result
        return wrapper
    return decorator
