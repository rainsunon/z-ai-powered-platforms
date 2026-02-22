"""
Value Objects - Immutable objects without identity.

Value objects are defined by their attributes rather than their identity.
Two value objects with the same attributes are considered equal.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional
from email_validator import validate_email, EmailNotValidError


class Jurisdiction(str, Enum):
    """Supported jurisdictions for legal services."""
    USA = "USA"
    CANADA = "Canada"


class CaseStatus(str, Enum):
    """Possible statuses for a legal case."""
    IN_DISCOVERY = "In Discovery"
    ACTIVE = "Active"
    CLOSED = "Closed"
    ARCHIVED = "Archived"


class ActivityType(str, Enum):
    """Types of activities that can be tracked."""
    ALL = "all"
    CHAT = "chat"
    MEETING = "meeting"
    EMAIL = "email"
    NOTIFICATION = "notification"
    PAYMENT = "payment"


class MessageRole(str, Enum):
    """Roles for chat messages."""
    USER = "user"
    ASSISTANT = "assistant"


class SubscriptionStatus(str, Enum):
    """Possible statuses for a subscription."""
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PENDING = "pending"


class BillingCycle(str, Enum):
    """Billing cycle options for subscriptions."""
    MONTHLY = "monthly"
    YEARLY = "yearly"


class StatusType(str, Enum):
    """Types for activity status indicators."""
    SUCCESS = "success"
    WARNING = "warning"
    INFO = "info"
    ERROR = "error"


@dataclass(frozen=True)
class Email:
    """Value object representing an email address."""
    value: str

    def __post_init__(self):
        """Validate email format."""
        try:
            validated = validate_email(self.value)
            object.__setattr__(self, 'value', validated.email.lower())
        except EmailNotValidError as e:
            raise ValueError(f"Invalid email address: {e}")

    def __str__(self) -> str:
        return self.value

    @property
    def domain(self) -> str:
        """Extract domain from email."""
        return self.value.split('@')[1]


@dataclass(frozen=True)
class Rating:
    """Value object representing a rating (0.0 to 5.0)."""
    value: float

    def __post_init__(self):
        """Validate rating range."""
        if not 0.0 <= self.value <= 5.0:
            raise ValueError("Rating must be between 0.0 and 5.0")

    def __str__(self) -> str:
        return f"{self.value:.1f}"

    @property
    def stars(self) -> str:
        """Return star representation."""
        full_stars = int(self.value)
        half_star = 1 if self.value - full_stars >= 0.5 else 0
        empty_stars = 5 - full_stars - half_star
        return "★" * full_stars + ("½" if half_star else "") + "☆" * empty_stars


@dataclass(frozen=True)
class Money:
    """Value object representing monetary amounts."""
    amount: float
    currency: str = "USD"

    def __post_init__(self):
        """Validate amount."""
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")

    def __str__(self) -> str:
        return f"${self.amount:.2f} {self.currency}"

    def __add__(self, other: 'Money') -> 'Money':
        """Add two Money objects."""
        if self.currency != other.currency:
            raise ValueError("Cannot add Money with different currencies")
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other: 'Money') -> 'Money':
        """Subtract two Money objects."""
        if self.currency != other.currency:
            raise ValueError("Cannot subtract Money with different currencies")
        return Money(self.amount - other.amount, self.currency)

    def __mul__(self, multiplier: float) -> 'Money':
        """Multiply Money by a scalar."""
        return Money(self.amount * multiplier, self.currency)

    @property
    def in_cents(self) -> int:
        """Return amount in cents."""
        return int(self.amount * 100)


@dataclass(frozen=True)
class Percentage:
    """Value object representing a percentage (0.0 to 100.0)."""
    value: float

    def __post_init__(self):
        """Validate percentage range."""
        if not 0.0 <= self.value <= 100.0:
            raise ValueError("Percentage must be between 0.0 and 100.0")

    def __str__(self) -> str:
        return f"{self.value:.1f}%"

    @property
    def as_decimal(self) -> float:
        """Return percentage as decimal (0.0 to 1.0)."""
        return self.value / 100.0


@dataclass(frozen=True)
class MatchScore:
    """Value object representing an AI-calculated match score."""
    value: float

    def __post_init__(self):
        """Validate match score range."""
        if not 0.0 <= self.value <= 100.0:
            raise ValueError("Match score must be between 0.0 and 100.0")

    def __str__(self) -> str:
        return f"{self.value:.0f}%"

    @property
    def is_high_match(self) -> bool:
        """Check if this is a high match (>= 90%)."""
        return self.value >= 90.0

    @property
    def is_medium_match(self) -> bool:
        """Check if this is a medium match (>= 70% and < 90%)."""
        return 70.0 <= self.value < 90.0

    @property
    def is_low_match(self) -> bool:
        """Check if this is a low match (< 70%)."""
        return self.value < 70.0


@dataclass(frozen=True)
class FileSize:
    """Value object representing a file size."""
    bytes: int

    def __post_init__(self):
        """Validate file size."""
        if self.bytes < 0:
            raise ValueError("File size cannot be negative")

    def __str__(self) -> str:
        """Return human-readable file size."""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if self.bytes < 1024.0:
                return f"{self.bytes:.1f} {unit}"
            self.bytes /= 1024.0
        return f"{self.bytes:.1f} PB"

    @property
    def in_megabytes(self) -> float:
        """Return size in megabytes."""
        return self.bytes / (1024 * 1024)

    @property
    def in_kilobytes(self) -> float:
        """Return size in kilobytes."""
        return self.bytes / 1024
