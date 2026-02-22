"""
Custom middleware for request/response processing.

Includes error handling, request logging, and timing middleware.
"""

import time
import uuid
from typing import Callable

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from src.infrastructure.config import get_settings

settings = get_settings()


async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler.
    
    Args:
        request: Incoming request
        exc: Exception that was raised
        
    Returns:
        JSON response with error details
    """
    import traceback
    from fastapi import status

    # Log the error
    error_id = str(uuid.uuid4())
    print(f"Error [{error_id}]: {str(exc)}")
    print(traceback.format_exc())

    # Determine status code
    if isinstance(exc, ValueError):
        status_code = status.HTTP_400_BAD_REQUEST
        error_type = "Validation Error"
    elif isinstance(exc, PermissionError):
        status_code = status.HTTP_403_FORBIDDEN
        error_type = "Permission Denied"
    elif isinstance(exc, FileNotFoundError):
        status_code = status.HTTP_404_NOT_FOUND
        error_type = "Not Found"
    else:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        error_type = "Internal Server Error"

    # Return error response
    return JSONResponse(
        status_code=status_code,
        content={
            "error": error_type,
            "message": str(exc) if settings.is_development else "An error occurred",
            "error_id": error_id if settings.is_development else None,
            "path": str(request.url),
        },
    )


async def request_logging_middleware(
    request: Request,
    call_next: Callable,
) -> Response:
    """
    Middleware for logging all requests.
    
    Args:
        request: Incoming request
        call_next: Next middleware/route handler
        
    Returns:
        Response from next handler
    """
    # Generate request ID
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    # Log request
    print(f"[{request_id}] {request.method} {request.url.path}")

    # Process request
    response = await call_next(request)

    # Log response
    print(f"[{request_id}] Status: {response.status_code}")

    # Add request ID to response headers
    response.headers["X-Request-ID"] = request_id

    return response


async def timing_middleware(
    request: Request,
    call_next: Callable,
) -> Response:
    """
    Middleware for measuring request processing time.
    
    Args:
        request: Incoming request
        call_next: Next middleware/route handler
        
    Returns:
        Response from next handler with timing header
    """
    start_time = time.time()

    # Process request
    response = await call_next(request)

    # Calculate processing time
    process_time = time.time() - start_time

    # Add timing header
    response.headers["X-Process-Time"] = str(process_time)

    return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware for rate limiting requests.
    
    Simple in-memory rate limiting implementation.
    For production, use Redis-based rate limiting.
    """

    def __init__(self, app: ASGIApp, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.request_counts = {}

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request with rate limiting.
        
        Args:
            request: Incoming request
            call_next: Next middleware/route handler
            
        Returns:
            Response from next handler or rate limit error
        """
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"

        # Get current time
        current_time = time.time()

        # Clean old entries
        self._clean_old_entries(current_time)

        # Get or create entry for this IP
        if client_ip not in self.request_counts:
            self.request_counts[client_ip] = []

        # Check rate limit
        recent_requests = [
            req_time for req_time in self.request_counts[client_ip]
            if current_time - req_time < 60  # Within last minute
        ]

        if len(recent_requests) >= self.requests_per_minute:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate Limit Exceeded",
                    "message": f"Too many requests. Maximum {self.requests_per_minute} requests per minute.",
                },
            )

        # Add current request
        self.request_counts[client_ip].append(current_time)

        # Process request
        return await call_next(request)

    def _clean_old_entries(self, current_time: float) -> None:
        """Clean up old request entries."""
        cutoff_time = current_time - 60  # 1 minute ago

        for ip in list(self.request_counts.keys()):
            self.request_counts[ip] = [
                req_time for req_time in self.request_counts[ip]
                if req_time > cutoff_time
            ]

            # Remove empty entries
            if not self.request_counts[ip]:
                del self.request_counts[ip]
