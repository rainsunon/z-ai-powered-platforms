"""
Domain Aggregates - Consistency boundaries around entities.

Aggregates are clusters of domain objects that can be treated as a unit.
They ensure consistency within their boundaries and are accessed through
a single root entity (the aggregate root).
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from src.domain.entities import (
    User,
    Case,
    Conversation,
    Message,
    Activity,
    Document,
)
from src.domain.value_objects import (
    Email,
    Jurisdiction,
    CaseStatus,
    ActivityType,
    MessageRole,
)


@dataclass
class UserAggregate:
    """
    User Aggregate - Root entity is User.
    
    Manages user-related entities and ensures consistency
    across user profile, cases, activities, and subscriptions.
    """
    user: User
    cases: List[Case] = field(default_factory=list)
    activities: List[Activity] = field(default_factory=list)

    def add_case(self, case: Case) -> None:
        """Add a new case to the user's cases."""
        if case.user_id != self.user.id:
            raise ValueError("Case does not belong to this user")
        self.cases.append(case)

    def remove_case(self, case_id: UUID) -> None:
        """Remove a case from the user's cases."""
        self.cases = [c for c in self.cases if c.id != case_id]

    def get_case(self, case_id: UUID) -> Optional[Case]:
        """Get a specific case by ID."""
        return next((c for c in self.cases if c.id == case_id), None)

    def get_active_cases(self) -> List[Case]:
        """Get all active cases."""
        return [c for c in self.cases if c.status == CaseStatus.ACTIVE]

    def get_closed_cases(self) -> List[Case]:
        """Get all closed cases."""
        return [c for c in self.cases if c.status == CaseStatus.CLOSED]

    def add_activity(self, activity: Activity) -> None:
        """Add a new activity to the user's activities."""
        if activity.user_id != self.user.id:
            raise ValueError("Activity does not belong to this user")
        self.activities.append(activity)

    def get_recent_activities(self, limit: int = 10) -> List[Activity]:
        """Get recent activities, sorted by creation time."""
        sorted_activities = sorted(
            self.activities,
            key=lambda a: a.created_at,
            reverse=True
        )
        return sorted_activities[:limit]

    def get_activities_by_type(self, activity_type: ActivityType) -> List[Activity]:
        """Get activities filtered by type."""
        return [a for a in self.activities if a.type == activity_type]

    def update_profile(self, name: Optional[str] = None, avatar: Optional[str] = None) -> None:
        """Update user profile information."""
        if name:
            self.user.name = name
        if avatar:
            self.user.avatar = avatar

    def change_jurisdiction(self, jurisdiction: Jurisdiction) -> None:
        """Change user's jurisdiction."""
        self.user.jurisdiction = jurisdiction

    def deactivate(self) -> None:
        """Deactivate the user account."""
        self.user.is_active = False

    def activate(self) -> None:
        """Activate the user account."""
        self.user.is_active = True

    def verify(self) -> None:
        """Mark user as verified."""
        self.user.is_verified = True


@dataclass
class CaseAggregate:
    """
    Case Aggregate - Root entity is Case.
    
    Manages case-related entities and ensures consistency
    across case details, documents, and activities.
    """
    case: Case
    documents: List[Document] = field(default_factory=list)
    activities: List[Activity] = field(default_factory=list)

    def add_document(self, document: Document) -> None:
        """Add a document to the case."""
        if document.case_id != self.case.id:
            raise ValueError("Document does not belong to this case")
        self.documents.append(document)

    def remove_document(self, document_id: UUID) -> None:
        """Remove a document from the case."""
        self.documents = [d for d in self.documents if d.id != document_id]

    def get_document(self, document_id: UUID) -> Optional[Document]:
        """Get a specific document by ID."""
        return next((d for d in self.documents if d.id == document_id), None)

    def get_processed_documents(self) -> List[Document]:
        """Get all processed documents."""
        return [d for d in self.documents if d.is_processed()]

    def get_processing_documents(self) -> List[Document]:
        """Get all documents currently being processed."""
        return [d for d in self.documents if d.is_processing()]

    def add_activity(self, activity: Activity) -> None:
        """Add an activity related to the case."""
        self.activities.append(activity)

    def update_progress(self, progress: int) -> None:
        """Update case progress."""
        self.case.update_progress(progress)

    def update_status(self, status: CaseStatus) -> None:
        """Update case status."""
        self.case.update_status(status)

    def close_case(self) -> None:
        """Close the case."""
        self.case.update_status(CaseStatus.CLOSED)
        self.case.update_progress(100)

    def archive_case(self) -> None:
        """Archive the case."""
        self.case.update_status(CaseStatus.ARCHIVED)

    def get_total_document_size(self) -> int:
        """Get total size of all documents in bytes."""
        return sum(d.file_size for d in self.documents)


@dataclass
class ConversationAggregate:
    """
    Conversation Aggregate - Root entity is Conversation.
    
    Manages conversation-related entities and ensures consistency
    across conversation details and messages.
    """
    conversation: Conversation
    messages: List[Message] = field(default_factory=list)

    def add_message(self, message: Message) -> None:
        """Add a message to the conversation."""
        if message.conversation_id != self.conversation.id:
            raise ValueError("Message does not belong to this conversation")
        self.messages.append(message)

    def get_messages(self) -> List[Message]:
        """Get all messages in chronological order."""
        return sorted(self.messages, key=lambda m: m.created_at)

    def get_last_message(self) -> Optional[Message]:
        """Get the most recent message."""
        if not self.messages:
            return None
        return max(self.messages, key=lambda m: m.created_at)

    def get_user_messages(self) -> List[Message]:
        """Get all messages from the user."""
        return [m for m in self.messages if m.is_from_user()]

    def get_assistant_messages(self) -> List[Message]:
        """Get all messages from the assistant."""
        return [m for m in self.messages if m.is_from_assistant()]

    def get_message_count(self) -> int:
        """Get total number of messages."""
        return len(self.messages)

    def update_title(self, title: str) -> None:
        """Update conversation title."""
        self.conversation.update_title(title)

    def generate_title_from_first_message(self) -> None:
        """Generate a title from the first user message."""
        user_messages = self.get_user_messages()
        if user_messages and not self.conversation.title:
            first_message = min(user_messages, key=lambda m: m.created_at)
            # Use first 50 characters of the message as title
            title = first_message.content[:50] + ("..." if len(first_message.content) > 50 else "")
            self.conversation.update_title(title)

    def get_context_for_ai(self, max_messages: int = 10) -> List[dict]:
        """
        Get conversation context for AI processing.
        Returns the most recent messages formatted for AI.
        """
        recent_messages = sorted(
            self.messages,
            key=lambda m: m.created_at,
            reverse=True
        )[:max_messages]

        return [
            {
                "role": m.role.value,
                "content": m.content,
                "timestamp": m.created_at.isoformat()
            }
            for m in reversed(recent_messages)
        ]
