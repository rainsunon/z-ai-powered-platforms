"""
Integration tests for cases endpoints.
"""

import pytest
from httpx import AsyncClient


class TestCasesEndpoints:
    """Test case management endpoints."""

    async def test_list_cases(self, client: AsyncClient, auth_headers: dict):
        """Test listing user's cases."""
        response = await client.get("/api/v1/cases", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data

    async def test_list_cases_unauthorized(self, client: AsyncClient):
        """Test listing cases without authentication."""
        response = await client.get("/api/v1/cases")
        assert response.status_code == 401

    async def test_create_case(self, client: AsyncClient, auth_headers: dict, test_case_data: dict):
        """Test creating a new case."""
        response = await client.post(
            "/api/v1/cases",
            json=test_case_data,
            headers=auth_headers
        )
        assert response.status_code == 201
        
        data = response.json()
        assert "id" in data
        assert data["title"] == test_case_data["title"]
        assert data["case_type"] == test_case_data["case_type"]

    async def test_create_case_unauthorized(self, client: AsyncClient, test_case_data: dict):
        """Test creating a case without authentication."""
        response = await client.post("/api/v1/cases", json=test_case_data)
        assert response.status_code == 401

    async def test_get_case_by_id(self, client: AsyncClient, auth_headers: dict, test_case_data: dict):
        """Test getting a case by ID."""
        # Create a case first
        create_response = await client.post(
            "/api/v1/cases",
            json=test_case_data,
            headers=auth_headers
        )
        case_id = create_response.json()["id"]
        
        # Get the case
        response = await client.get(f"/api/v1/cases/{case_id}", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == case_id
        assert data["title"] == test_case_data["title"]

    async def test_get_case_not_found(self, client: AsyncClient, auth_headers: dict):
        """Test getting a non-existent case."""
        response = await client.get(
            "/api/v1/cases/00000000-0000-0000-0000-000000000000",
            headers=auth_headers
        )
        assert response.status_code == 404

    async def test_get_case_unauthorized(self, client: AsyncClient, auth_headers: dict, test_case_data: dict):
        """Test getting another user's case."""
        # Create a case
        create_response = await client.post(
            "/api/v1/cases",
            json=test_case_data,
            headers=auth_headers
        )
        case_id = create_response.json()["id"]
        
        # Try to access without auth (should fail)
        response = await client.get(f"/api/v1/cases/{case_id}")
        assert response.status_code == 401

    async def test_update_case(self, client: AsyncClient, auth_headers: dict, test_case_data: dict):
        """Test updating a case."""
        # Create a case first
        create_response = await client.post(
            "/api/v1/cases",
            json=test_case_data,
            headers=auth_headers
        )
        case_id = create_response.json()["id"]
        
        # Update the case
        update_data = {
            "title": "Updated Case Title",
            "status": "completed"
        }
        response = await client.put(
            f"/api/v1/cases/{case_id}",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["status"] == update_data["status"]

    async def test_delete_case(self, client: AsyncClient, auth_headers: dict, test_case_data: dict):
        """Test deleting a case."""
        # Create a case first
        create_response = await client.post(
            "/api/v1/cases",
            json=test_case_data,
            headers=auth_headers
        )
        case_id = create_response.json()["id"]
        
        # Delete the case
        response = await client.delete(
            f"/api/v1/cases/{case_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        
        # Verify deletion
        get_response = await client.get(f"/api/v1/cases/{case_id}", headers=auth_headers)
        assert get_response.status_code == 404

    async def test_filter_cases_by_status(self, client: AsyncClient, auth_headers: dict, test_case_data: dict):
        """Test filtering cases by status."""
        # Create cases with different statuses
        active_case = test_case_data.copy()
        active_case["title"] = "Active Case"
        active_case["status"] = "active"
        
        await client.post("/api/v1/cases", json=active_case, headers=auth_headers)
        
        completed_case = test_case_data.copy()
        completed_case["title"] = "Completed Case"
        completed_case["status"] = "completed"
        
        await client.post("/api/v1/cases", json=completed_case, headers=auth_headers)
        
        # Filter by status
        response = await client.get(
            "/api/v1/cases?status=active",
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert all(case["status"] == "active" for case in data["items"])
