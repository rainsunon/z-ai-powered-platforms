"""
Database partition handler for CP (Consistency + Partition Tolerance) behavior.

This module provides retry logic and fallback strategies for database operations
during network partitions while maintaining strong consistency.
"""

import asyncio
import logging
from typing import Callable, TypeVar, Optional
from functools import wraps

from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

T = TypeVar('T')


class DatabasePartitionHandler:
    """Handle database partitions with CP behavior."""
    
    @staticmethod
    async def execute_with_retry(
        operation: Callable[[], T],
        max_retries: int = 3,
        retry_delay: float = 1.0,
        backoff_factor: float = 2.0
    ) -> T:
        """
        Execute operation with exponential backoff retry logic.
        
        CP: Retry on partition errors to maintain consistency.
        
        Args:
            operation: The async operation to execute
            max_retries: Maximum number of retry attempts
            retry_delay: Initial delay between retries in seconds
            backoff_factor: Multiplier for exponential backoff
            
        Returns:
            The result of the operation
            
        Raises:
            Exception: The last exception if all retries fail
        """
        last_exception = None
        
        for attempt in range(max_retries):
            try:
                return await operation()
            except Exception as e:
                last_exception = e
                
                if attempt == max_retries - 1:
                    logger.error(
                        f"Operation failed after {max_retries} attempts: {e}"
                    )
                    raise
                
                delay = retry_delay * (backoff_factor ** attempt)
                logger.warning(
                    f"Attempt {attempt + 1} failed, retrying in {delay}s: {e}"
                )
                await asyncio.sleep(delay)
        
        # This should never be reached, but for type safety
        if last_exception:
            raise last_exception
        raise RuntimeError("Unexpected error in retry logic")
    
    @staticmethod
    async def execute_read_only(
        operation: Callable[[], T],
        fallback_to_replica: bool = True
    ) -> T:
        """
        Execute read operation with fallback to replica.
        
        CP: Try primary first, fallback to replica if available.
        
        Args:
            operation: The read operation to execute
            fallback_to_replica: Whether to fallback to replica on failure
            
        Returns:
            The result of the operation
            
        Raises:
            Exception: If operation fails and no fallback is available
        """
        try:
            return await operation()
        except Exception as e:
            if fallback_to_replica:
                logger.warning(f"Primary read failed, trying replica: {e}")
                # In production, this would connect to a read replica
                # For now, we retry the same operation
                try:
                    return await operation()
                except Exception as replica_error:
                    logger.error(f"Replica read also failed: {replica_error}")
                    raise
            raise
    
    @staticmethod
    async def execute_transaction(
        session: AsyncSession,
        operation: Callable[[], T],
        isolation_level: str = "SERIALIZABLE"
    ) -> T:
        """
        Execute operation within a transaction with specified isolation level.
        
        CP: Use strong isolation levels for consistency.
        
        Args:
            session: The database session
            operation: The operation to execute within the transaction
            isolation_level: The transaction isolation level
            
        Returns:
            The result of the operation
        """
        try:
            # Set isolation level
            await session.execute(
                f"SET TRANSACTION ISOLATION LEVEL {isolation_level}"
            )
            
            # Execute operation
            result = await operation()
            
            # Commit transaction
            await session.commit()
            
            return result
        except Exception as e:
            # Rollback on error
            await session.rollback()
            logger.error(f"Transaction failed: {e}")
            raise


def with_retry(
    max_retries: int = 3,
    retry_delay: float = 1.0,
    backoff_factor: float = 2.0
):
    """
    Decorator for adding retry logic to async functions.
    
    Args:
        max_retries: Maximum number of retry attempts
        retry_delay: Initial delay between retries in seconds
        backoff_factor: Multiplier for exponential backoff
        
    Returns:
        Decorated function with retry logic
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await DatabasePartitionHandler.execute_with_retry(
                lambda: func(*args, **kwargs),
                max_retries=max_retries,
                retry_delay=retry_delay,
                backoff_factor=backoff_factor
            )
        return wrapper
    return decorator


def with_transaction(isolation_level: str = "SERIALIZABLE"):
    """
    Decorator for executing functions within a database transaction.
    
    Args:
        isolation_level: The transaction isolation level
        
    Returns:
        Decorated function that executes within a transaction
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract session from kwargs or create new one
            session = kwargs.get('session')
            if session is None:
                raise ValueError("Session must be provided for transaction")
            
            return await DatabasePartitionHandler.execute_transaction(
                session,
                lambda: func(*args, **kwargs),
                isolation_level=isolation_level
            )
        return wrapper
    return decorator
