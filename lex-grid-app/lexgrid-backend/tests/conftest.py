"""
Pytest configuration and fixtures for integration tests.
"""

import asyncio
import os
import pytest
from typing import AsyncGenerator, Generator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from src.interface.main import app
from src.infrastructure.database.base import get_db
from src.infrastructure.database.models import Base
from src.infrastructure.config import get_settings

# Test settings
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://test:test@localhost:5433/lexgrid_test"
)

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

# Create test session factory
TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a new database session for each test.
    
    This fixture creates a fresh database session, runs migrations,
    and cleans up after the test.
    """
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    async with TestSessionLocal() as session:
        yield session
    
    # Clean up - drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async HTTP client for testing.
    
    This fixture overrides the database dependency to use the test session.
    """
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data() -> dict:
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "password": "TestPassword123!",
        "first_name": "Test",
        "last_name": "User",
    }


@pytest.fixture
def test_lawyer_data() -> dict:
    """Sample lawyer data for testing."""
    return {
        "name": "John Doe",
        "specialty": "Family Law",
        "jurisdiction": "California",
        "location": "Los Angeles, CA",
        "rating": 4.5,
        "years_of_experience": 10,
        "hourly_rate": 250.00,
        "bio": "Experienced family law attorney specializing in divorce cases.",
    }


@pytest.fixture
def test_case_data() -> dict:
    """Sample case data for testing."""
    return {
        "title": "Divorce Case",
        "description": "Divorce proceedings for John and Jane Doe",
        "case_type": "Divorce",
        "status": "active",
    }


@pytest.fixture
def test_message_data() -> dict:
    """Sample message data for testing."""
    return {
        "content": "What are the grounds for divorce in California?",
        "role": "user",
    }


@pytest.fixture
async def auth_token(client: AsyncClient, test_user_data: dict) -> str:
    """
    Create a test user and return authentication token.
    
    This fixture registers a new user and returns the access token
    for authenticated requests.
    """
    # Register user
    response = await client.post("/api/v1/auth/register", json=test_user_data)
    assert response.status_code == 201
    
    # Login to get token
    login_data = {
        "email": test_user_data["email"],
        "password": test_user_data["password"],
    }
    response = await client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    
    token_data = response.json()
    return token_data["access_token"]


@pytest.fixture
def auth_headers(auth_token: str) -> dict:
    """Return authorization headers with the test token."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def admin_headers() -> dict:
    """Return authorization headers for admin user."""
    # In a real test, you would create an admin user and get their token
    # For now, return a mock header
    return {"Authorization": "Bearer mock_admin_token"}
