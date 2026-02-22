"""
Interface Layer - HTTP controllers and API routes.

This layer contains:
- Controllers: Handle HTTP requests and responses
- Routes: Define API endpoints
- Dependencies: FastAPI dependency injection
- Middleware: Request/response processing
"""

from src.interface.main import app
from src.interface.dependencies import (
    get_current_user,
    get_current_active_user,
    get_repository,
    get_cache_service,
)
from src.interface.middleware import (
    error_handler,
    request_logging_middleware,
    timing_middleware,
)

__all__ = [
    "app",
    "get_current_user",
    "get_current_active_user",
    "get_repository",
    "get_cache_service",
    "error_handler",
    "request_logging_middleware",
    "timing_middleware",
]
