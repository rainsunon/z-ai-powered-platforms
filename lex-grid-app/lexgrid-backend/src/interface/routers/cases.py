"""
Cases router - Handles case management.
"""

from fastapi import APIRouter, Depends, status, Query

from src.application.dto import (
    CaseResponse,
    CaseCreateRequest,
    CaseUpdateRequest,
    PaginatedResponse,
)
from src.application.use_cases import (
    GetCasesUseCase,
    GetCaseByIdUseCase,
    CreateCaseUseCase,
    UpdateCaseUseCase,
    DeleteCaseUseCase,
)
from src.interface.dependencies import (
    get_case_repository,
    get_current_active_user,
    get_pagination_params,
)

router = APIRouter()


@router.get("", response_model=PaginatedResponse[CaseResponse], status_code=status.HTTP_200_OK)
async def get_cases(
    case_status: str = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user=Depends(get_current_active_user),
    case_repository=Depends(get_case_repository),
):
    """
    Get current user's cases.
    
    Query parameters:
    - **case_status**: Filter by status (In Discovery/Active/Closed/Archived)
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    
    Requires authentication.
    """
    use_case = GetCasesUseCase(case_repository=case_repository)

    return await use_case.execute(current_user.id, case_status, page, page_size)


@router.get("/{case_id}", response_model=CaseResponse, status_code=status.HTTP_200_OK)
async def get_case(
    case_id: str,
    case_repository=Depends(get_case_repository),
    current_user=Depends(get_current_active_user),
):
    """
    Get case by ID.
    
    Path parameters:
    - **case_id**: Case's UUID
    
    Requires authentication.
    """
    from uuid import UUID

    use_case = GetCaseByIdUseCase(case_repository=case_repository)

    case = await use_case.execute(UUID(case_id))

    # Verify user owns the case
    if case.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this case",
        )

    return case


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(
    request: CaseCreateRequest,
    current_user=Depends(get_current_active_user),
    case_repository=Depends(get_case_repository),
):
    """
    Create a new case.
    
    Request body:
    - **title**: Case title
    - **description**: Case description (optional)
    
    Requires authentication.
    """
    use_case = CreateCaseUseCase(case_repository=case_repository)

    return await use_case.execute(current_user.id, request)


@router.put("/{case_id}", response_model=CaseResponse, status_code=status.HTTP_200_OK)
async def update_case(
    case_id: str,
    request: CaseUpdateRequest,
    current_user=Depends(get_current_active_user),
    case_repository=Depends(get_case_repository),
):
    """
    Update a case.
    
    Path parameters:
    - **case_id**: Case's UUID
    
    Request body:
    - **title**: New title (optional)
    - **status**: New status (optional)
    - **progress**: New progress (0-100, optional)
    - **description**: New description (optional)
    
    Requires authentication.
    """
    from uuid import UUID

    use_case = UpdateCaseUseCase(case_repository=case_repository)

    # Verify user owns the case
    get_case_use_case = GetCaseByIdUseCase(case_repository=case_repository)
    existing_case = await get_case_use_case.execute(UUID(case_id))

    if existing_case.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this case",
        )

    return await use_case.execute(UUID(case_id), request)


@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_case(
    case_id: str,
    current_user=Depends(get_current_active_user),
    case_repository=Depends(get_case_repository),
):
    """
    Delete a case.
    
    Path parameters:
    - **case_id**: Case's UUID
    
    Requires authentication.
    """
    from uuid import UUID

    use_case = DeleteCaseUseCase(case_repository=case_repository)

    # Verify user owns the case
    get_case_use_case = GetCaseByIdUseCase(case_repository=case_repository)
    existing_case = await get_case_use_case.execute(UUID(case_id))

    if existing_case.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this case",
        )

    await use_case.execute(UUID(case_id))

    return None
