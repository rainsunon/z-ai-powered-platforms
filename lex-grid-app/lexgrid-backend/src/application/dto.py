"""
Data Transfer Objects (DTOs) - Objects for data transfer between layers.

DTOs are used to transfer data between the application layer and
the interface layer (API controllers). They provide validation and
serialization for API requests and responses.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Generic, TypeVar
from uuid import UUID
from enum import Enum

from pydantic import BaseModel, EmailStr, Field, validator
from decimal import Decimal


# Generic Type for Paginated Responses
T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper."""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    class Config:
        arbitrary_types_allowed = True


class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    message: str
    details: Optional[dict] = None


# ==================== Auth DTOs ====================

class LoginRequest(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)


class LoginResponse(BaseModel):
    """Response model for successful login."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class RegisterRequest(BaseModel):
    """Request model for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: str = Field(..., min_length=2, max_length=255)
    role: str = Field(default="user")
    jurisdiction: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Request model for token refresh."""
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    """Response model for token refresh."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# ==================== User DTOs ====================

class UserResponse(BaseModel):
    """Response model for user data."""
    id: UUID
    email: str
    name: str
    role: str
    avatar: Optional[str] = None
    jurisdiction: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    """Request model for updating user profile."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    avatar: Optional[str] = None
    jurisdiction: Optional[str] = None


# ==================== Lawyer DTOs ====================

class LawyerResponse(BaseModel):
    """Response model for lawyer data."""
    id: UUID
    name: str
    specialty: str
    jurisdiction: str
    location: str
    rating: Optional[float] = None
    review_count: int
    experience: Optional[int] = None
    level: Optional[str] = None
    bar_number: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool
    match_score: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LawyerCreateRequest(BaseModel):
    """Request model for creating a lawyer."""
    name: str = Field(..., min_length=2, max_length=255)
    specialty: str = Field(..., min_length=2, max_length=255)
    jurisdiction: str = Field(..., regex="^(USA|Canada)$")
    location: str = Field(..., min_length=2, max_length=255)
    rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: int = Field(default=0, ge=0)
    experience: Optional[int] = Field(None, ge=0)
    level: Optional[str] = Field(None, max_length=100)
    bar_number: Optional[str] = Field(None, max_length=100)
    profile_image: Optional[str] = Field(None, max_length=500)
    bio: Optional[str] = None


class LawyerUpdateRequest(BaseModel):
    """Request model for updating a lawyer."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    specialty: Optional[str] = Field(None, min_length=2, max_length=255)
    jurisdiction: Optional[str] = Field(None, regex="^(USA|Canada)$")
    location: Optional[str] = Field(None, min_length=2, max_length=255)
    rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: Optional[int] = Field(None, ge=0)
    experience: Optional[int] = Field(None, ge=0)
    level: Optional[str] = Field(None, max_length=100)
    bar_number: Optional[str] = Field(None, max_length=100)
    profile_image: Optional[str] = Field(None, max_length=500)
    bio: Optional[str] = None
    is_active: Optional[bool] = None


class LawyerFilters(BaseModel):
    """Filters for lawyer search."""
    jurisdiction: Optional[str] = Field(None, regex="^(USA|Canada)$")
    specialty: Optional[str] = None
    location: Optional[str] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)


# ==================== Case DTOs ====================

class CaseResponse(BaseModel):
    """Response model for case data."""
    id: UUID
    user_id: UUID
    title: str
    status: str
    progress: int
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaseCreateRequest(BaseModel):
    """Request model for creating a case."""
    title: str = Field(..., min_length=2, max_length=500)
    description: Optional[str] = None


class CaseUpdateRequest(BaseModel):
    """Request model for updating a case."""
    title: Optional[str] = Field(None, min_length=2, max_length=500)
    status: Optional[str] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    description: Optional[str] = None


# ==================== Chat DTOs ====================

class ConversationResponse(BaseModel):
    """Response model for conversation data."""
    id: UUID
    user_id: UUID
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationCreateRequest(BaseModel):
    """Request model for creating a conversation."""
    title: Optional[str] = Field(None, max_length=500)


class MessageResponse(BaseModel):
    """Response model for message data."""
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreateRequest(BaseModel):
    """Request model for creating a message."""
    content: str = Field(..., min_length=1, max_length=10000)


# ==================== Law DTOs ====================

class LawResponse(BaseModel):
    """Response model for law data."""
    id: UUID
    code: str
    title: str
    jurisdiction: str
    summary: Optional[str] = None
    explanation: Optional[str] = None
    tags: Optional[List[str]] = None
    related_cases: Optional[List[dict]] = None
    sources: Optional[List[dict]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LawSearchRequest(BaseModel):
    """Request model for law search."""
    query: str = Field(..., min_length=2, max_length=500)
    jurisdiction: Optional[str] = Field(None, regex="^(USA|Canada)$")
    limit: int = Field(default=20, ge=1, le=100)


# ==================== Billing DTOs ====================

class PlanResponse(BaseModel):
    """Response model for subscription plan."""
    id: str
    name: str
    monthly_price: Optional[float] = None
    yearly_price: Optional[float] = None
    price: Optional[str] = None
    description: str
    features: List[str]
    current: bool = False
    popular: bool = False


class SubscriptionResponse(BaseModel):
    """Response model for subscription data."""
    id: UUID
    user_id: UUID
    plan_id: str
    status: str
    billing_cycle: str
    amount: Optional[float] = None
    started_at: datetime
    ends_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SubscribeRequest(BaseModel):
    """Request model for subscribing to a plan."""
    plan_id: str
    billing_cycle: str = Field(..., regex="^(monthly|yearly)$")


class InvoiceResponse(BaseModel):
    """Response model for invoice data."""
    id: UUID
    subscription_id: UUID
    amount: Decimal
    status: str
    due_date: datetime
    paid_at: Optional[datetime] = None
    created_at: datetime


# ==================== Activity DTOs ====================

class ActivityResponse(BaseModel):
    """Response model for activity data."""
    id: UUID
    user_id: UUID
    type: str
    title: str
    description: Optional[str] = None
    status: Optional[str] = None
    status_type: Optional[str] = None
    meta: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ActivityCreateRequest(BaseModel):
    """Request model for creating an activity."""
    type: str = Field(..., regex="^(all|chat|meeting|email|notification|payment)$")
    title: str = Field(..., min_length=2, max_length=500)
    description: Optional[str] = None
    status: Optional[str] = None
    status_type: Optional[str] = Field(None, regex="^(success|warning|info|error)$")
    meta: Optional[dict] = None


# ==================== Document DTOs ====================

class DocumentResponse(BaseModel):
    """Response model for document data."""
    id: UUID
    user_id: UUID
    case_id: Optional[UUID] = None
    name: str
    file_path: str
    file_size: int
    file_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentUploadResponse(BaseModel):
    """Response model for document upload."""
    document: DocumentResponse
    message: str = "Document uploaded successfully"


# ==================== Common DTOs ====================

class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str
    version: str
    database: str
    redis: str


# Update forward references
LoginResponse.model_rebuild()
