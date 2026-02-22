"""
Integration tests for authentication endpoints.
"""

import pytest
from httpx import AsyncClient


class TestAuthEndpoints:
    """Test authentication-related endpoints."""

    async def test_register_user(self, client: AsyncClient, test_user_data: dict):
        """Test user registration."""
        response = await client.post("/api/v1/auth/register", json=test_user_data)
        assert response.status_code == 201
        
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == test_user_data["email"]
        assert data["user"]["first_name"] == test_user_data["first_name"]

    async def test_register_duplicate_email(self, client: AsyncClient, test_user_data: dict):
        """Test that duplicate email registration fails."""
        # Register first user
        await client.post("/api/v1/auth/register", json=test_user_data)
        
        # Try to register with same email
        response = await client.post("/api/v1/auth/register", json=test_user_data)
        assert response.status_code == 400

    async def test_register_invalid_email(self, client: AsyncClient):
        """Test registration with invalid email."""
        invalid_data = {
            "email": "invalid-email",
            "password": "TestPassword123!",
            "first_name": "Test",
            "last_name": "User",
        }
        response = await client.post("/api/v1/auth/register", json=invalid_data)
        assert response.status_code == 422

    async def test_register_weak_password(self, client: AsyncClient):
        """Test registration with weak password."""
        weak_data = {
            "email": "test@example.com",
            "password": "weak",
            "first_name": "Test",
            "last_name": "User",
        }
        response = await client.post("/api/v1/auth/register", json=weak_data)
        assert response.status_code == 422

    async def test_login_success(self, client: AsyncClient, test_user_data: dict):
        """Test successful login."""
        # Register user first
        await client.post("/api/v1/auth/register", json=test_user_data)
        
        # Login
        login_data = {
            "email": test_user_data["email"],
            "password": test_user_data["password"],
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_invalid_credentials(self, client: AsyncClient, test_user_data: dict):
        """Test login with invalid credentials."""
        # Register user first
        await client.post("/api/v1/auth/register", json=test_user_data)
        
        # Try to login with wrong password
        login_data = {
            "email": test_user_data["email"],
            "password": "WrongPassword123!",
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401

    async def test_login_nonexistent_user(self, client: AsyncClient):
        """Test login with non-existent user."""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "TestPassword123!",
        }
        response = await client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401

    async def test_refresh_token(self, client: AsyncClient, test_user_data: dict):
        """Test token refresh."""
        # Register and login
        await client.post("/api/v1/auth/register", json=test_user_data)
        login_data = {
            "email": test_user_data["email"],
            "password": test_user_data["password"],
        }
        login_response = await client.post("/api/v1/auth/login", json=login_data)
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh token
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

    async def test_refresh_invalid_token(self, client: AsyncClient):
        """Test refresh with invalid token."""
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid_token"}
        )
        assert response.status_code == 401

    async def test_get_current_user(self, client: AsyncClient, auth_headers: dict):
        """Test getting current user profile."""
        response = await client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert "email" in data
        assert "first_name" in data
        assert "last_name" in data

    async def test_get_current_user_unauthorized(self, client: AsyncClient):
        """Test getting current user without authentication."""
        response = await client.get("/api/v1/auth/me")
        assert response.status_code == 401

    async def test_logout(self, client: AsyncClient, auth_headers: dict):
        """Test logout."""
        response = await client.post("/api/v1/auth/logout", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Successfully logged out"
