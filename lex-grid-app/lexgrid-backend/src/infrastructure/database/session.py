"""
Database session manager for SQLAlchemy.

Provides a centralized way to manage database sessions
and connections.
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from src.infrastructure.database.base import engine


class DatabaseSessionManager:
    """Manager for database sessions."""

    def __init__(self):
        self.session_factory = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """
        Get a database session.
        
        Yields:
            AsyncSession: Database session
            
        Ensures:
            Session is properly closed after use
        """
        async with self.session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

    async def close(self) -> None:
        """Close all database connections."""
        await engine.dispose()


# Global session manager instance
_session_manager: DatabaseSessionManager = None


def get_session_manager() -> DatabaseSessionManager:
    """
    Get or create the global session manager.
    
    Returns:
        DatabaseSessionManager instance
    """
    global _session_manager

    if _session_manager is None:
        _session_manager = DatabaseSessionManager()

    return _session_manager
