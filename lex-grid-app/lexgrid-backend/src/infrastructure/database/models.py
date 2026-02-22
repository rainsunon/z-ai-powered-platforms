"""
SQLAlchemy database models.

These models map to database tables and are used by the
repository implementations for data persistence.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.infrastructure.database.base import Base


class UserModel(Base):
    """SQLAlchemy model for User entity."""
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )
    hashed_password: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50))
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    jurisdiction: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    cases: Mapped[List["CaseModel"]] = relationship(
        "CaseModel",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    conversations: Mapped[List["ConversationModel"]] = relationship(
        "ConversationModel",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    activities: Mapped[List["ActivityModel"]] = relationship(
        "ActivityModel",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    documents: Mapped[List["DocumentModel"]] = relationship(
        "DocumentModel",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    subscriptions: Mapped[List["SubscriptionModel"]] = relationship(
        "SubscriptionModel",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class LawyerModel(Base):
    """SQLAlchemy model for Lawyer entity."""
    __tablename__ = "lawyers"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    name: Mapped[str] = mapped_column(String(255))
    specialty: Mapped[str] = mapped_column(String(255), index=True)
    jurisdiction: Mapped[str] = mapped_column(String(50), index=True)
    location: Mapped[str] = mapped_column(String(255))
    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True, index=True)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    experience: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    level: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bar_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    profile_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    match_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class CaseModel(Base):
    """SQLAlchemy model for Case entity."""
    __tablename__ = "cases"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(50), index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    user: Mapped["UserModel"] = relationship("UserModel", back_populates="cases")
    documents: Mapped[List["DocumentModel"]] = relationship(
        "DocumentModel",
        back_populates="case",
        cascade="all, delete-orphan",
    )


class ConversationModel(Base):
    """SQLAlchemy model for Conversation entity."""
    __tablename__ = "conversations"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    title: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    user: Mapped["UserModel"] = relationship("UserModel", back_populates="conversations")
    messages: Mapped[List["MessageModel"]] = relationship(
        "MessageModel",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )


class MessageModel(Base):
    """SQLAlchemy model for Message entity."""
    __tablename__ = "messages"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    conversation_id: Mapped[UUID] = mapped_column(
        ForeignKey("conversations.id", ondelete="CASCADE"),
        index=True,
    )
    role: Mapped[str] = mapped_column(String(50))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    conversation: Mapped["ConversationModel"] = relationship(
        "ConversationModel",
        back_populates="messages",
    )


class ActivityModel(Base):
    """SQLAlchemy model for Activity entity."""
    __tablename__ = "activities"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    type: Mapped[str] = mapped_column(String(50), index=True)
    title: Mapped[str] = mapped_column(String(500))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    meta: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )

    # Relationships
    user: Mapped["UserModel"] = relationship("UserModel", back_populates="activities")


class SubscriptionModel(Base):
    """SQLAlchemy model for Subscription entity."""
    __tablename__ = "subscriptions"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    plan_id: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(50), index=True)
    billing_cycle: Mapped[str] = mapped_column(String(20))
    amount: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    ends_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    user: Mapped["UserModel"] = relationship("UserModel", back_populates="subscriptions")


class LawModel(Base):
    """SQLAlchemy model for Law entity."""
    __tablename__ = "laws"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    code: Mapped[str] = mapped_column(String(100), index=True)
    title: Mapped[str] = mapped_column(String(500))
    jurisdiction: Mapped[str] = mapped_column(String(50), index=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String), nullable=True)
    related_cases: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    sources: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Create GIN index for full-text search on title
    __table_args__ = (
        Index('ix_laws_title_gin', 'title', postgresql_using='gin', postgresql_ops={'title': 'gin_trgm_ops'}),
    )


class DocumentModel(Base):
    """SQLAlchemy model for Document entity."""
    __tablename__ = "documents"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    case_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("cases.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )
    name: Mapped[str] = mapped_column(String(500))
    file_path: Mapped[str] = mapped_column(String(1000))
    file_size: Mapped[int] = mapped_column(Integer)
    file_type: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(50), default="uploaded")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    user: Mapped["UserModel"] = relationship("UserModel", back_populates="documents")
    case: Mapped[Optional["CaseModel"]] = relationship("CaseModel", back_populates="documents")
