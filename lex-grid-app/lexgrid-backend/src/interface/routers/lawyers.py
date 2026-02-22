"""
Lawyers router - Handles lawyer directory and search.
"""

from fastapi import APIRouter, Depends, status, Query

from src.application.dto import (
    LawyerResponse,
    LawyerCreateRequest,
    LawyerUpdateRequest,
    LawyerFilters,
    PaginatedResponse,
)
from src.application.use_cases import (
    GetLawyersUseCase,
    GetLawyerByIdUseCase,
    SearchLawyersUseCase,
    CreateLawyerUseCase,
    UpdateLawyerUseCase,
    DeleteLawyerUseCase,
)
from src.interface.dependencies import (
    get_lawyer_repository,
    get_pagination_params,
    require_admin,
)

router = APIRouter()


@router.get("", response_model=PaginatedResponse[LawyerResponse], status_code=status.HTTP_200_OK)
async def get_lawyers(
    jurisdiction: str = Query(None, description="Filter by jurisdiction (USA/Canada)"),
    specialty: str = Query(None, description="Filter by specialty"),
    location: str = Query(None, description="Filter by location"),
    min_rating: float = Query(None, ge=0, le=5, description="Minimum rating"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    lawyer_repository=Depends(get_lawyer_repository),
):
    """
    Get lawyers with optional filters.
    
    Query parameters:
    - **jurisdiction**: Filter by jurisdiction (USA/Canada)
    - **specialty**: Filter by specialty
    - **location**: Filter by location
    - **min_rating**: Minimum rating (0-5)
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    """
    filters = LawyerFilters(
        jurisdiction=jurisdiction,
        specialty=specialty,
        location=location,
        min_rating=min_rating,
    )

    use_case = GetLawyersUseCase(lawyer_repository=lawyer_repository)

    return await use_case.execute(filters, page, page_size)


@router.get("/search", response_model=list[LawyerResponse], status_code=status.HTTP_200_OK)
async def search_lawyers(
    query: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Maximum results"),
    lawyer_repository=Depends(get_lawyer_repository),
):
    """
    Search lawyers by name, specialty, or bio.
    
    Query parameters:
    - **query**: Search term
    - **limit**: Maximum results (default: 20, max: 100)
    """
    use_case = SearchLawyersUseCase(lawyer_repository=lawyer_repository)

    return await use_case.execute(query, limit)


@router.get("/{lawyer_id}", response_model=LawyerResponse, status_code=status.HTTP_200_OK)
async def get_lawyer(
    lawyer_id: str,
    lawyer_repository=Depends(get_lawyer_repository),
):
    """
    Get lawyer by ID.
    
    Path parameters:
    - **lawyer_id**: Lawyer's UUID
    """
    from uuid import UUID

    use_case = GetLawyerByIdUseCase(lawyer_repository=lawyer_repository)

    return await use_case.execute(UUID(lawyer_id))


@router.post("", response_model=LawyerResponse, status_code=status.HTTP_201_CREATED)
async def create_lawyer(
    request: LawyerCreateRequest,
    lawyer_repository=Depends(get_lawyer_repository),
    admin_user=Depends(require_admin),
):
    """
    Create a new lawyer.
    
    Request body:
    - **name**: Lawyer's name
    - **specialty**: Lawyer's specialty
    - **jurisdiction**: Jurisdiction (USA/Canada)
    - **location**: Lawyer's location
    - **rating**: Rating (0-5, optional)
    - **review_count**: Number of reviews (default: 0)
    - **experience**: Years of experience (optional)
    - **level**: Experience level (optional)
    - **bar_number**: Bar number (optional)
    - **profile_image**: Profile image URL (optional)
    - **bio**: Biography (optional)
    
    Requires admin access.
    """
    use_case = CreateLawyerUseCase(lawyer_repository=lawyer_repository)

    return await use_case.execute(request)


@router.put("/{lawyer_id}", response_model=LawyerResponse, status_code=status.HTTP_200_OK)
async def update_lawyer(
    lawyer_id: str,
    request: LawyerUpdateRequest,
    lawyer_repository=Depends(get_lawyer_repository),
    admin_user=Depends(require_admin),
):
    """
    Update a lawyer.
    
    Path parameters:
    - **lawyer_id**: Lawyer's UUID
    
    Request body:
    - **name**: New name (optional)
    - **specialty**: New specialty (optional)
    - **jurisdiction**: New jurisdiction (optional)
    - **location**: New location (optional)
    - **rating**: New rating (optional)
    - **review_count**: New review count (optional)
    - **experience**: New experience (optional)
    - **level**: New level (optional)
    - **bar_number**: New bar number (optional)
    - **profile_image**: New profile image (optional)
    - **bio**: New bio (optional)
    - **is_active**: Active status (optional)
    
    Requires admin access.
    """
    from uuid import UUID

    use_case = UpdateLawyerUseCase(lawyer_repository=lawyer_repository)

    return await use_case.execute(UUID(lawyer_id), request)


@router.delete("/{lawyer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lawyer(
    lawyer_id: str,
    lawyer_repository=Depends(get_lawyer_repository),
    admin_user=Depends(require_admin),
):
    """
    Delete a lawyer.
    
    Path parameters:
    - **lawyer_id**: Lawyer's UUID
    
    Requires admin access.
    """
    from uuid import UUID

    use_case = DeleteLawyerUseCase(lawyer_repository=lawyer_repository)

    await use_case.execute(UUID(lawyer_id))

    return None
