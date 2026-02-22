"""
Use Cases - Application-specific business logic.

Use cases orchestrate domain objects to accomplish specific
application goals. They are the entry points for the application
layer and are called by the interface layer (controllers).
"""

from typing import List, Optional
from uuid import UUID

from src.domain.entities import (
    User,
    Lawyer,
    Case,
    Activity,
    Message,
    Subscription,
    Law,
    Document,
    Conversation,
)
from src.domain.value_objects import (
    Email,
    Jurisdiction,
    CaseStatus,
    ActivityType,
    MessageRole,
    SubscriptionStatus,
    BillingCycle,
)
from src.domain.repository_interfaces import (
    UserRepository,
    LawyerRepository,
    CaseRepository,
    ActivityRepository,
    MessageRepository,
    SubscriptionRepository,
    LawRepository,
    DocumentRepository,
    ConversationRepository,
)
from src.domain.aggregates import (
    UserAggregate,
    CaseAggregate,
    ConversationAggregate,
)
from src.application.dto import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenRequest,
    RefreshTokenResponse,
    UserResponse,
    UserUpdateRequest,
    LawyerResponse,
    LawyerCreateRequest,
    LawyerUpdateRequest,
    LawyerFilters,
    CaseResponse,
    CaseCreateRequest,
    CaseUpdateRequest,
    ConversationResponse,
    ConversationCreateRequest,
    MessageResponse,
    MessageCreateRequest,
    LawResponse,
    LawSearchRequest,
    PlanResponse,
    SubscriptionResponse,
    SubscribeRequest,
    InvoiceResponse,
    ActivityResponse,
    ActivityCreateRequest,
    DocumentResponse,
    DocumentUploadResponse,
    PaginatedResponse,
)


# ==================== Auth Use Cases ====================

class LoginUserUseCase:
    """Use case for user login."""

    def __init__(
        self,
        user_repository: UserRepository,
        password_hasher,
        jwt_service,
    ):
        self.user_repository = user_repository
        self.password_hasher = password_hasher
        self.jwt_service = jwt_service

    async def execute(self, request: LoginRequest) -> LoginResponse:
        """Execute user login."""
        email = Email(request.email)
        user = await self.user_repository.find_by_email(email)

        if not user:
            raise ValueError("Invalid credentials")

        if not user.is_active:
            raise ValueError("Account is inactive")

        if not user.verify_password(request.password, self.password_hasher):
            raise ValueError("Invalid credentials")

        # Generate tokens
        access_token = self.jwt_service.create_access_token(
            subject=str(user.id),
            additional_claims={"role": user.role}
        )
        refresh_token = self.jwt_service.create_refresh_token(
            subject=str(user.id)
        )

        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user)
        )


class RegisterUserUseCase:
    """Use case for user registration."""

    def __init__(
        self,
        user_repository: UserRepository,
        password_hasher,
        jwt_service,
    ):
        self.user_repository = user_repository
        self.password_hasher = password_hasher
        self.jwt_service = jwt_service

    async def execute(self, request: RegisterRequest) -> LoginResponse:
        """Execute user registration."""
        email = Email(request.email)

        if await self.user_repository.exists_by_email(email):
            raise ValueError("Email already registered")

        user = User(
            email=email,
            hashed_password="",  # Will be set by set_password
            name=request.name,
            role=request.role,
            jurisdiction=Jurisdiction(request.jurisdiction) if request.jurisdiction else None,
        )
        user.set_password(request.password, self.password_hasher)

        saved_user = await self.user_repository.save(user)

        # Generate tokens
        access_token = self.jwt_service.create_access_token(
            subject=str(saved_user.id),
            additional_claims={"role": saved_user.role}
        )
        refresh_token = self.jwt_service.create_refresh_token(
            subject=str(saved_user.id)
        )

        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(saved_user)
        )


class RefreshTokenUseCase:
    """Use case for refreshing JWT tokens."""

    def __init__(self, jwt_service):
        self.jwt_service = jwt_service

    async def execute(self, request: RefreshTokenRequest) -> RefreshTokenResponse:
        """Execute token refresh."""
        payload = self.jwt_service.decode_refresh_token(request.refresh_token)
        user_id = payload.get("sub")

        if not user_id:
            raise ValueError("Invalid refresh token")

        # Generate new tokens
        access_token = self.jwt_service.create_access_token(subject=user_id)
        refresh_token = self.jwt_service.create_refresh_token(subject=user_id)

        return RefreshTokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )


class LogoutUserUseCase:
    """Use case for user logout."""

    def __init__(self, jwt_service):
        self.jwt_service = jwt_service

    async def execute(self, refresh_token: str) -> None:
        """Execute user logout by invalidating refresh token."""
        # In a real implementation, you would add the token to a blacklist
        # or use a token store to invalidate it
        pass


# ==================== User Use Cases ====================

class GetUserUseCase:
    """Use case for getting user by ID."""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, user_id: UUID) -> UserResponse:
        """Execute get user."""
        user = await self.user_repository.find_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        return UserResponse.model_validate(user)


class UpdateUserUseCase:
    """Use case for updating user profile."""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(
        self,
        user_id: UUID,
        request: UserUpdateRequest
    ) -> UserResponse:
        """Execute update user."""
        user = await self.user_repository.find_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        if request.name:
            user.name = request.name
        if request.avatar:
            user.avatar = request.avatar
        if request.jurisdiction:
            user.jurisdiction = Jurisdiction(request.jurisdiction)

        updated_user = await self.user_repository.save(user)
        return UserResponse.model_validate(updated_user)


class DeleteUserUseCase:
    """Use case for deleting a user."""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, user_id: UUID) -> bool:
        """Execute delete user."""
        return await self.user_repository.delete(user_id)


# ==================== Lawyer Use Cases ====================

class GetLawyersUseCase:
    """Use case for getting lawyers with filters."""

    def __init__(self, lawyer_repository: LawyerRepository):
        self.lawyer_repository = lawyer_repository

    async def execute(
        self,
        filters: Optional[LawyerFilters] = None,
        page: int = 1,
        page_size: int = 20
    ) -> PaginatedResponse[LawyerResponse]:
        """Execute get lawyers."""
        jurisdiction = Jurisdiction(filters.jurisdiction) if filters and filters.jurisdiction else None
        specialty = filters.specialty if filters else None
        location = filters.location if filters else None
        min_rating = filters.min_rating if filters else None

        offset = (page - 1) * page_size
        lawyers = await self.lawyer_repository.find_all(
            jurisdiction=jurisdiction,
            specialty=specialty,
            location=location,
            min_rating=min_rating,
            limit=page_size,
            offset=offset,
        )

        total = await self.lawyer_repository.count(jurisdiction=jurisdiction)
        total_pages = (total + page_size - 1) // page_size

        return PaginatedResponse(
            items=[LawyerResponse.model_validate(l) for l in lawyers],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )


class GetLawyerByIdUseCase:
    """Use case for getting a lawyer by ID."""

    def __init__(self, lawyer_repository: LawyerRepository):
        self.lawyer_repository = lawyer_repository

    async def execute(self, lawyer_id: UUID) -> LawyerResponse:
        """Execute get lawyer by ID."""
        lawyer = await self.lawyer_repository.find_by_id(lawyer_id)
        if not lawyer:
            raise ValueError("Lawyer not found")
        return LawyerResponse.model_validate(lawyer)


class SearchLawyersUseCase:
    """Use case for searching lawyers."""

    def __init__(self, lawyer_repository: LawyerRepository):
        self.lawyer_repository = lawyer_repository

    async def execute(self, query: str, limit: int = 20) -> List[LawyerResponse]:
        """Execute lawyer search."""
        lawyers = await self.lawyer_repository.search(query, limit=limit)
        return [LawyerResponse.model_validate(l) for l in lawyers]


class CreateLawyerUseCase:
    """Use case for creating a lawyer."""

    def __init__(self, lawyer_repository: LawyerRepository):
        self.lawyer_repository = lawyer_repository

    async def execute(self, request: LawyerCreateRequest) -> LawyerResponse:
        """Execute create lawyer."""
        lawyer = Lawyer(
            name=request.name,
            specialty=request.specialty,
            jurisdiction=Jurisdiction(request.jurisdiction),
            location=request.location,
            rating=request.rating,
            review_count=request.review_count,
            experience=request.experience,
            level=request.level,
            bar_number=request.bar_number,
            profile_image=request.profile_image,
            bio=request.bio,
        )

        saved_lawyer = await self.lawyer_repository.save(lawyer)
        return LawyerResponse.model_validate(saved_lawyer)


class UpdateLawyerUseCase:
    """Use case for updating a lawyer."""

    def __init__(self, lawyer_repository: LawyerRepository):
        self.lawyer_repository = lawyer_repository

    async def execute(
        self,
        lawyer_id: UUID,
        request: LawyerUpdateRequest
    ) -> LawyerResponse:
        """Execute update lawyer."""
        lawyer = await self.lawyer_repository.find_by_id(lawyer_id)
        if not lawyer:
            raise ValueError("Lawyer not found")

        if request.name:
            lawyer.name = request.name
        if request.specialty:
            lawyer.specialty = request.specialty
        if request.jurisdiction:
            lawyer.jurisdiction = Jurisdiction(request.jurisdiction)
        if request.location:
            lawyer.location = request.location
        if request.rating is not None:
            lawyer.rating = request.rating
        if request.review_count is not None:
            lawyer.review_count = request.review_count
        if request.experience is not None:
            lawyer.experience = request.experience
        if request.level:
            lawyer.level = request.level
        if request.bar_number:
            lawyer.bar_number = request.bar_number
        if request.profile_image:
            lawyer.profile_image = request.profile_image
        if request.bio:
            lawyer.bio = request.bio
        if request.is_active is not None:
            lawyer.is_active = request.is_active

        updated_lawyer = await self.lawyer_repository.save(lawyer)
        return LawyerResponse.model_validate(updated_lawyer)


class DeleteLawyerUseCase:
    """Use case for deleting a lawyer."""

    def __init__(self, lawyer_repository: LawyerRepository):
        self.lawyer_repository = lawyer_repository

    async def execute(self, lawyer_id: UUID) -> bool:
        """Execute delete lawyer."""
        return await self.lawyer_repository.delete(lawyer_id)


# ==================== Case Use Cases ====================

class GetCasesUseCase:
    """Use case for getting user cases."""

    def __init__(self, case_repository: CaseRepository):
        self.case_repository = case_repository

    async def execute(
        self,
        user_id: UUID,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> PaginatedResponse[CaseResponse]:
        """Execute get cases."""
        case_status = CaseStatus(status) if status else None
        offset = (page - 1) * page_size

        cases = await self.case_repository.find_by_user_id(
            user_id=user_id,
            status=case_status,
            limit=page_size,
            offset=offset,
        )

        total = await self.case_repository.count_by_user_id(user_id)
        total_pages = (total + page_size - 1) // page_size

        return PaginatedResponse(
            items=[CaseResponse.model_validate(c) for c in cases],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )


class GetCaseByIdUseCase:
    """Use case for getting a case by ID."""

    def __init__(self, case_repository: CaseRepository):
        self.case_repository = case_repository

    async def execute(self, case_id: UUID) -> CaseResponse:
        """Execute get case by ID."""
        case = await self.case_repository.find_by_id(case_id)
        if not case:
            raise ValueError("Case not found")
        return CaseResponse.model_validate(case)


class CreateCaseUseCase:
    """Use case for creating a case."""

    def __init__(self, case_repository: CaseRepository):
        self.case_repository = case_repository

    async def execute(
        self,
        user_id: UUID,
        request: CaseCreateRequest
    ) -> CaseResponse:
        """Execute create case."""
        case = Case(
            user_id=user_id,
            title=request.title,
            status=CaseStatus.ACTIVE,
            description=request.description,
        )

        saved_case = await self.case_repository.save(case)
        return CaseResponse.model_validate(saved_case)


class UpdateCaseUseCase:
    """Use case for updating a case."""

    def __init__(self, case_repository: CaseRepository):
        self.case_repository = case_repository

    async def execute(
        self,
        case_id: UUID,
        request: CaseUpdateRequest
    ) -> CaseResponse:
        """Execute update case."""
        case = await self.case_repository.find_by_id(case_id)
        if not case:
            raise ValueError("Case not found")

        if request.title:
            case.title = request.title
        if request.status:
            case.update_status(CaseStatus(request.status))
        if request.progress is not None:
            case.update_progress(request.progress)
        if request.description:
            case.description = request.description

        updated_case = await self.case_repository.save(case)
        return CaseResponse.model_validate(updated_case)


class DeleteCaseUseCase:
    """Use case for deleting a case."""

    def __init__(self, case_repository: CaseRepository):
        self.case_repository = case_repository

    async def execute(self, case_id: UUID) -> bool:
        """Execute delete case."""
        return await self.case_repository.delete(case_id)


# ==================== Chat Use Cases ====================

class GetConversationsUseCase:
    """Use case for getting user conversations."""

    def __init__(self, conversation_repository: ConversationRepository):
        self.conversation_repository = conversation_repository

    async def execute(
        self,
        user_id: UUID,
        page: int = 1,
        page_size: int = 20
    ) -> PaginatedResponse[ConversationResponse]:
        """Execute get conversations."""
        offset = (page - 1) * page_size

        conversations = await self.conversation_repository.find_by_user_id(
            user_id=user_id,
            limit=page_size,
            offset=offset,
        )

        total = await self.conversation_repository.count_by_user_id(user_id)
        total_pages = (total + page_size - 1) // page_size

        return PaginatedResponse(
            items=[ConversationResponse.model_validate(c) for c in conversations],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )


class GetConversationByIdUseCase:
    """Use case for getting a conversation by ID."""

    def __init__(
        self,
        conversation_repository: ConversationRepository,
        message_repository: MessageRepository,
    ):
        self.conversation_repository = conversation_repository
        self.message_repository = message_repository

    async def execute(self, conversation_id: UUID) -> ConversationResponse:
        """Execute get conversation by ID."""
        conversation = await self.conversation_repository.find_by_id(conversation_id)
        if not conversation:
            raise ValueError("Conversation not found")
        return ConversationResponse.model_validate(conversation)


class CreateConversationUseCase:
    """Use case for creating a conversation."""

    def __init__(self, conversation_repository: ConversationRepository):
        self.conversation_repository = conversation_repository

    async def execute(
        self,
        user_id: UUID,
        request: ConversationCreateRequest
    ) -> ConversationResponse:
        """Execute create conversation."""
        conversation = Conversation(
            user_id=user_id,
            title=request.title,
        )

        saved_conversation = await self.conversation_repository.save(conversation)
        return ConversationResponse.model_validate(saved_conversation)


class SendMessageUseCase:
    """Use case for sending a message."""

    def __init__(
        self,
        message_repository: MessageRepository,
        conversation_repository: ConversationRepository,
        ai_service,
    ):
        self.message_repository = message_repository
        self.conversation_repository = conversation_repository
        self.ai_service = ai_service

    async def execute(
        self,
        conversation_id: UUID,
        request: MessageCreateRequest
    ) -> MessageResponse:
        """Execute send message."""
        # Save user message
        user_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=request.content,
        )
        saved_message = await self.message_repository.save(user_message)

        # Get conversation context
        conversation = await self.conversation_repository.find_by_id(conversation_id)
        messages = await self.message_repository.find_by_conversation_id(conversation_id)

        # Generate AI response
        context = [
            {"role": m.role.value, "content": m.content}
            for m in messages
        ]
        ai_response = await self.ai_service.generate_response(context)

        # Save AI message
        assistant_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=ai_response,
        )
        await self.message_repository.save(assistant_message)

        return MessageResponse.model_validate(saved_message)


class GetMessagesUseCase:
    """Use case for getting conversation messages."""

    def __init__(self, message_repository: MessageRepository):
        self.message_repository = message_repository

    async def execute(
        self,
        conversation_id: UUID,
        page: int = 1,
        page_size: int = 100
    ) -> PaginatedResponse[MessageResponse]:
        """Execute get messages."""
        offset = (page - 1) * page_size

        messages = await self.message_repository.find_by_conversation_id(
            conversation_id=conversation_id,
            limit=page_size,
            offset=offset,
        )

        # For simplicity, we're not implementing total count for messages
        return PaginatedResponse(
            items=[MessageResponse.model_validate(m) for m in messages],
            total=len(messages),
            page=page,
            page_size=page_size,
            total_pages=1,
        )


# ==================== Law Search Use Cases ====================

class SearchLawsUseCase:
    """Use case for searching laws."""

    def __init__(self, law_repository: LawRepository):
        self.law_repository = law_repository

    async def execute(self, request: LawSearchRequest) -> List[LawResponse]:
        """Execute law search."""
        jurisdiction = Jurisdiction(request.jurisdiction) if request.jurisdiction else None

        laws = await self.law_repository.search(
            query=request.query,
            jurisdiction=jurisdiction,
            limit=request.limit,
        )

        return [LawResponse.model_validate(l) for l in laws]


class GetLawByIdUseCase:
    """Use case for getting a law by ID."""

    def __init__(self, law_repository: LawRepository):
        self.law_repository = law_repository

    async def execute(self, law_id: UUID) -> LawResponse:
        """Execute get law by ID."""
        law = await self.law_repository.find_by_id(law_id)
        if not law:
            raise ValueError("Law not found")
        return LawResponse.model_validate(law)


class GetLawsByJurisdictionUseCase:
    """Use case for getting laws by jurisdiction."""

    def __init__(self, law_repository: LawRepository):
        self.law_repository = law_repository

    async def execute(
        self,
        jurisdiction: str,
        page: int = 1,
        page_size: int = 100
    ) -> PaginatedResponse[LawResponse]:
        """Execute get laws by jurisdiction."""
        offset = (page - 1) * page_size

        laws = await self.law_repository.find_by_jurisdiction(
            jurisdiction=Jurisdiction(jurisdiction),
            limit=page_size,
            offset=offset,
        )

        # For simplicity, we're not implementing total count for laws
        return PaginatedResponse(
            items=[LawResponse.model_validate(l) for l in laws],
            total=len(laws),
            page=page,
            page_size=page_size,
            total_pages=1,
        )


# ==================== Billing Use Cases ====================

class GetPlansUseCase:
    """Use case for getting subscription plans."""

    def __init__(self):
        # In a real implementation, this would fetch from a database
        self.plans = [
            {
                "id": "basic",
                "name": "Basic",
                "monthly_price": 89,
                "yearly_price": 71,
                "description": "For solo practitioners starting with AI.",
                "features": [
                    "AI Legal Research (Canada)",
                    "50 Case Analysis/mo",
                    "Standard Drafting"
                ],
                "current": False,
                "popular": False,
            },
            {
                "id": "professional",
                "name": "Professional",
                "monthly_price": 199,
                "yearly_price": 159,
                "description": "Complete cross-border legal automation.",
                "features": [
                    "USA & Canada Full Access",
                    "Unlimited Analysis",
                    "Advanced AI Briefing",
                    "Priority Support",
                    "Up to 3 Team Members"
                ],
                "current": False,
                "popular": True,
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "price": "Custom",
                "description": "Bespoke solutions for large firms.",
                "features": [
                    "Custom API Integrations",
                    "Single Sign-On (SSO)",
                    "On-premise Deployment",
                    "Dedicated Compliance Officer"
                ],
                "current": False,
                "popular": False,
            },
        ]

    async def execute(self) -> List[PlanResponse]:
        """Execute get plans."""
        return [PlanResponse(**plan) for plan in self.plans]


class GetSubscriptionUseCase:
    """Use case for getting user subscription."""

    def __init__(self, subscription_repository: SubscriptionRepository):
        self.subscription_repository = subscription_repository

    async def execute(self, user_id: UUID) -> Optional[SubscriptionResponse]:
        """Execute get subscription."""
        subscription = await self.subscription_repository.find_by_user_id(user_id)
        if not subscription:
            return None
        return SubscriptionResponse.model_validate(subscription)


class SubscribeToPlanUseCase:
    """Use case for subscribing to a plan."""

    def __init__(
        self,
        subscription_repository: SubscriptionRepository,
        payment_service,
    ):
        self.subscription_repository = subscription_repository
        self.payment_service = payment_service

    async def execute(
        self,
        user_id: UUID,
        request: SubscribeRequest
    ) -> SubscriptionResponse:
        """Execute subscribe to plan."""
        # Get plan details
        plans_use_case = GetPlansUseCase()
        plans = await plans_use_case.execute()
        plan = next((p for p in plans if p.id == request.plan_id), None)

        if not plan:
            raise ValueError("Plan not found")

        # Calculate amount based on billing cycle
        if request.billing_cycle == "monthly":
            amount = plan.monthly_price
        else:
            amount = plan.yearly_price

        # Process payment (simplified)
        # In a real implementation, this would integrate with a payment gateway
        payment_result = await self.payment_service.process_payment(
            user_id=user_id,
            amount=amount,
            billing_cycle=request.billing_cycle,
        )

        # Create subscription
        subscription = Subscription(
            user_id=user_id,
            plan_id=request.plan_id,
            status=SubscriptionStatus.ACTIVE,
            billing_cycle=BillingCycle(request.billing_cycle),
            amount=amount,
        )

        saved_subscription = await self.subscription_repository.save(subscription)
        return SubscriptionResponse.model_validate(saved_subscription)


class CancelSubscriptionUseCase:
    """Use case for cancelling subscription."""

    def __init__(self, subscription_repository: SubscriptionRepository):
        self.subscription_repository = subscription_repository

    async def execute(self, user_id: UUID) -> SubscriptionResponse:
        """Execute cancel subscription."""
        subscription = await self.subscription_repository.find_by_user_id(user_id)
        if not subscription:
            raise ValueError("No active subscription found")

        subscription.cancel()
        updated_subscription = await self.subscription_repository.save(subscription)
        return SubscriptionResponse.model_validate(updated_subscription)


class GetInvoicesUseCase:
    """Use case for getting user invoices."""

    def __init__(self):
        # In a real implementation, this would fetch from a database
        pass

    async def execute(self, user_id: UUID) -> List[InvoiceResponse]:
        """Execute get invoices."""
        # Placeholder implementation
        return []


# ==================== Activity Use Cases ====================

class GetActivitiesUseCase:
    """Use case for getting user activities."""

    def __init__(self, activity_repository: ActivityRepository):
        self.activity_repository = activity_repository

    async def execute(
        self,
        user_id: UUID,
        activity_type: Optional[str] = None,
        page: int = 1,
        page_size: int = 100
    ) -> PaginatedResponse[ActivityResponse]:
        """Execute get activities."""
        type_filter = ActivityType(activity_type) if activity_type else None
        offset = (page - 1) * page_size

        activities = await self.activity_repository.find_by_user_id(
            user_id=user_id,
            activity_type=type_filter,
            limit=page_size,
            offset=offset,
        )

        # For simplicity, we're not implementing total count for activities
        return PaginatedResponse(
            items=[ActivityResponse.model_validate(a) for a in activities],
            total=len(activities),
            page=page,
            page_size=page_size,
            total_pages=1,
        )


class CreateActivityUseCase:
    """Use case for creating an activity."""

    def __init__(self, activity_repository: ActivityRepository):
        self.activity_repository = activity_repository

    async def execute(
        self,
        user_id: UUID,
        request: ActivityCreateRequest
    ) -> ActivityResponse:
        """Execute create activity."""
        activity = Activity(
            user_id=user_id,
            type=ActivityType(request.type),
            title=request.title,
            description=request.description,
            status=request.status,
            status_type=request.status_type,
            meta=request.meta,
        )

        saved_activity = await self.activity_repository.save(activity)
        return ActivityResponse.model_validate(saved_activity)


# ==================== Document Use Cases ====================

class UploadDocumentUseCase:
    """Use case for uploading a document."""

    def __init__(
        self,
        document_repository: DocumentRepository,
        file_storage_service,
    ):
        self.document_repository = document_repository
        self.file_storage_service = file_storage_service

    async def execute(
        self,
        user_id: UUID,
        case_id: Optional[UUID],
        file_name: str,
        file_content: bytes,
        file_type: str
    ) -> DocumentUploadResponse:
        """Execute document upload."""
        # Store file
        file_path = await self.file_storage_service.store_file(
            user_id=user_id,
            file_name=file_name,
            file_content=file_content,
        )

        # Create document record
        document = Document(
            user_id=user_id,
            case_id=case_id,
            name=file_name,
            file_path=file_path,
            file_size=len(file_content),
            file_type=file_type,
            status="uploaded",
        )

        saved_document = await self.document_repository.save(document)

        return DocumentUploadResponse(
            document=DocumentResponse.model_validate(saved_document),
            message="Document uploaded successfully"
        )


class GetDocumentUseCase:
    """Use case for getting a document."""

    def __init__(self, document_repository: DocumentRepository):
        self.document_repository = document_repository

    async def execute(self, document_id: UUID) -> DocumentResponse:
        """Execute get document."""
        document = await self.document_repository.find_by_id(document_id)
        if not document:
            raise ValueError("Document not found")
        return DocumentResponse.model_validate(document)


class DeleteDocumentUseCase:
    """Use case for deleting a document."""

    def __init__(
        self,
        document_repository: DocumentRepository,
        file_storage_service,
    ):
        self.document_repository = document_repository
        self.file_storage_service = file_storage_service

    async def execute(self, document_id: UUID) -> bool:
        """Execute delete document."""
        document = await self.document_repository.find_by_id(document_id)
        if not document:
            raise ValueError("Document not found")

        # Delete file from storage
        await self.file_storage_service.delete_file(document.file_path)

        # Delete document record
        return await self.document_repository.delete(document_id)
