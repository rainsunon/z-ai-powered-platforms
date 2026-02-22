"""
Integration tests for lawyers endpoints.
"""

import pytest
from httpx import AsyncClient


class TestLawyersEndpoints:
    """Test lawyer directory endpoints."""

    async def test_list_lawyers(self, client: AsyncClient):
        """Test listing lawyers."""
        response = await client.get("/api/v1/lawyers")
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        assert isinstance(data["items"], list)

    async def test_list_lawyers_with_pagination(self, client: AsyncClient):
        """Test listing lawyers with pagination."""
        response = await client.get("/api/v1/lawyers?page=1&page_size=10")
        assert response.status_code == 200
        
        data = response.json()
        assert data["page"] == 1
        assert data["page_size"] == 10

    async def test_search_lawyers_by_specialty(self, client: AsyncClient):
        """Test searching lawyers by specialty."""
        response = await client.get("/api/v1/lawyers/search?specialty=Family Law")
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)

    async def test_search_lawyers_by_jurisdiction(self, client: AsyncClient):
        """Test searching lawyers by jurisdiction."""
        response = await client.get("/api/v1/lawyers/search?jurisdiction=California")
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data

    async def test_search_lawyers_by_location(self, client: AsyncClient):
        """Test searching lawyers by location."""
        response = await client.get("/api/v1/lawyers/search?location=Los Angeles")
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data

    async def test_search_lawyers_by_rating(self, client: AsyncClient):
        """Test searching lawyers by minimum rating."""
        response = await client.get("/api/v1/lawyers/search?min_rating=4.0")
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data

    async def test_get_lawyer_by_id(self, client: AsyncClient):
        """Test getting a lawyer by ID."""
        # First, list lawyers to get an ID
        list_response = await client.get("/api/v1/lawyers")
        lawyers = list_response.json()["items"]
        
        if lawyers:
            lawyer_id = lawyers[0]["id"]
            response = await client.get(f"/api/v1/lawyers/{lawyer_id}")
            assert response.status_code == 200
            
            data = response.json()
            assert data["id"] == lawyer_id
            assert "name" in data
            assert "specialty" in data

    async def test_get_lawyer_not_found(self, client: AsyncClient):
        """Test getting a non-existent lawyer."""
        response = await client.get("/api/v1/lawyers/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404

    async def test_create_lawyer(self, client: AsyncClient, auth_headers: dict, test_lawyer_data: dict):
        """Test creating a new lawyer."""
        response = await client.post(
            "/api/v1/lawyers",
            json=test_lawyer_data,
            headers=auth_headers
        )
        assert response.status_code == 201
        
        data = response.json()
        assert "id" in data
        assert data["name"] == test_lawyer_data["name"]
        assert data["specialty"] == test_lawyer_data["specialty"]

    async def test_create_lawyer_unauthorized(self, client: AsyncClient, test_lawyer_data: dict):
        """Test creating a lawyer without authentication."""
        response = await client.post("/api/v1/lawyers", json=test_lawyer_data)
        assert response.status_code == 401

    async def test_update_lawyer(self, client: AsyncClient, auth_headers: dict, test_lawyer_data: dict):
        """Test updating a lawyer."""
        # Create a lawyer first
        create_response = await client.post(
            "/api/v1/lawyers",
            json=test_lawyer_data,
            headers=auth_headers
        )
        lawyer_id = create_response.json()["id"]
        
        # Update the lawyer
        update_data = {"bio": "Updated bio for the lawyer."}
        response = await client.put(
            f"/api/v1/lawyers/{lawyer_id}",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["bio"] == update_data["bio"]

    async def test_delete_lawyer(self, client: AsyncClient, auth_headers: dict, test_lawyer_data: dict):
        """Test deleting a lawyer."""
        # Create a lawyer first
        create_response = await client.post(
            "/api/v1/lawyers",
            json=test_lawyer_data,
            headers=auth_headers
        )
        lawyer_id = create_response.json()["id"]
        
        # Delete the lawyer
        response = await client.delete(
            f"/api/v1/lawyers/{lawyer_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        
        # Verify deletion
        get_response = await client.get(f"/api/v1/lawyers/{lawyer_id}")
        assert get_response.status_code == 404
