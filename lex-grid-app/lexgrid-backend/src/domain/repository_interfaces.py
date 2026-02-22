"""
Repository Interfaces - Contracts for data access.

These interfaces define the contracts that infrastructure implementations
must follow. They are part of the domain layer and define what operations
are available for each aggregate root.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

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
    CaseStatus,
    ActivityType,
    SubscriptionStatus,
)


class UserRepository(ABC):
    """Repository interface for User entity."""

    @abstractmethod
    async def save(self, user: User) -> User:
        """Save a user (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, user_id: UUID) -> Optional[User]:
        """Find a user by ID."""
        pass

    @abstractmethod
    async def find_by_email(self, email: Email) -> Optional[User]:
        """Find a user by email."""
        pass

    @abstractmethod
    async def find_all(self, limit: int = 100, offset: int = 0) -> List[User]:
        """Find all users with pagination."""
        pass

    @abstractmethod
    async def delete(self, user_id: UUID) -> bool:
        """Delete a user by ID."""
        pass

    @abstractmethod
    async def exists_by_email(self, email: Email) -> bool:
        """Check if a user with the given email exists."""
        pass


class LawyerRepository(ABC):
    """Repository interface for Lawyer entity."""

    @abstractmethod
    async def save(self, lawyer: Lawyer) -> Lawyer:
        """Save a lawyer (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, lawyer_id: UUID) -> Optional[Lawyer]:
        """Find a lawyer by ID."""
        pass

    @abstractmethod
    async def find_all(
        self,
        jurisdiction: Optional[Jurisdiction] = None,
        specialty: Optional[str] = None,
        location: Optional[str] = None,
        min_rating: Optional[float] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Lawyer]:
        """Find lawyers with optional filters."""
        pass

    @abstractmethod
    async def search(self, query: str, limit: int = 20) -> List[Lawyer]:
        """Search lawyers by name, specialty, or bio."""
        pass

    @abstractmethod
    async def delete(self, lawyer_id: UUID) -> bool:
        """Delete a lawyer by ID."""
        pass

    @abstractmethod
    async def count(self, jurisdiction: Optional[Jurisdiction] = None) -> int:
        """Count lawyers with optional jurisdiction filter."""
        pass


class CaseRepository(ABC):
    """Repository interface for Case entity."""

    @abstractmethod
    async def save(self, case: Case) -> Case:
        """Save a case (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, case_id: UUID) -> Optional[Case]:
        """Find a case by ID."""
        pass

    @abstractmethod
    async def find_by_user_id(
        self,
        user_id: UUID,
        status: Optional[CaseStatus] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Case]:
        """Find cases by user ID with optional status filter."""
        pass

    @abstractmethod
    async def delete(self, case_id: UUID) -> bool:
        """Delete a case by ID."""
        pass

    @abstractmethod
    async def count_by_user_id(self, user_id: UUID) -> int:
        """Count cases for a user."""
        pass


class ActivityRepository(ABC):
    """Repository interface for Activity entity."""

    @abstractmethod
    async def save(self, activity: Activity) -> Activity:
        """Save an activity (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, activity_id: UUID) -> Optional[Activity]:
        """Find an activity by ID."""
        pass

    @abstractmethod
    async def find_by_user_id(
        self,
        user_id: UUID,
        activity_type: Optional[ActivityType] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Activity]:
        """Find activities by user ID with optional type filter."""
        pass

    @abstractmethod
    async def delete(self, activity_id: UUID) -> bool:
        """Delete an activity by ID."""
        pass

    @abstractmethod
    async def delete_old_activities(self, days: int = 90) -> int:
        """Delete activities older than specified days."""
        pass


class MessageRepository(ABC):
    """Repository interface for Message entity."""

    @abstractmethod
    async def save(self, message: Message) -> Message:
        """Save a message (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, message_id: UUID) -> Optional[Message]:
        """Find a message by ID."""
        pass

    @abstractmethod
    async def find_by_conversation_id(
        self,
        conversation_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Message]:
        """Find messages by conversation ID."""
        pass

    @abstractmethod
    async def delete(self, message_id: UUID) -> bool:
        """Delete a message by ID."""
        pass

    @abstractmethod
    async def delete_by_conversation_id(self, conversation_id: UUID) -> int:
        """Delete all messages in a conversation."""
        pass


class SubscriptionRepository(ABC):
    """Repository interface for Subscription entity."""

    @abstractmethod
    async def save(self, subscription: Subscription) -> Subscription:
        """Save a subscription (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, subscription_id: UUID) -> Optional[Subscription]:
        """Find a subscription by ID."""
        pass

    @abstractmethod
    async def find_by_user_id(self, user_id: UUID) -> Optional[Subscription]:
        """Find the active subscription for a user."""
        pass

    @abstractmethod
    async def find_all_by_user_id(self, user_id: UUID) -> List[Subscription]:
        """Find all subscriptions for a user."""
        pass

    @abstractmethod
    async def delete(self, subscription_id: UUID) -> bool:
        """Delete a subscription by ID."""
        pass

    @abstractmethod
    async def find_expiring_subscriptions(self, days: int = 7) -> List[Subscription]:
        """Find subscriptions expiring within specified days."""
        pass


class LawRepository(ABC):
    """Repository interface for Law entity."""

    @abstractmethod
    async def save(self, law: Law) -> Law:
        """Save a law (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, law_id: UUID) -> Optional[Law]:
        """Find a law by ID."""
        pass

    @abstractmethod
    async def find_by_code(self, code: str) -> Optional[Law]:
        """Find a law by code."""
        pass

    @abstractmethod
    async def find_by_jurisdiction(
        self,
        jurisdiction: Jurisdiction,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Law]:
        """Find laws by jurisdiction."""
        pass

    @abstractmethod
    async def search(
        self,
        query: str,
        jurisdiction: Optional[Jurisdiction] = None,
        limit: int = 20,
    ) -> List[Law]:
        """Full-text search for laws."""
        pass

    @abstractmethod
    async def find_by_tags(
        self,
        tags: List[str],
        jurisdiction: Optional[Jurisdiction] = None,
        limit: int = 100,
    ) -> List[Law]:
        """Find laws by tags."""
        pass

    @abstractmethod
    async def delete(self, law_id: UUID) -> bool:
        """Delete a law by ID."""
        pass


class DocumentRepository(ABC):
    """Repository interface for Document entity."""

    @abstractmethod
    async def save(self, document: Document) -> Document:
        """Save a document (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, document_id: UUID) -> Optional[Document]:
        """Find a document by ID."""
        pass

    @abstractmethod
    async def find_by_user_id(
        self,
        user_id: UUID,
        case_id: Optional[UUID] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Document]:
        """Find documents by user ID with optional case filter."""
        pass

    @abstractmethod
    async def find_by_case_id(
        self,
        case_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Document]:
        """Find documents by case ID."""
        pass

    @abstractmethod
    async def delete(self, document_id: UUID) -> bool:
        """Delete a document by ID."""
        pass

    @abstractmethod
    async def delete_by_case_id(self, case_id: UUID) -> int:
        """Delete all documents in a case."""
        pass


class ConversationRepository(ABC):
    """Repository interface for Conversation entity."""

    @abstractmethod
    async def save(self, conversation: Conversation) -> Conversation:
        """Save a conversation (create or update)."""
        pass

    @abstractmethod
    async def find_by_id(self, conversation_id: UUID) -> Optional[Conversation]:
        """Find a conversation by ID."""
        pass

    @abstractmethod
    async def find_by_user_id(
        self,
        user_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Conversation]:
        """Find conversations by user ID."""
        pass

    @abstractmethod
    async def delete(self, conversation_id: UUID) -> bool:
        """Delete a conversation by ID."""
        pass

    @abstractmethod
    async def delete_by_user_id(self, user_id: UUID) -> int:
        """Delete all conversations for a user."""
        pass

    @abstractmethod
    async def count_by_user_id(self, user_id: UUID) -> int:
        """Count conversations for a user."""
        pass
