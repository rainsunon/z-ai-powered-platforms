"""
Documents router - Handles document upload and management.
"""

from fastapi import APIRouter, Depends, status, UploadFile, File, Query

from src.application.dto import (
    DocumentResponse,
    DocumentUploadResponse,
)
from src.application.use_cases import (
    UploadDocumentUseCase,
    GetDocumentUseCase,
    DeleteDocumentUseCase,
)
from src.interface.dependencies import (
    get_document_repository,
    get_current_active_user,
)

router = APIRouter()


@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(..., description="Document file to upload"),
    case_id: str = Query(None, description="Optional case ID to associate with"),
    current_user=Depends(get_current_active_user),
    document_repository=Depends(get_document_repository),
):
    """
    Upload a document.
    
    Form data:
    - **file**: Document file (PDF, DOC, DOCX, TXT)
    
    Query parameters:
    - **case_id**: Optional case ID to associate with
    
    Requires authentication.
    """
    # Validate file type
    from src.infrastructure.config import get_settings
    settings = get_settings()

    file_extension = file.filename.split('.')[-1].lower() if file.filename else ''
    if file_extension not in settings.allowed_file_types:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid file type. Allowed types: {', '.join(settings.allowed_file_types)}",
        )

    # Read file content
    file_content = await file.read()

    # Validate file size
    if len(file_content) > settings.max_upload_size:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"File too large. Maximum size: {settings.max_upload_size} bytes",
        )

    # Create a mock file storage service (in production, use S3 or similar)
    class MockFileStorageService:
        async def store_file(self, user_id, file_name, file_content):
            # Mock file storage - in production, store to S3 or local filesystem
            import os
            from uuid import uuid4

            # Create uploads directory if it doesn't exist
            os.makedirs(settings.upload_dir, exist_ok=True)

            # Generate unique filename
            unique_filename = f"{uuid4()}_{file_name}"
            file_path = os.path.join(settings.upload_dir, unique_filename)

            # Write file
            with open(file_path, 'wb') as f:
                f.write(file_content)

            return file_path

        async def delete_file(self, file_path):
            # Mock file deletion
            import os
            if os.path.exists(file_path):
                os.remove(file_path)

    file_storage_service = MockFileStorageService()

    use_case = UploadDocumentUseCase(
        document_repository=document_repository,
        file_storage_service=file_storage_service,
    )

    from uuid import UUID
    case_uuid = UUID(case_id) if case_id else None

    return await use_case.execute(
        user_id=current_user.id,
        case_id=case_uuid,
        file_name=file.filename,
        file_content=file_content,
        file_type=file_extension,
    )


@router.get("/{document_id}", response_model=DocumentResponse, status_code=status.HTTP_200_OK)
async def get_document(
    document_id: str,
    document_repository=Depends(get_document_repository),
    current_user=Depends(get_current_active_user),
):
    """
    Get document by ID.
    
    Path parameters:
    - **document_id**: Document's UUID
    
    Requires authentication.
    """
    from uuid import UUID

    use_case = GetDocumentUseCase(document_repository=document_repository)

    document = await use_case.execute(UUID(document_id))

    # Verify user owns the document
    if document.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this document",
        )

    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    document_repository=Depends(get_document_repository),
    current_user=Depends(get_current_active_user),
):
    """
    Delete a document.
    
    Path parameters:
    - **document_id**: Document's UUID
    
    Requires authentication.
    """
    from uuid import UUID

    # Create a mock file storage service
    class MockFileStorageService:
        async def delete_file(self, file_path):
            import os
            if os.path.exists(file_path):
                os.remove(file_path)

    file_storage_service = MockFileStorageService()

    use_case = DeleteDocumentUseCase(
        document_repository=document_repository,
        file_storage_service=file_storage_service,
    )

    # Verify user owns the document
    get_doc_use_case = GetDocumentUseCase(document_repository=document_repository)
    document = await get_doc_use_case.execute(UUID(document_id))

    if document.user_id != current_user.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this document",
        )

    await use_case.execute(UUID(document_id))

    return None
