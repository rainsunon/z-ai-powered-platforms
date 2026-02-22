"""
Main FastAPI application entry point.

Configures the FastAPI app with all routes, middleware,
and dependencies.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from uuid import UUID

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from prometheus_client import make_asgi_app

from src.infrastructure.config import get_settings
from src.infrastructure.database.base import init_db, close_db
from src.infrastructure.cache import get_cache, close_cache
from src.application.dto import HealthResponse
from src.interface.dependencies import get_current_user
from src.interface.middleware import (
    error_handler,
    request_logging_middleware,
    timing_middleware,
)

# Import routers
from src.interface.routers import (
    auth_router,
    users_router,
    lawyers_router,
    cases_router,
    chat_router,
    laws_router,
    billing_router,
    activities_router,
    documents_router,
)
from src.interface.routers.health import router as health_router

settings = get_settings()

# Security
security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    await init_db()
    cache = await get_cache()
    await cache.ping()
    print("✅ Database and cache initialized")

    yield

    # Shutdown
    await close_db()
    await close_cache()
    print("✅ Database and cache connections closed")


# Create FastAPI app with enhanced OpenAPI documentation
app = FastAPI(
    title=settings.app_name,
    description="""
# LexGrid American Legal AI Platform API

A comprehensive backend API for the LexGrid American legal AI platform, built with Domain-Driven Design and Hexagonal Architecture principles.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **User Management**: Complete user profile and account management
- **Lawyer Directory**: Search and filter lawyers by jurisdiction, specialty, and rating
- **Case Management**: Create, track, and manage legal cases
- **AI Chat**: Intelligent legal consultation with conversation history
- **Legal Search**: Search and retrieve legal codes and statutes
- **Billing**: Subscription management and invoice tracking
- **Activity Tracking**: Monitor user activities and system events
- **Document Management**: Upload and manage legal documents

## Architecture

The API follows **Domain-Driven Design (DDD)** and **Hexagonal Architecture** principles:

- **Domain Layer**: Pure business logic with entities, value objects, aggregates, and repository interfaces
- **Application Layer**: Use cases orchestrating domain objects
- **Infrastructure Layer**: Database, cache, and external service implementations
- **Interface Layer**: HTTP controllers and API endpoints

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Default**: 60 requests per minute per IP address
- **Authenticated users**: Higher limits based on subscription tier

## Error Handling

The API uses standard HTTP status codes:
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Pagination

List endpoints support pagination using query parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

Response format:
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5
}
```

## Versioning

The API uses URL path versioning: `/api/v1/...`

## Support

For API support, contact: support@lexgrid-american.com
Documentation: https://docs.lexgrid-american.com
GitHub: https://github.com/lexgrid-american/backend
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    contact={
        "name": "LexGrid American Support",
        "email": "support@lexgrid-american.com",
        "url": "https://lexgrid-american.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    openapi_tags=[
        {
            "name": "Health",
            "description": "Health check and system status endpoints",
        },
        {
            "name": "Authentication",
            "description": "User authentication and token management",
        },
        {
            "name": "Users",
            "description": "User profile and account management",
        },
        {
            "name": "Lawyers",
            "description": "Lawyer directory and search functionality",
        },
        {
            "name": "Cases",
            "description": "Legal case management and tracking",
        },
        {
            "name": "Chat",
            "description": "AI-powered legal consultation chat",
        },
        {
            "name": "Laws",
            "description": "Legal code and statute search",
        },
        {
            "name": "Billing",
            "description": "Subscription and billing management",
        },
        {
            "name": "Activities",
            "description": "User activity tracking and logs",
        },
        {
            "name": "Documents",
            "description": "Document upload and management",
        },
    ],
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

# Add custom middleware
app.middleware("http")(request_logging_middleware)
app.middleware("http")(timing_middleware)

# Add exception handler
app.add_exception_handler(Exception, error_handler)

# Add Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


# ==================== Health Check ====================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Returns the status of the application and its dependencies.
    """
    cache = await get_cache()
    cache_status = "healthy" if await cache.ping() else "unhealthy"

    return HealthResponse(
        status="healthy",
        version="1.0.0",
        database="connected",
        redis=cache_status,
    )


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "environment": settings.app_env,
        "docs": "/docs",
        "health": "/health",
    }


# ==================== Include Routers ====================

app.include_router(
    auth_router,
    prefix=f"{settings.api_v1_prefix}/auth",
    tags=["Authentication"],
)

app.include_router(
    users_router,
    prefix=f"{settings.api_v1_prefix}/users",
    tags=["Users"],
    dependencies=[],
)

app.include_router(
    lawyers_router,
    prefix=f"{settings.api_v1_prefix}/lawyers",
    tags=["Lawyers"],
)

app.include_router(
    cases_router,
    prefix=f"{settings.api_v1_prefix}/cases",
    tags=["Cases"],
    dependencies=[],
)

app.include_router(
    chat_router,
    prefix=f"{settings.api_v1_prefix}/chat",
    tags=["Chat"],
    dependencies=[],
)

app.include_router(
    laws_router,
    prefix=f"{settings.api_v1_prefix}/laws",
    tags=["Laws"],
)

app.include_router(
    billing_router,
    prefix=f"{settings.api_v1_prefix}/billing",
    tags=["Billing"],
    dependencies=[],
)

app.include_router(
    activities_router,
    prefix=f"{settings.api_v1_prefix}/activities",
    tags=["Activities"],
    dependencies=[],
)

app.include_router(
    documents_router,
    prefix=f"{settings.api_v1_prefix}/documents",
    tags=["Documents"],
    dependencies=[],
)

# Include health router (no prefix for health endpoints)
app.include_router(health_router)


# ==================== Error Handlers ====================

@app.exception_handler(status.HTTP_404_NOT_FOUND)
async def not_found_handler(request: Request, exc: status.HTTP_404_NOT_FOUND):
    """Handle 404 Not Found errors."""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "error": "Not Found",
            "message": str(exc.detail),
            "path": str(request.url),
        },
    )


@app.exception_handler(status.HTTP_422_UNPROCESSABLE_ENTITY)
async def validation_error_handler(request: Request, exc: status.HTTP_422_UNPROCESSABLE_ENTITY):
    """Handle 422 Validation Error."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "Invalid request data",
            "details": exc.detail,
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.interface.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.is_development,
        workers=settings.workers if settings.is_production else 1,
    )
