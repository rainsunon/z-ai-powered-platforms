"""
Activities router - Handles user activity tracking.
"""

from fastapi import APIRouter, Depends, status, Query

from src.application.dto import (
    ActivityResponse,
    ActivityCreateRequest,
    PaginatedResponse,
)
from src.application.use_cases import (
    GetActivitiesUseCase,
    CreateActivityUseCase,
)
from src.interface.dependencies import (
    get_activity_repository,
    get_current_active_user,
    get_pagination_params,
)

router = APIRouter()


@router.get("", response_model=PaginatedResponse[ActivityResponse], status_code=status.HTTP_200_OK)
async def get_activities(
    activity_type: str = Query(None, description="Filter by activity type"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(100, ge=1, le=100, description="Items per page"),
    current_user=Depends(get_current_active_user),
    activity_repository=Depends(get_activity_repository),
):
    """
    Get current user's activities.
    
    Query parameters:
    - **activity_type**: Filter by type (chat/meeting/email/notification/payment)
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 100, max: 100)
    
    Requires authentication.
    """
    use_case = GetActivitiesUseCase(activity_repository=activity_repository)

    return await use_case.execute(current_user.id, activity_type, page, page_size)


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    request: ActivityCreateRequest,
    current_user=Depends(get_current_active_user),
    activity_repository=Depends(get_activity_repository),
):
    """
    Create a new activity.
    
    Request body:
    - **type**: Activity type (chat/meeting/email/notification/payment)
    - **title**: Activity title
    - **description**: Activity description (optional)
    - **status**: Activity status (optional)
    - **status_type**: Status type (success/warning/info/error, optional)
    - **meta**: Additional metadata (optional)
    
    Requires authentication.
    """
    use_case = CreateActivityUseCase(activity_repository=activity_repository)

    return await use_case.execute(current_user.id, request)
