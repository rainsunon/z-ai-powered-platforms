"""
Application Layer - Orchestrates domain objects and defines use cases.

This layer contains:
- Use Cases: Application-specific business logic
- DTOs: Data Transfer Objects for API communication
- Services: Application services that coordinate use cases
"""

from src.application.use_cases import (
    # Auth Use Cases
    LoginUserUseCase,
    RegisterUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    
    # User Use Cases
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    
    # Lawyer Use Cases
    GetLawyersUseCase,
    GetLawyerByIdUseCase,
    SearchLawyersUseCase,
    CreateLawyerUseCase,
    UpdateLawyerUseCase,
    DeleteLawyerUseCase,
    
    # Case Use Cases
    GetCasesUseCase,
    GetCaseByIdUseCase,
    CreateCaseUseCase,
    UpdateCaseUseCase,
    DeleteCaseUseCase,
    
    # Chat Use Cases
    GetConversationsUseCase,
    GetConversationByIdUseCase,
    CreateConversationUseCase,
    SendMessageUseCase,
    GetMessagesUseCase,
    
    # Law Search Use Cases
    SearchLawsUseCase,
    GetLawByIdUseCase,
    GetLawsByJurisdictionUseCase,
    
    # Billing Use Cases
    GetPlansUseCase,
    GetSubscriptionUseCase,
    SubscribeToPlanUseCase,
    CancelSubscriptionUseCase,
    GetInvoicesUseCase,
    
    # Activity Use Cases
    GetActivitiesUseCase,
    CreateActivityUseCase,
    
    # Document Use Cases
    UploadDocumentUseCase,
    GetDocumentUseCase,
    DeleteDocumentUseCase,
)

from src.application.dto import (
    # Auth DTOs
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenRequest,
    RefreshTokenResponse,
    
    # User DTOs
    UserResponse,
    UserUpdateRequest,
    
    # Lawyer DTOs
    LawyerResponse,
    LawyerCreateRequest,
    LawyerUpdateRequest,
    LawyerFilters,
    
    # Case DTOs
    CaseResponse,
    CaseCreateRequest,
    CaseUpdateRequest,
    
    # Chat DTOs
    ConversationResponse,
    ConversationCreateRequest,
    MessageResponse,
    MessageCreateRequest,
    
    # Law DTOs
    LawResponse,
    LawSearchRequest,
    
    # Billing DTOs
    PlanResponse,
    SubscriptionResponse,
    SubscribeRequest,
    InvoiceResponse,
    
    # Activity DTOs
    ActivityResponse,
    ActivityCreateRequest,
    
    # Document DTOs
    DocumentResponse,
    DocumentUploadResponse,
    
    # Common DTOs
    PaginatedResponse,
    ErrorResponse,
)

__all__ = [
    # Use Cases
    "LoginUserUseCase",
    "RegisterUserUseCase",
    "RefreshTokenUseCase",
    "LogoutUserUseCase",
    "GetUserUseCase",
    "UpdateUserUseCase",
    "DeleteUserUseCase",
    "GetLawyersUseCase",
    "GetLawyerByIdUseCase",
    "SearchLawyersUseCase",
    "CreateLawyerUseCase",
    "UpdateLawyerUseCase",
    "DeleteLawyerUseCase",
    "GetCasesUseCase",
    "GetCaseByIdUseCase",
    "CreateCaseUseCase",
    "UpdateCaseUseCase",
    "DeleteCaseUseCase",
    "GetConversationsUseCase",
    "GetConversationByIdUseCase",
    "CreateConversationUseCase",
    "SendMessageUseCase",
    "GetMessagesUseCase",
    "SearchLawsUseCase",
    "GetLawByIdUseCase",
    "GetLawsByJurisdictionUseCase",
    "GetPlansUseCase",
    "GetSubscriptionUseCase",
    "SubscribeToPlanUseCase",
    "CancelSubscriptionUseCase",
    "GetInvoicesUseCase",
    "GetActivitiesUseCase",
    "CreateActivityUseCase",
    "UploadDocumentUseCase",
    "GetDocumentUseCase",
    "DeleteDocumentUseCase",
    # DTOs
    "LoginRequest",
    "LoginResponse",
    "RegisterRequest",
    "RefreshTokenRequest",
    "RefreshTokenResponse",
    "UserResponse",
    "UserUpdateRequest",
    "LawyerResponse",
    "LawyerCreateRequest",
    "LawyerUpdateRequest",
    "LawyerFilters",
    "CaseResponse",
    "CaseCreateRequest",
    "CaseUpdateRequest",
    "ConversationResponse",
    "ConversationCreateRequest",
    "MessageResponse",
    "MessageCreateRequest",
    "LawResponse",
    "LawSearchRequest",
    "PlanResponse",
    "SubscriptionResponse",
    "SubscribeRequest",
    "InvoiceResponse",
    "ActivityResponse",
    "ActivityCreateRequest",
    "DocumentResponse",
    "DocumentUploadResponse",
    "PaginatedResponse",
    "ErrorResponse",
]
