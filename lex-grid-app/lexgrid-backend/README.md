# LexGrid Backend API

A comprehensive backend system for the LexGrid American legal AI platform, built with Python 3, FastAPI, PostgreSQL, and Redis, following Domain-Driven Design (DDD) and Hexagonal Architecture principles.

## Architecture Overview

This project implements a clean architecture with distinct layers:

```
lexgrid-backend/
├── src/
│   ├── domain/           # Domain Layer (Entities, Value Objects, Aggregates)
│   ├── application/       # Application Layer (Use Cases, DTOs, Services)
│   ├── infrastructure/    # Infrastructure Layer (Repositories, DB, Cache)
│   └── interface/         # Interface Layer (Controllers, API Routes)
├── tests/                 # Test suite
├── docker/                # Docker configurations
└── config/                # Configuration files
```

## Tech Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Authentication**: JWT + OAuth2
- **Containerization**: Docker & Docker Compose

## Domain Model

### Core Entities

1. **User** - Platform users with roles and permissions
2. **Lawyer** - Legal professionals in the directory
3. **Case** - Legal cases managed by users
4. **Activity** - User activity logs
5. **Message** - AI chat messages
6. **Subscription** - User billing plans
7. **Law** - Legal statutes and regulations
8. **Document** - Uploaded legal documents

### Value Objects

- Email, Jurisdiction, Rating, Money, etc.

### Aggregates

- UserAggregate (User + Profile + Settings)
- CaseAggregate (Case + Documents + Activities)

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users` - List users (admin)
- `GET /api/v1/users/{id}` - Get user by ID
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Lawyers
- `GET /api/v1/lawyers` - List lawyers with filters
- `GET /api/v1/lawyers/{id}` - Get lawyer details
- `POST /api/v1/lawyers` - Create lawyer (admin)
- `PUT /api/v1/lawyers/{id}` - Update lawyer
- `DELETE /api/v1/lawyers/{id}` - Delete lawyer

### Cases
- `GET /api/v1/cases` - List user cases
- `GET /api/v1/cases/{id}` - Get case details
- `POST /api/v1/cases` - Create new case
- `PUT /api/v1/cases/{id}` - Update case
- `DELETE /api/v1/cases/{id}` - Delete case

### AI Chat
- `GET /api/v1/chat/conversations` - List conversations
- `GET /api/v1/chat/conversations/{id}` - Get conversation
- `POST /api/v1/chat/conversations` - Create conversation
- `POST /api/v1/chat/conversations/{id}/messages` - Send message
- `GET /api/v1/chat/conversations/{id}/messages` - Get messages

### Law Search
- `GET /api/v1/laws` - Search laws
- `GET /api/v1/laws/{id}` - Get law details
- `GET /api/v1/laws/search` - Full-text search

### Billing
- `GET /api/v1/billing/plans` - List subscription plans
- `GET /api/v1/billing/subscription` - Get user subscription
- `POST /api/v1/billing/subscribe` - Subscribe to plan
- `POST /api/v1/billing/cancel` - Cancel subscription
- `GET /api/v1/billing/invoices` - List invoices

### Activities
- `GET /api/v1/activities` - List user activities
- `GET /api/v1/activities/{id}` - Get activity details

### Documents
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents/{id}` - Get document
- `DELETE /api/v1/documents/{id}` - Delete document

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
source venv/bin/activate  # On Windows: venv\Scripts\activate

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

## Environment Variables

```env
# Application
APP_NAME=LexGrid API
APP_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lexgrid
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# Redis
REDIS_URL=redis://localhost:6379/0
REDIS_CACHE_TTL=3600

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# AI Services (Optional)
OPENAI_API_KEY=your-openai-api-key
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

## License

Copyright © 2024 LexGrid. All rights reserved.
