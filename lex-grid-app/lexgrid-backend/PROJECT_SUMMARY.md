# LexGrid Backend Project Summary

## Project Overview

This is a comprehensive backend system for the LexGrid American legal AI platform, built with Python 3, FastAPI, PostgreSQL, and Redis, following Domain-Driven Design (DDD) and Hexagonal Architecture principles.

## What Was Built

### 1. Domain Layer (`src/domain/`)
Pure business logic with no external dependencies:

- **Entities** ([`entities.py`](src/domain/entities.py)): 8 core business objects
  - User, Lawyer, Case, Activity, Message, Subscription, Law, Document, Conversation
  
- **Value Objects** ([`value_objects.py`](src/domain/value_objects.py)): 10 immutable objects
  - Email, Jurisdiction, Rating, Money, Percentage, MatchScore, FileSize
  - Enums: CaseStatus, ActivityType, MessageRole, SubscriptionStatus, BillingCycle, StatusType
  
- **Aggregates** ([`aggregates.py`](src/domain/aggregates.py)): 3 consistency boundaries
  - UserAggregate (User + Cases + Activities)
  - CaseAggregate (Case + Documents + Activities)
  - ConversationAggregate (Conversation + Messages)
  
- **Repository Interfaces** ([`repository_interfaces.py`](src/domain/repository_interfaces.py)): 9 contracts
  - UserRepository, LawyerRepository, CaseRepository, ActivityRepository
  - MessageRepository, SubscriptionRepository, LawRepository, DocumentRepository, ConversationRepository

### 2. Application Layer (`src/application/`)
Orchestrates domain objects and defines use cases:

- **DTOs** ([`dto.py`](src/application/dto.py)): 30+ data transfer objects
  - Auth DTOs: LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest
  - User DTOs: UserResponse, UserUpdateRequest
  - Lawyer DTOs: LawyerResponse, LawyerCreateRequest, LawyerUpdateRequest, LawyerFilters
  - Case DTOs: CaseResponse, CaseCreateRequest, CaseUpdateRequest
  - Chat DTOs: ConversationResponse, MessageResponse, MessageCreateRequest
  - Law DTOs: LawResponse, LawSearchRequest
  - Billing DTOs: PlanResponse, SubscriptionResponse, SubscribeRequest
  - Activity DTOs: ActivityResponse, ActivityCreateRequest
  - Document DTOs: DocumentResponse, DocumentUploadResponse
  - Common DTOs: PaginatedResponse[T], ErrorResponse, HealthResponse

- **Use Cases** ([`use_cases.py`](src/application/use_cases.py)): 20+ use case implementations
  - Auth: LoginUserUseCase, RegisterUserUseCase, RefreshTokenUseCase, LogoutUserUseCase
  - Users: GetUserUseCase, UpdateUserUseCase, DeleteUserUseCase
  - Lawyers: GetLawyersUseCase, GetLawyerByIdUseCase, SearchLawyersUseCase, CreateLawyerUseCase, UpdateLawyerUseCase, DeleteLawyerUseCase
  - Cases: GetCasesUseCase, GetCaseByIdUseCase, CreateCaseUseCase, UpdateCaseUseCase, DeleteCaseUseCase
  - Chat: GetConversationsUseCase, GetConversationByIdUseCase, CreateConversationUseCase, SendMessageUseCase, GetMessagesUseCase
  - Laws: SearchLawsUseCase, GetLawByIdUseCase, GetLawsByJurisdictionUseCase
  - Billing: GetPlansUseCase, GetSubscriptionUseCase, SubscribeToPlanUseCase, CancelSubscriptionUseCase, GetInvoicesUseCase
  - Activities: GetActivitiesUseCase, CreateActivityUseCase
  - Documents: UploadDocumentUseCase, GetDocumentUseCase, DeleteDocumentUseCase

### 3. Infrastructure Layer (`src/infrastructure/`)
External concerns and implementations:

- **Configuration** ([`config.py`](src/infrastructure/config.py)): Pydantic-based settings
  - 40+ configuration options with validation
  - Environment-based profiles (development, production, testing)

- **Security** ([`security.py`](src/infrastructure/security.py)): Authentication utilities
  - PasswordHasher: Bcrypt password hashing (12 rounds)
  - JWTService: JWT token creation and validation
  - Access tokens: 30 minutes expiration
  - Refresh tokens: 7 days expiration

- **Database** ([`database/`](src/infrastructure/database/)):
  - [`base.py`](src/infrastructure/database/base.py): SQLAlchemy engine and session management
  - [`session.py`](src/infrastructure/database/session.py): Database session manager
  - [`models.py`](src/infrastructure/database/models.py): 9 SQLAlchemy models with relationships

- **Cache** ([`cache.py`](src/infrastructure/cache.py)): Redis caching service
  - Async Redis client with connection pooling
  - Operations: get, set, delete, exists, increment, get_many, set_many, etc.
  - Pattern-based cache invalidation

- **Repositories** ([`repositories.py`](src/infrastructure/repositories.py)): 9 repository implementations
  - All implement domain repository interfaces
  - SQLAlchemy-based with async operations
  - Entity-to-model and model-to-entity conversion

### 4. Interface Layer (`src/interface/`)
HTTP controllers and API routes:

- **Main Application** ([`main.py`](src/interface/main.py)): FastAPI app entry point
  - Lifespan management for startup/shutdown
  - CORS middleware configuration
  - Prometheus metrics endpoint
  - Health check endpoint
  - Includes all routers

- **Dependencies** ([`dependencies.py`](src/interface/dependencies.py)): FastAPI dependency injection
  - get_current_user: Get authenticated user
  - get_current_active_user: Get active user
  - require_admin: Require admin role
  - get_repository: Generic repository factory
  - get_cache_service: Get cache instance
  - get_pagination_params: Validate pagination

- **Middleware** ([`middleware.py`](src/interface/middleware.py)): Custom middleware
  - error_handler: Global exception handling
  - request_logging_middleware: Request/response logging
  - timing_middleware: Request timing measurement
  - RateLimitMiddleware: Rate limiting (60 req/min)

- **Routers** ([`routers/`](src/interface/routers/)): 8 API route modules
  - [`auth.py`](src/interface/routers/auth.py): 5 authentication endpoints
  - [`users.py`](src/interface/routers/users.py): 4 user management endpoints
  - [`lawyers.py`](src/interface/routers/lawyers.py): 6 lawyer directory endpoints
  - [`cases.py`](src/interface/routers/cases.py): 5 case management endpoints
  - [`chat.py`](src/interface/routers/chat.py): 5 AI chat endpoints
  - [`laws.py`](src/interface/routers/laws.py): 3 law search endpoints
  - [`billing.py`](src/interface/routers/billing.py): 5 billing endpoints
  - [`activities.py`](src/interface/routers/activities.py): 2 activity endpoints
  - [`documents.py`](src/interface/routers/documents.py): 3 document endpoints

### 5. Docker Configuration (`docker/`)
Container orchestration and deployment:

- [`Dockerfile`](docker/Dockerfile): Multi-stage build
  - Stage 1: Builder with dependencies
  - Stage 2: Runtime with minimal image
  - Non-root user for security
  - Health check configuration

- [`docker-compose.yml`](docker-compose.yml): Multi-service orchestration
  - PostgreSQL 15 database
  - Redis 7 cache
  - FastAPI application
  - Nginx reverse proxy (optional)
  - Prometheus metrics (optional)
  - Grafana dashboard (optional)

- [`nginx.conf`](docker/nginx.conf): Nginx configuration
  - Rate limiting
  - Gzip compression
  - Security headers
  - Proxy to API service

- [`prometheus.yml`](docker/prometheus.yml): Prometheus configuration
  - API metrics scraping
  - 15-second scrape interval

### 6. Database Migrations (`alembic/`)
Schema versioning with Alembic:

- [`env.py`](alembic/env.py): Alembic environment configuration
- [`script.py.mako`](alembic/script.py.mako): Migration template
- [`001_initial_schema.py`](alembic/versions/001_initial_schema.py): Initial schema
  - 9 tables: users, lawyers, cases, conversations, messages, activities, subscriptions, laws, documents
  - Proper indexes for performance
  - Foreign key relationships with CASCADE

### 7. Configuration Files
Project configuration and documentation:

- [`.env.example`](.env.example): Environment variables template
  - 40+ configuration options
  - Database, Redis, JWT, CORS, File upload, Rate limiting, etc.

- [`requirements.txt`](requirements.txt): Python dependencies
  - FastAPI, SQLAlchemy, Alembic, Redis, JWT, etc.
  - Development and testing tools

- [`.gitignore`](.gitignore): Git ignore rules
  - Python, IDE, OS, Database, Logs, Uploads

- [`README.md`](README.md): Project documentation
  - Architecture overview
  - Tech stack
  - API endpoints
  - Quick start guide

- [`ARCHITECTURE.md`](ARCHITECTURE.md): Detailed architecture documentation
  - Architecture diagram
  - Project structure
  - Layer descriptions
  - Data schemas
  - Deployment guide

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

All schemas match the frontend TypeScript interfaces:

1. **User**: id, email, name, role, avatar, jurisdiction, is_active, is_verified
2. **Lawyer**: id, name, specialty, jurisdiction, location, rating, review_count, experience, level, bar_number, profile_image, bio, is_active, match_score
3. **Case**: id, user_id, title, status, progress, description
4. **Message**: id, conversation_id, role, content, created_at
5. **Activity**: id, user_id, type, title, description, status, status_type, meta
6. **Subscription**: id, user_id, plan_id, status, billing_cycle, amount, started_at, ends_at, cancelled_at
7. **Law**: id, code, title, jurisdiction, summary, explanation, tags, related_cases, sources
8. **Document**: id, user_id, case_id, name, file_path, file_size, file_type, status
9. **Conversation**: id, user_id, title, created_at, updated_at

## Technology Stack

### Core
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

## Architecture Principles

### Domain-Driven Design (DDD)
- **Ubiquitous Language**: Consistent terminology across codebase
- **Bounded Contexts**: Separate modules for different domains
- **Aggregates**: Consistency boundaries around entities
- **Value Objects**: Immutable objects with no identity
- **Repository Pattern**: Data access abstraction

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

## Security Features

### Authentication
- JWT-based authentication
- Access tokens: 30 minutes expiration
- Refresh tokens: 7 days expiration
- Bcrypt password hashing (12 rounds)

### Authorization
- Role-based access control
- User ownership verification
- Admin-only endpoints

### Rate Limiting
- 60 requests per minute
- 1000 requests per hour
- Per-IP tracking

## Performance Features

### Caching
- Redis for frequently accessed data
- Configurable TTL (default: 1 hour)
- Pattern-based cache invalidation

### Database Optimization
- Connection pooling (20 connections)
- Query optimization with indexes
- Async operations for non-blocking I/O

## Quick Start

### Using Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd lexgrid-backend

# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec api alembic upgrade head

# View logs
docker-compose logs -f api
```

### Manual Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start the server
uvicorn src.interface.main:app --reload
```

## API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Metrics**: http://localhost:8000/metrics

## Project Statistics

- **Total Files**: 40+
- **Lines of Code**: 5,000+
- **API Endpoints**: 41
- **Domain Entities**: 9
- **Value Objects**: 10
- **Aggregates**: 3
- **Repository Interfaces**: 9
- **Use Cases**: 20+
- **DTOs**: 30+
- **Database Tables**: 9
- **Docker Services**: 6

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
