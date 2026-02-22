"""
Laws router - Handles law search and retrieval.
"""

from fastapi import APIRouter, Depends, status, Query

from src.application.dto import (
    LawResponse,
    LawSearchRequest,
    PaginatedResponse,
)
from src.application.use_cases import (
    SearchLawsUseCase,
    GetLawByIdUseCase,
    GetLawsByJurisdictionUseCase,
)
from src.interface.dependencies import (
    get_law_repository,
    get_pagination_params,
)

router = APIRouter()


@router.get("/search", response_model=list[LawResponse], status_code=status.HTTP_200_OK)
async def search_laws(
    query: str = Query(..., min_length=2, description="Search query"),
    jurisdiction: str = Query(None, description="Filter by jurisdiction (USA/Canada)"),
    limit: int = Query(20, ge=1, le=100, description="Maximum results"),
    law_repository=Depends(get_law_repository),
):
    """
    Search laws by title, code, or summary.
    
    Query parameters:
    - **query**: Search term
    - **jurisdiction**: Filter by jurisdiction (USA/Canada)
    - **limit**: Maximum results (default: 20, max: 100)
    """
    request = LawSearchRequest(
        query=query,
        jurisdiction=jurisdiction,
        limit=limit,
    )

    use_case = SearchLawsUseCase(law_repository=law_repository)

    return await use_case.execute(request)


@router.get("/jurisdiction/{jurisdiction}", response_model=PaginatedResponse[LawResponse], status_code=status.HTTP_200_OK)
async def get_laws_by_jurisdiction(
    jurisdiction: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(100, ge=1, le=100, description="Items per page"),
    law_repository=Depends(get_law_repository),
):
    """
    Get laws by jurisdiction.
    
    Path parameters:
    - **jurisdiction**: Jurisdiction (USA/Canada)
    
    Query parameters:
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 100, max: 100)
    """
    use_case = GetLawsByJurisdictionUseCase(law_repository=law_repository)

    return await use_case.execute(jurisdiction, page, page_size)


@router.get("/{law_id}", response_model=LawResponse, status_code=status.HTTP_200_OK)
async def get_law(
    law_id: str,
    law_repository=Depends(get_law_repository),
):
    """
    Get law by ID.
    
    Path parameters:
    - **law_id**: Law's UUID
    """
    from uuid import UUID

    use_case = GetLawByIdUseCase(law_repository=law_repository)

    return await use_case.execute(UUID(law_id))
