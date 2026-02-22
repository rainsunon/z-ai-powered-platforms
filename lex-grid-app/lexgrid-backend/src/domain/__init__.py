"""
Domain Layer - Contains the core business logic and domain model.

This layer is independent of any external concerns like databases,
web frameworks, or external APIs. It contains:
- Entities: Objects with identity
- Value Objects: Immutable objects without identity
- Aggregates: Consistency boundaries around entities
- Domain Events: Events that occur within the domain
- Repository Interfaces: Contracts for data access
"""

from src.domain.entities import (
    User,
    Lawyer,
    Case,
    Activity,
    Message,
    Subscription,
    Law,
    Document,
    Conversation,
)

from src.domain.value_objects import (
    Email,
    Jurisdiction,
    Rating,
    Money,
    CaseStatus,
    ActivityType,
    MessageRole,
    SubscriptionStatus,
    BillingCycle,
)

from src.domain.aggregates import (
    UserAggregate,
    CaseAggregate,
    ConversationAggregate,
)

from src.domain.repository_interfaces import (
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

__all__ = [
    # Entities
    "User",
    "Lawyer",
    "Case",
    "Activity",
    "Message",
    "Subscription",
    "Law",
    "Document",
    "Conversation",
    # Value Objects
    "Email",
    "Jurisdiction",
    "Rating",
    "Money",
    "CaseStatus",
    "ActivityType",
    "MessageRole",
    "SubscriptionStatus",
    "BillingCycle",
    # Aggregates
    "UserAggregate",
    "CaseAggregate",
    "ConversationAggregate",
    # Repository Interfaces
    "UserRepository",
    "LawyerRepository",
    "CaseRepository",
    "ActivityRepository",
    "MessageRepository",
    "SubscriptionRepository",
    "LawRepository",
    "DocumentRepository",
    "ConversationRepository",
]
