"""
FastAPI dependency injection functions.

Provides dependencies for authentication, database sessions,
repositories, and other services.
"""

from typing import AsyncGenerator, Type, TypeVar
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.database.base import get_db
from src.infrastructure.cache import get_cache
from src.infrastructure.repositories import (
    UserRepository,
    LawyerRepository,
    CaseRepository,
    ActivityRepository,
    MessageRepository,
    SubscriptionRepository,
    LawRepository,
    DocumentRepository,
    ConversationRepository,
)
from src.domain.entities import User
from src.infrastructure.config import get_settings

settings = get_settings()
security = HTTPBearer()

# Generic type for repositories
T = TypeVar("T")


async def get_repository(
    repository_type: Type[T],
    session: AsyncSession = Depends(get_db),
) -> T:
    """
    Get a repository instance.
    
    Args:
        repository_type: Repository class to instantiate
        session: Database session
        
    Returns:
        Repository instance
    """
    return repository_type(session)


async def get_user_repository(
    session: AsyncSession = Depends(get_db),
) -> UserRepository:
    """Get user repository."""
    return UserRepository(session)


async def get_lawyer_repository(
    session: AsyncSession = Depends(get_db),
) -> LawyerRepository:
    """Get lawyer repository."""
    return LawyerRepository(session)


async def get_case_repository(
    session: AsyncSession = Depends(get_db),
) -> CaseRepository:
    """Get case repository."""
    return CaseRepository(session)


async def get_activity_repository(
    session: AsyncSession = Depends(get_db),
) -> ActivityRepository:
    """Get activity repository."""
    return ActivityRepository(session)


async def get_message_repository(
    session: AsyncSession = Depends(get_db),
) -> MessageRepository:
    """Get message repository."""
    return MessageRepository(session)


async def get_subscription_repository(
    session: AsyncSession = Depends(get_db),
) -> SubscriptionRepository:
    """Get subscription repository."""
    return SubscriptionRepository(session)


async def get_law_repository(
    session: AsyncSession = Depends(get_db),
) -> LawRepository:
    """Get law repository."""
    return LawRepository(session)


async def get_document_repository(
    session: AsyncSession = Depends(get_db),
) -> DocumentRepository:
    """Get document repository."""
    return DocumentRepository(session)


async def get_conversation_repository(
    session: AsyncSession = Depends(get_db),
) -> ConversationRepository:
    """Get conversation repository."""
    return ConversationRepository(session)


async def get_cache_service() -> object:
    """Get cache service."""
    return await get_cache()


# ==================== Authentication Dependencies ====================

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UUID:
    """
    Get current user ID from JWT token.
    
    Args:
        credentials: HTTP authorization credentials
        
    Returns:
        User ID from token
        
    Raises:
        HTTPException: If token is invalid
    """
    from src.infrastructure.security import decode_token

    token = credentials.credentials
    payload = decode_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    user_id: UUID = Depends(get_current_user_id),
    user_repository: UserRepository = Depends(get_user_repository),
) -> User:
    """
    Get current authenticated user.
    
    Args:
        user_id: User ID from token
        user_repository: User repository
        
    Returns:
        Current user entity
        
    Raises:
        HTTPException: If user not found
    """
    user = await user_repository.find_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current active user.
    
    Args:
        current_user: Current user from token
        
    Returns:
        Current active user
        
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return current_user


async def require_admin(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Require admin role for access.
    
    Args:
        current_user: Current active user
        
    Returns:
        Current user if admin
        
    Raises:
        HTTPException: If user is not admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


# ==================== Pagination Dependencies ====================

async def get_pagination_params(
    page: int = 1,
    page_size: int = settings.default_page_size,
) -> tuple[int, int]:
    """
    Get and validate pagination parameters.
    
    Args:
        page: Page number
        page_size: Number of items per page
        
    Returns:
        Tuple of (page, page_size)
        
    Raises:
        HTTPException: If parameters are invalid
    """
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Page number must be greater than 0",
        )

    if page_size < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Page size must be greater than 0",
        )

    if page_size > settings.max_page_size:
        page_size = settings.max_page_size

    return page, page_size
