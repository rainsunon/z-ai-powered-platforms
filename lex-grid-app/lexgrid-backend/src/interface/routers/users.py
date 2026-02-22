"""
Users router - Handles user profile management.
"""

from fastapi import APIRouter, Depends, status

from src.application.dto import (
    UserResponse,
    UserUpdateRequest,
)
from src.application.use_cases import (
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
)
from src.interface.dependencies import (
    get_user_repository,
    get_current_user,
    get_current_active_user,
    require_admin,
    get_pagination_params,
)
from src.application.dto import PaginatedResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_my_profile(
    current_user=Depends(get_current_active_user),
):
    """
    Get current user's profile.
    
    Requires authentication.
    """
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_my_profile(
    request: UserUpdateRequest,
    current_user=Depends(get_current_active_user),
    user_repository=Depends(get_user_repository),
):
    """
    Update current user's profile.
    
    - **name**: New name (optional)
    - **avatar**: New avatar URL (optional)
    - **jurisdiction**: New jurisdiction (optional)
    
    Requires authentication.
    """
    use_case = UpdateUserUseCase(user_repository=user_repository)

    return await use_case.execute(current_user.id, request)


@router.get("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(
    user_id: str,
    user_repository=Depends(get_user_repository),
):
    """
    Get user by ID.
    
    - **user_id**: User's UUID
    
    Requires admin access or own user.
    """
    from uuid import UUID

    use_case = GetUserUseCase(user_repository=user_repository)

    return await use_case.execute(UUID(user_id))


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    user_repository=Depends(get_user_repository),
    admin_user=Depends(require_admin),
):
    """
    Delete a user by ID.
    
    - **user_id**: User's UUID
    
    Requires admin access.
    """
    from uuid import UUID

    use_case = DeleteUserUseCase(user_repository=user_repository)

    await use_case.execute(UUID(user_id))

    return None
