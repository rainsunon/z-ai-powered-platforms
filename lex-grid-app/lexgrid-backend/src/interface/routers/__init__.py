"""
API Routers - FastAPI route handlers.

This module contains all API route handlers organized by domain.
"""

from src.interface.routers.auth import router as auth_router
from src.interface.routers.users import router as users_router
from src.interface.routers.lawyers import router as lawyers_router
from src.interface.routers.cases import router as cases_router
from src.interface.routers.chat import router as chat_router
from src.interface.routers.laws import router as laws_router
from src.interface.routers.billing import router as billing_router
from src.interface.routers.activities import router as activities_router
from src.interface.routers.documents import router as documents_router

__all__ = [
    "auth_router",
    "users_router",
    "lawyers_router",
    "cases_router",
    "chat_router",
    "laws_router",
    "billing_router",
    "activities_router",
    "documents_router",
]
