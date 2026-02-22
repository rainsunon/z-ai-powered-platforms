"""
Domain Entities - Core business objects with identity.

Entities are objects that have a distinct identity that runs through
time and different states. They are defined by their identity, not
their attributes.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4

from src.domain.value_objects import (
    Email,
    Jurisdiction,
    Rating,
    CaseStatus,
    ActivityType,
    MessageRole,
    SubscriptionStatus,
    BillingCycle,
)


@dataclass
class BaseEntity:
    """Base class for all entities with common fields."""
    id: UUID = field(default_factory=uuid4)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def __post_init__(self):
        """Ensure created_at and updated_at are timezone-aware."""
        if self.created_at.tzinfo is None:
            self.created_at = self.created_at.replace(tzinfo=None)
        if self.updated_at.tzinfo is None:
            self.updated_at = self.updated_at.replace(tzinfo=None)


@dataclass
class User(BaseEntity):
    """User entity representing platform users."""
    email: Email
    hashed_password: str
    name: str
    role: str
    avatar: Optional[str] = None
    jurisdiction: Optional[Jurisdiction] = None
    is_active: bool = True
    is_verified: bool = False

    def verify_password(self, plain_password: str, hasher) -> bool:
        """Verify if the provided password matches the stored hash."""
        return hasher.verify(plain_password, self.hashed_password)

    def set_password(self, password: str, hasher):
        """Hash and set the user's password."""
        self.hashed_password = hasher.hash(password)


@dataclass
class Lawyer(BaseEntity):
    """Lawyer entity representing legal professionals."""
    name: str
    specialty: str
    jurisdiction: Jurisdiction
    location: str
    rating: Optional[Rating] = None
    review_count: int = 0
    experience: Optional[int] = None  # Years of experience
    level: Optional[str] = None  # e.g., "Senior (15+ yrs)", "Mid-Level (5-15 yrs)"
    bar_number: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool = True
    match_score: Optional[float] = None  # AI-calculated match percentage

    def calculate_match_score(self, criteria: dict) -> float:
        """Calculate match score based on provided criteria."""
        score = 0.0
        total_weight = 0.0

        if 'specialty' in criteria and criteria['specialty'].lower() in self.specialty.lower():
            score += 40
        total_weight += 40

        if 'jurisdiction' in criteria and criteria['jurisdiction'] == self.jurisdiction.value:
            score += 30
        total_weight += 30

        if 'location' in criteria and criteria['location'].lower() in self.location.lower():
            score += 20
        total_weight += 20

        if 'min_rating' in criteria and self.rating and self.rating.value >= criteria['min_rating']:
            score += 10
        total_weight += 10

        self.match_score = (score / total_weight * 100) if total_weight > 0 else 0.0
        return self.match_score


@dataclass
class Case(BaseEntity):
    """Case entity representing legal cases managed by users."""
    user_id: UUID
    title: str
    status: CaseStatus
    progress: int = 0  # 0-100 percentage
    description: Optional[str] = None

    def __post_init__(self):
        super().__post_init__()
        if not 0 <= self.progress <= 100:
            raise ValueError("Progress must be between 0 and 100")

    def update_progress(self, new_progress: int):
        """Update case progress with validation."""
        if not 0 <= new_progress <= 100:
            raise ValueError("Progress must be between 0 and 100")
        self.progress = new_progress
        if new_progress == 100 and self.status != CaseStatus.CLOSED:
            self.status = CaseStatus.CLOSED

    def update_status(self, new_status: CaseStatus):
        """Update case status."""
        self.status = new_status


@dataclass
class Conversation(BaseEntity):
    """Conversation entity for AI chat sessions."""
    user_id: UUID
    title: Optional[str] = None

    def update_title(self, title: str):
        """Update conversation title."""
        self.title = title


@dataclass
class Message(BaseEntity):
    """Message entity for chat messages."""
    conversation_id: UUID
    role: MessageRole
    content: str

    def is_from_user(self) -> bool:
        """Check if message is from user."""
        return self.role == MessageRole.USER

    def is_from_assistant(self) -> bool:
        """Check if message is from assistant."""
        return self.role == MessageRole.ASSISTANT


@dataclass
class Activity(BaseEntity):
    """Activity entity for tracking user actions."""
    user_id: UUID
    type: ActivityType
    title: str
    description: Optional[str] = None
    status: Optional[str] = None
    status_type: Optional[str] = None  # 'success', 'warning', 'info', 'error'
    meta: Optional[dict] = None  # Additional metadata


@dataclass
class Subscription(BaseEntity):
    """Subscription entity for user billing plans."""
    user_id: UUID
    plan_id: str
    status: SubscriptionStatus
    billing_cycle: BillingCycle
    amount: Optional[float] = None
    started_at: datetime = field(default_factory=datetime.utcnow)
    ends_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None

    def is_active(self) -> bool:
        """Check if subscription is currently active."""
        return (
            self.status == SubscriptionStatus.ACTIVE and
            (self.ends_at is None or self.ends_at > datetime.utcnow())
        )

    def cancel(self):
        """Cancel the subscription."""
        self.status = SubscriptionStatus.CANCELLED
        self.cancelled_at = datetime.utcnow()


@dataclass
class Law(BaseEntity):
    """Law entity for legal statutes and regulations."""
    code: str
    title: str
    jurisdiction: Jurisdiction
    summary: Optional[str] = None
    explanation: Optional[str] = None
    tags: Optional[List[str]] = None
    related_cases: Optional[List[dict]] = None
    sources: Optional[List[dict]] = None

    def matches_jurisdiction(self, jurisdiction: Jurisdiction) -> bool:
        """Check if law matches the given jurisdiction."""
        return self.jurisdiction == jurisdiction

    def has_tag(self, tag: str) -> bool:
        """Check if law has a specific tag."""
        return self.tags is not None and tag.lower() in [t.lower() for t in self.tags]


@dataclass
class Document(BaseEntity):
    """Document entity for uploaded legal documents."""
    user_id: UUID
    case_id: Optional[UUID] = None
    name: str
    file_path: str
    file_size: int
    file_type: str
    status: str = "uploaded"  # uploaded, processing, processed, error

    def is_processed(self) -> bool:
        """Check if document has been processed."""
        return self.status == "processed"

    def is_processing(self) -> bool:
        """Check if document is currently being processed."""
        return self.status == "processing"

    def has_error(self) -> bool:
        """Check if document processing resulted in an error."""
        return self.status == "error"
