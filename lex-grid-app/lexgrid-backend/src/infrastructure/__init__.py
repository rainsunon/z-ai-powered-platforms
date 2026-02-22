"""
Infrastructure Layer - External concerns and implementations.

This layer contains:
- Database: SQLAlchemy models and session management
- Repositories: Implementations of domain repository interfaces
- Cache: Redis caching implementation
- External Services: Third-party integrations
- Config: Configuration management
"""

from src.infrastructure.database.base import Base, get_db, engine
from src.infrastructure.database.session import DatabaseSessionManager
from src.infrastructure.database.models import (
    UserModel,
    LawyerModel,
    CaseModel,
    ActivityModel,
    MessageModel,
    SubscriptionModel,
    LawModel,
    DocumentModel,
    ConversationModel,
)

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

from src.infrastructure.cache import CacheService
from src.infrastructure.config import Settings, get_settings

__all__ = [
    # Database
    "Base",
    "get_db",
    "engine",
    "DatabaseSessionManager",
    # Database Models
    "UserModel",
    "LawyerModel",
    "CaseModel",
    "ActivityModel",
    "MessageModel",
    "SubscriptionModel",
    "LawModel",
    "DocumentModel",
    "ConversationModel",
    # Repositories
    "UserRepository",
    "LawyerRepository",
    "CaseRepository",
    "ActivityRepository",
    "MessageRepository",
    "SubscriptionRepository",
    "LawRepository",
    "DocumentRepository",
    "ConversationRepository",
    # Cache
    "CacheService",
    # Config
    "Settings",
    "get_settings",
]
