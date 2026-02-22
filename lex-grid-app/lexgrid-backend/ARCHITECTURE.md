# LexGrid Backend Architecture

## Overview

This document provides a comprehensive overview of the LexGrid Backend API architecture, which implements Domain-Driven Design (DDD) and Hexagonal Architecture principles.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Interface Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Auth       │  │   Users      │  │   Lawyers    │ │
│  │   Router     │  │   Router     │  │   Router     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Cases      │  │   Chat       │  │   Laws       │ │
│  │   Router     │  │   Router     │  │   Router     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Billing    │  │ Activities   │  │ Documents    │ │
│  │   Router     │  │   Router     │  │   Router     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Use Cases (Orchestrators)            │  │
│  │  • LoginUserUseCase                                 │  │
│  │  • RegisterUserUseCase                               │  │
│  │  • GetLawyersUseCase                                │  │
│  │  • SendMessageUseCase                                 │  │
│  │  • ... (20+ use cases)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              DTOs (Data Transfer Objects)            │  │
│  │  • LoginRequest, LoginResponse                        │  │
│  │  • LawyerResponse, LawyerFilters                      │  │
│  │  • PaginatedResponse[T]                               │  │
│  │  • ... (30+ DTOs)                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Entities (Business Objects)               │  │
│  │  • User, Lawyer, Case, Activity                     │  │
│  │  • Message, Subscription, Law, Document             │  │
│  │  • Conversation                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Value Objects (Immutable)                   │  │
│  │  • Email, Jurisdiction, Rating, Money               │  │
│  │  • CaseStatus, ActivityType, MessageRole             │  │
│  │  • SubscriptionStatus, BillingCycle                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Aggregates (Consistency Boundaries)        │  │
│  │  • UserAggregate (User + Cases + Activities)         │  │
│  │  • CaseAggregate (Case + Documents)                  │  │
│  │  • ConversationAggregate (Conversation + Messages)       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Repository Interfaces (Contracts)               │  │
│  │  • UserRepository, LawyerRepository                   │  │
│  │  • CaseRepository, ActivityRepository                 │  │
│  │  • ... (9 repository interfaces)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Repository Implementations (SQLAlchemy)          │  │
│  │  • UserRepositoryImpl, LawyerRepositoryImpl           │  │
│  │  • CaseRepositoryImpl, ActivityRepositoryImpl         │  │
│  │  • ... (9 repository implementations)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Database Models (SQLAlchemy)              │  │
│  │  • UserModel, LawyerModel, CaseModel                 │  │
│  │  • ActivityModel, MessageModel, SubscriptionModel      │  │
│  │  • ... (9 database models)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              External Services                          │  │
│  │  • PostgreSQL (Database)                              │  │
│  │  • Redis (Cache)                                     │  │
│  │  • OpenAI (AI Service - Optional)                    │  │
│  │  • Stripe (Payment - Optional)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
lexgrid-backend/
├── alembic/                          # Database migrations
│   ├── env.py                         # Alembic environment
│   ├── script.py.mako                  # Migration template
│   └── versions/                       # Migration files
│       └── 001_initial_schema.py       # Initial schema
├── docker/                             # Docker configurations
│   ├── Dockerfile                      # Multi-stage build
│   ├── nginx.conf                      # Nginx reverse proxy
│   └── prometheus.yml                 # Prometheus config
├── src/
│   ├── domain/                         # Domain Layer (Pure business logic)
│   │   ├── __init__.py
│   │   ├── entities.py                  # Domain entities
│   │   ├── value_objects.py             # Value objects
│   │   ├── aggregates.py               # Aggregates
│   │   └── repository_interfaces.py     # Repository contracts
│   ├── application/                    # Application Layer (Use cases)
│   │   ├── __init__.py
│   │   ├── dto.py                      # Data transfer objects
│   │   └── use_cases.py                # Use case implementations
│   ├── infrastructure/                 # Infrastructure Layer (External concerns)
│   │   ├── __init__.py
│   │   ├── config.py                   # Configuration management
│   │   ├── security.py                 # Password hashing & JWT
│   │   ├── cache.py                    # Redis cache service
│   │   ├── database/
│   │   │   ├── base.py              # SQLAlchemy base & engine
│   │   │   ├── session.py           # Session manager
│   │   │   └── models.py            # Database models
│   │   └── repositories.py            # Repository implementations
│   └── interface/                      # Interface Layer (HTTP controllers)
│       ├── __init__.py
│       ├── main.py                     # FastAPI app entry point
│       ├── dependencies.py              # Dependency injection
│       ├── middleware.py               # Custom middleware
│       └── routers/                    # API route handlers
│           ├── __init__.py
│           ├── auth.py                 # Authentication routes
│           ├── users.py                # User management routes
│           ├── lawyers.py              # Lawyer directory routes
│           ├── cases.py                # Case management routes
│           ├── chat.py                 # AI chat routes
│           ├── laws.py                 # Law search routes
│           ├── billing.py              # Billing & subscription routes
│           ├── activities.py           # Activity tracking routes
│           └── documents.py             # Document management routes
├── tests/                             # Test suite (not implemented)
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── alembic.ini                        # Alembic configuration
├── docker-compose.yml                   # Docker orchestration
├── requirements.txt                     # Python dependencies
└── README.md                          # Project documentation
```

## Domain Layer

### Entities

Core business objects with identity:

- **User**: Platform users with authentication and profile
- **Lawyer**: Legal professionals in the directory
- **Case**: Legal cases managed by users
- **Activity**: User activity logs
- **Message**: AI chat messages
- **Subscription**: User billing plans
- **Law**: Legal statutes and regulations
- **Document**: Uploaded legal documents
- **Conversation**: AI chat sessions

### Value Objects

Immutable objects without identity:

- **Email**: Validated email address
- **Jurisdiction**: USA or Canada
- **Rating**: 0.0 to 5.0 rating
- **Money**: Monetary amount with currency
- **CaseStatus**: In Discovery, Active, Closed, Archived
- **ActivityType**: chat, meeting, email, notification, payment
- **MessageRole**: user or assistant
- **SubscriptionStatus**: active, cancelled, expired, pending
- **BillingCycle**: monthly or yearly

### Aggregates

Consistency boundaries around entities:

- **UserAggregate**: User + Cases + Activities
- **CaseAggregate**: Case + Documents + Activities
- **ConversationAggregate**: Conversation + Messages

### Repository Interfaces

Contracts for data access:

- **UserRepository**: User CRUD operations
- **LawyerRepository**: Lawyer search and filtering
- **CaseRepository**: Case management
- **ActivityRepository**: Activity tracking
- **MessageRepository**: Chat message storage
- **SubscriptionRepository**: Billing management
- **LawRepository**: Legal statute search
- **DocumentRepository**: File upload management
- **ConversationRepository**: Chat session management

## Application Layer

### Use Cases

Application-specific business logic orchestrators:

**Authentication:**
- LoginUserUseCase
- RegisterUserUseCase
- RefreshTokenUseCase
- LogoutUserUseCase

**User Management:**
- GetUserUseCase
- UpdateUserUseCase
- DeleteUserUseCase

**Lawyer Directory:**
- GetLawyersUseCase
- GetLawyerByIdUseCase
- SearchLawyersUseCase
- CreateLawyerUseCase
- UpdateLawyerUseCase
- DeleteLawyerUseCase

**Case Management:**
- GetCasesUseCase
- GetCaseByIdUseCase
- CreateCaseUseCase
- UpdateCaseUseCase
- DeleteCaseUseCase

**AI Chat:**
- GetConversationsUseCase
- GetConversationByIdUseCase
- CreateConversationUseCase
- SendMessageUseCase
- GetMessagesUseCase

**Law Search:**
- SearchLawsUseCase
- GetLawByIdUseCase
- GetLawsByJurisdictionUseCase

**Billing:**
- GetPlansUseCase
- GetSubscriptionUseCase
- SubscribeToPlanUseCase
- CancelSubscriptionUseCase
- GetInvoicesUseCase

**Activity Tracking:**
- GetActivitiesUseCase
- CreateActivityUseCase

**Document Management:**
- UploadDocumentUseCase
- GetDocumentUseCase
- DeleteDocumentUseCase

### DTOs

Data transfer objects for API communication:

- **Auth DTOs**: LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest
- **User DTOs**: UserResponse, UserUpdateRequest
- **Lawyer DTOs**: LawyerResponse, LawyerCreateRequest, LawyerUpdateRequest, LawyerFilters
- **Case DTOs**: CaseResponse, CaseCreateRequest, CaseUpdateRequest
- **Chat DTOs**: ConversationResponse, MessageResponse, MessageCreateRequest
- **Law DTOs**: LawResponse, LawSearchRequest
- **Billing DTOs**: PlanResponse, SubscriptionResponse, SubscribeRequest
- **Activity DTOs**: ActivityResponse, ActivityCreateRequest
- **Document DTOs**: DocumentResponse, DocumentUploadResponse
- **Common DTOs**: PaginatedResponse[T], ErrorResponse, HealthResponse

## Infrastructure Layer

### Database

**PostgreSQL** with SQLAlchemy 2.0 async:

- **Engine**: Async connection pooling
- **Session**: Async session management
- **Models**: ORM mappings for all entities
- **Migrations**: Alembic for schema versioning

### Cache

**Redis** for performance optimization:

- **CacheService**: Async Redis client
- **Operations**: get, set, delete, exists, increment, etc.
- **TTL**: Configurable cache expiration
- **Pattern matching**: Bulk operations support

### Security

**Password Hashing** with bcrypt:
- **PasswordHasher**: Hash and verify passwords
- **Rounds**: 12 bcrypt rounds

**JWT Tokens** with python-jose:
- **JWTService**: Create and validate tokens
- **Access Tokens**: 30 minutes expiration
- **Refresh Tokens**: 7 days expiration
- **Claims**: Subject, expiration, issued at, type

### Configuration

**Pydantic Settings** for type-safe configuration:

- **Environment Variables**: Loaded from .env
- **Validation**: Type checking and defaults
- **Profiles**: Development, Production, Testing

## Interface Layer

### Routers

FastAPI route handlers organized by domain:

**Authentication** (`/api/v1/auth`):
- `POST /login` - User login
- `POST /register` - User registration
- `POST /refresh` - Refresh token
- `POST /logout` - User logout
- `GET /me` - Get current user

**Users** (`/api/v1/users`):
- `GET /me` - Get my profile
- `PUT /me` - Update my profile
- `GET /{user_id}` - Get user by ID
- `DELETE /{user_id}` - Delete user (admin)

**Lawyers** (`/api/v1/lawyers`):
- `GET /` - List lawyers with filters
- `GET /search` - Search lawyers
- `GET /{lawyer_id}` - Get lawyer by ID
- `POST /` - Create lawyer (admin)
- `PUT /{lawyer_id}` - Update lawyer (admin)
- `DELETE /{lawyer_id}` - Delete lawyer (admin)

**Cases** (`/api/v1/cases`):
- `GET /` - List user cases
- `GET /{case_id}` - Get case by ID
- `POST /` - Create case
- `PUT /{case_id}` - Update case
- `DELETE /{case_id}` - Delete case

**Chat** (`/api/v1/chat`):
- `GET /conversations` - List conversations
- `GET /conversations/{id}` - Get conversation
- `POST /conversations` - Create conversation
- `GET /conversations/{id}/messages` - Get messages
- `POST /conversations/{id}/messages` - Send message

**Laws** (`/api/v1/laws`):
- `GET /search` - Search laws
- `GET /jurisdiction/{jurisdiction}` - Get laws by jurisdiction
- `GET /{law_id}` - Get law by ID

**Billing** (`/api/v1/billing`):
- `GET /plans` - List subscription plans
- `GET /subscription` - Get user subscription
- `POST /subscribe` - Subscribe to plan
- `POST /cancel` - Cancel subscription
- `GET /invoices` - List invoices

**Activities** (`/api/v1/activities`):
- `GET /` - List user activities
- `POST /` - Create activity

**Documents** (`/api/v1/documents`):
- `POST /upload` - Upload document
- `GET /{document_id}` - Get document
- `DELETE /{document_id}` - Delete document

### Middleware

- **error_handler**: Global exception handling
- **request_logging_middleware**: Request/response logging
- **timing_middleware**: Request timing measurement
- **RateLimitMiddleware**: Rate limiting (in-memory)

### Dependencies

FastAPI dependency injection:

- **get_current_user**: Get authenticated user
- **get_current_active_user**: Get active user
- **require_admin**: Require admin role
- **get_repository**: Generic repository factory
- **get_cache_service**: Get cache instance
- **get_pagination_params**: Validate pagination

## Technology Stack

### Core Framework
- **Python 3.11+**: Programming language
- **FastAPI**: Web framework
- **Pydantic v2**: Data validation

### Database
- **PostgreSQL 15**: Primary database
- **SQLAlchemy 2.0**: ORM with async support
- **Alembic**: Database migrations
- **asyncpg**: PostgreSQL async driver

### Cache
- **Redis 7**: In-memory cache
- **hiredis**: Redis C client

### Security
- **python-jose**: JWT tokens
- **passlib**: Password hashing (bcrypt)

### Containerization
- **Docker**: Container runtime
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy

### Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization (optional)

## API Endpoints Summary

| Category | Endpoints | Auth Required |
|----------|------------|---------------|
| Authentication | 5 | 0-1 |
| Users | 4 | 1-2 |
| Lawyers | 6 | 0-2 |
| Cases | 5 | 1 |
| Chat | 5 | 1 |
| Laws | 3 | 0 |
| Billing | 6 | 1 |
| Activities | 2 | 1 |
| Documents | 3 | 1 |
| Health | 2 | 0 |
| **Total** | **41** | - |

## Data Schemas

### User Schema
```python
{
    "id": UUID,
    "email": str,
    "name": str,
    "role": str,
    "avatar": str | None,
    "jurisdiction": "USA" | "Canada" | None,
    "is_active": bool,
    "is_verified": bool,
    "created_at": datetime,
    "updated_at": datetime
}
```

### Lawyer Schema
```python
{
    "id": UUID,
    "name": str,
    "specialty": str,
    "jurisdiction": "USA" | "Canada",
    "location": str,
    "rating": float | None,
    "review_count": int,
    "experience": int | None,
    "level": str | None,
    "bar_number": str | None,
    "profile_image": str | None,
    "bio": str | None,
    "is_active": bool,
    "match_score": float | None,
    "created_at": datetime,
    "updated_at": datetime
}
```

### Case Schema
```python
{
    "id": UUID,
    "user_id": UUID,
    "title": str,
    "status": "In Discovery" | "Active" | "Closed" | "Archived",
    "progress": int (0-100),
    "description": str | None,
    "created_at": datetime,
    "updated_at": datetime
}
```

### Message Schema
```python
{
    "id": UUID,
    "conversation_id": UUID,
    "role": "user" | "assistant",
    "content": str,
    "created_at": datetime
}
```

### Activity Schema
```python
{
    "id": UUID,
    "user_id": UUID,
    "type": "chat" | "meeting" | "email" | "notification" | "payment",
    "title": str,
    "description": str | None,
    "status": str | None,
    "status_type": "success" | "warning" | "info" | "error" | None,
    "meta": dict | None,
    "created_at": datetime
}
```

### Subscription Schema
```python
{
    "id": UUID,
    "user_id": UUID,
    "plan_id": str,
    "status": "active" | "cancelled" | "expired" | "pending",
    "billing_cycle": "monthly" | "yearly",
    "amount": float | None,
    "started_at": datetime,
    "ends_at": datetime | None,
    "cancelled_at": datetime | None,
    "created_at": datetime,
    "updated_at": datetime
}
```

### Law Schema
```python
{
    "id": UUID,
    "code": str,
    "title": str,
    "jurisdiction": "USA" | "Canada",
    "summary": str | None,
    "explanation": str | None,
    "tags": list[str] | None,
    "related_cases": list[dict] | None,
    "sources": list[dict] | None,
    "created_at": datetime,
    "updated_at": datetime
}
```

### Document Schema
```python
{
    "id": UUID,
    "user_id": UUID,
    "case_id": UUID | None,
    "name": str,
    "file_path": str,
    "file_size": int,
    "file_type": str,
    "status": "uploaded" | "processing" | "processed" | "error",
    "created_at": datetime
}
```

## Deployment

### Docker Compose Services

1. **postgres**: PostgreSQL 15 database
2. **redis**: Redis 7 cache
3. **api**: FastAPI application
4. **nginx**: Nginx reverse proxy (optional)
5. **prometheus**: Prometheus metrics (optional)
6. **grafana**: Grafana dashboard (optional)

### Environment Variables

See [`.env.example`](.env.example) for all available configuration options.

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd lexgrid-backend

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec api alembic upgrade head

# View logs
docker-compose logs -f api
```

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_user.py
```

### Code Quality

```bash
# Format code
black src/ tests/

# Lint code
flake8 src/ tests/

# Type checking
mypy src/
```

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Architecture Principles

### Domain-Driven Design (DDD)

- **Ubiquitous Language**: Consistent terminology across codebase
- **Bounded Contexts**: Separate modules for different domains
- **Aggregates**: Consistency boundaries around entities
- **Value Objects**: Immutable objects with no identity
- **Domain Events**: Events that occur within the domain

### Hexagonal Architecture

- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Orchestrates domain objects, defines use cases
- **Infrastructure Layer**: External concerns (DB, cache, APIs)
- **Interface Layer**: HTTP controllers, request/response handling

### Dependency Rule

Dependencies point inward:
```
Interface → Application → Domain ← Infrastructure
```

## Security

### Authentication
- JWT-based authentication
- Access tokens: 30 minutes
- Refresh tokens: 7 days
- Bcrypt password hashing (12 rounds)

### Authorization
- Role-based access control
- User ownership verification
- Admin-only endpoints

### Rate Limiting
- 60 requests per minute
- 1000 requests per hour
- Per-IP tracking

## Performance

### Caching Strategy
- Redis for frequently accessed data
- Configurable TTL (default: 1 hour)
- Pattern-based cache invalidation

### Database Optimization
- Connection pooling (20 connections)
- Query optimization with indexes
- Async operations for non-blocking I/O

## Monitoring

### Metrics
- Request timing
- Error rates
- Database query performance
- Cache hit/miss ratios

### Logging
- Structured JSON logging
- Request ID tracking
- Error stack traces

## Future Enhancements

1. **AI Integration**: OpenAI GPT-4 for chat
2. **Payment Gateway**: Stripe integration
3. **File Storage**: AWS S3 integration
4. **Email Service**: Transactional email sending
5. **Background Jobs**: Celery for async tasks
6. **WebSockets**: Real-time chat updates
7. **GraphQL**: Alternative to REST API
8. **Microservices**: Split into separate services

## License

Copyright © 2024 LexGrid. All rights reserved.
