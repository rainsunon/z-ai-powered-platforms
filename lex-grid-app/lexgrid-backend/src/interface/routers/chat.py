"""
Chat router - Handles AI chat conversations and messages.
"""

from fastapi import APIRouter, Depends, status, Query

from src.application.dto import (
    ConversationResponse,
    ConversationCreateRequest,
    MessageResponse,
    MessageCreateRequest,
    PaginatedResponse,
)
from src.application.use_cases import (
    GetConversationsUseCase,
    GetConversationByIdUseCase,
    CreateConversationUseCase,
    SendMessageUseCase,
    GetMessagesUseCase,
)
from src.interface.dependencies import (
    get_conversation_repository,
    get_message_repository,
    get_current_active_user,
    get_pagination_params,
)

router = APIRouter()


@router.get("/conversations", response_model=PaginatedResponse[ConversationResponse], status_code=status.HTTP_200_OK)
async def get_conversations(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user=Depends(get_current_active_user),
    conversation_repository=Depends(get_conversation_repository),
):
    """
    Get current user's conversations.
    
    Query parameters:
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    
    Requires authentication.
    """
    use_case = GetConversationsUseCase(conversation_repository=conversation_repository)

    return await use_case.execute(current_user.id, page, page_size)


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse, status_code=status.HTTP_200_OK)
async def get_conversation(
    conversation_id: str,
    conversation_repository=Depends(get_conversation_repository),
    current_user=Depends(get_current_active_user),
):
    """
    Get conversation by ID.
    
    Path parameters:
    - **conversation_id**: Conversation's UUID
    
    Requires authentication.
    """
    from uuid import UUID

    use_case = GetConversationByIdUseCase(
        conversation_repository=conversation_repository,
        message_repository=Depends(get_message_repository),
    )

    conversation = await use_case.execute(UUID(conversation_id))

    # Verify user owns the conversation
    if conversation.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this conversation",
        )

    return conversation


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    request: ConversationCreateRequest,
    current_user=Depends(get_current_active_user),
    conversation_repository=Depends(get_conversation_repository),
):
    """
    Create a new conversation.
    
    Request body:
    - **title**: Conversation title (optional)
    
    Requires authentication.
    """
    use_case = CreateConversationUseCase(conversation_repository=conversation_repository)

    return await use_case.execute(current_user.id, request)


@router.get("/conversations/{conversation_id}/messages", response_model=PaginatedResponse[MessageResponse], status_code=status.HTTP_200_OK)
async def get_messages(
    conversation_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(100, ge=1, le=100, description="Items per page"),
    current_user=Depends(get_current_active_user),
    message_repository=Depends(get_message_repository),
    conversation_repository=Depends(get_conversation_repository),
):
    """
    Get messages in a conversation.
    
    Path parameters:
    - **conversation_id**: Conversation's UUID
    
    Query parameters:
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 100, max: 100)
    
    Requires authentication.
    """
    from uuid import UUID

    # Verify user owns the conversation
    get_conv_use_case = GetConversationByIdUseCase(
        conversation_repository=conversation_repository,
        message_repository=message_repository,
    )
    conversation = await get_conv_use_case.execute(UUID(conversation_id))

    if conversation.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this conversation",
        )

    use_case = GetMessagesUseCase(message_repository=message_repository)

    return await use_case.execute(UUID(conversation_id), page, page_size)


@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: str,
    request: MessageCreateRequest,
    current_user=Depends(get_current_active_user),
    message_repository=Depends(get_message_repository),
    conversation_repository=Depends(get_conversation_repository),
):
    """
    Send a message in a conversation.
    
    Path parameters:
    - **conversation_id**: Conversation's UUID
    
    Request body:
    - **content**: Message content
    
    Requires authentication.
    """
    from uuid import UUID

    # Verify user owns the conversation
    get_conv_use_case = GetConversationByIdUseCase(
        conversation_repository=conversation_repository,
        message_repository=message_repository,
    )
    conversation = await get_conv_use_case.execute(UUID(conversation_id))

    if conversation.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this conversation",
        )

    # Create a mock AI service (in production, integrate with actual AI service)
    class MockAIService:
        async def generate_response(self, context):
            return "This is a mock AI response. In production, integrate with OpenAI or similar service."

    ai_service = MockAIService()

    use_case = SendMessageUseCase(
        message_repository=message_repository,
        conversation_repository=conversation_repository,
        ai_service=ai_service,
    )

    return await use_case.execute(UUID(conversation_id), request)
