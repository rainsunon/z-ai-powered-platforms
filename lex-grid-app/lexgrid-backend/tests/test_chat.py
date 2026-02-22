"""
Integration tests for chat endpoints.
"""

import pytest
from httpx import AsyncClient


class TestChatEndpoints:
    """Test AI chat endpoints."""

    async def test_list_conversations(self, client: AsyncClient, auth_headers: dict):
        """Test listing user's conversations."""
        response = await client.get("/api/v1/chat/conversations", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data
        assert "total" in data

    async def test_list_conversations_unauthorized(self, client: AsyncClient):
        """Test listing conversations without authentication."""
        response = await client.get("/api/v1/chat/conversations")
        assert response.status_code == 401

    async def test_create_conversation(self, client: AsyncClient, auth_headers: dict):
        """Test creating a new conversation."""
        response = await client.post(
            "/api/v1/chat/conversations",
            json={"title": "Legal Consultation"},
            headers=auth_headers
        )
        assert response.status_code == 201
        
        data = response.json()
        assert "id" in data
        assert data["title"] == "Legal Consultation"

    async def test_get_conversation(self, client: AsyncClient, auth_headers: dict):
        """Test getting a conversation by ID."""
        # Create a conversation first
        create_response = await client.post(
            "/api/v1/chat/conversations",
            json={"title": "Test Conversation"},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Get the conversation
        response = await client.get(
            f"/api/v1/chat/conversations/{conversation_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == conversation_id

    async def test_get_messages(self, client: AsyncClient, auth_headers: dict):
        """Test getting messages from a conversation."""
        # Create a conversation first
        create_response = await client.post(
            "/api/v1/chat/conversations",
            json={"title": "Test Conversation"},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Get messages
        response = await client.get(
            f"/api/v1/chat/conversations/{conversation_id}/messages",
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data

    async def test_send_message(self, client: AsyncClient, auth_headers: dict, test_message_data: dict):
        """Test sending a message."""
        # Create a conversation first
        create_response = await client.post(
            "/api/v1/chat/conversations",
            json={"title": "Test Conversation"},
            headers=auth_headers
        )
        conversation_id = create_response.json()["id"]
        
        # Send a message
        response = await client.post(
            f"/api/v1/chat/conversations/{conversation_id}/messages",
            json=test_message_data,
            headers=auth_headers
        )
        assert response.status_code == 201
        
        data = response.json()
        assert "id" in data
        assert data["content"] == test_message_data["content"]
        assert data["role"] == test_message_data["role"]

    async def test_send_message_unauthorized(self, client: AsyncClient, test_message_data: dict):
        """Test sending a message without authentication."""
        response = await client.post(
            "/api/v1/chat/conversations/00000000-0000-0000-0000-000000000000/messages",
            json=test_message_data
        )
        assert response.status_code == 401
