"""
Repository implementations for domain repository interfaces.

These implementations use SQLAlchemy for database operations
and follow the repository pattern defined in the domain layer.
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

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
    SubscriptionStatus,
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
from src.infrastructure.database.models import (
    UserModel,
    LawyerModel,
    CaseModel,
    ActivityModel,
    MessageModel,
    SubscriptionModel,
    LawModel,
    DocumentModel,
    ConversationModel,
)


class UserRepositoryImpl(UserRepository):
    """SQLAlchemy implementation of UserRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, user: User) -> User:
        """Save a user (create or update)."""
        user_model = await self._to_model(user)
        self.session.add(user_model)
        await self.session.flush()
        return self._to_entity(user_model)

    async def find_by_id(self, user_id: UUID) -> Optional[User]:
        """Find a user by ID."""
        result = await self.session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user_model = result.scalar_one_or_none()
        return self._to_entity(user_model) if user_model else None

    async def find_by_email(self, email: Email) -> Optional[User]:
        """Find a user by email."""
        result = await self.session.execute(
            select(UserModel).where(UserModel.email == email.value)
        )
        user_model = result.scalar_one_or_none()
        return self._to_entity(user_model) if user_model else None

    async def find_all(self, limit: int = 100, offset: int = 0) -> List[User]:
        """Find all users with pagination."""
        result = await self.session.execute(
            select(UserModel).offset(offset).limit(limit)
        )
        user_models = result.scalars().all()
        return [self._to_entity(m) for m in user_models]

    async def delete(self, user_id: UUID) -> bool:
        """Delete a user by ID."""
        result = await self.session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user_model = result.scalar_one_or_none()
        if user_model:
            await self.session.delete(user_model)
            return True
        return False

    async def exists_by_email(self, email: Email) -> bool:
        """Check if a user with the given email exists."""
        result = await self.session.execute(
            select(func.count()).where(UserModel.email == email.value)
        )
        return result.scalar() > 0

    def _to_entity(self, model: UserModel) -> User:
        """Convert database model to domain entity."""
        return User(
            id=model.id,
            email=Email(model.email),
            hashed_password=model.hashed_password,
            name=model.name,
            role=model.role,
            avatar=model.avatar,
            jurisdiction=Jurisdiction(model.jurisdiction) if model.jurisdiction else None,
            is_active=model.is_active,
            is_verified=model.is_verified,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: User) -> UserModel:
        """Convert domain entity to database model."""
        return UserModel(
            id=entity.id,
            email=entity.email.value,
            hashed_password=entity.hashed_password,
            name=entity.name,
            role=entity.role,
            avatar=entity.avatar,
            jurisdiction=entity.jurisdiction.value if entity.jurisdiction else None,
            is_active=entity.is_active,
            is_verified=entity.is_verified,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


class LawyerRepositoryImpl(LawyerRepository):
    """SQLAlchemy implementation of LawyerRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, lawyer: Lawyer) -> Lawyer:
        """Save a lawyer (create or update)."""
        lawyer_model = await self._to_model(lawyer)
        self.session.add(lawyer_model)
        await self.session.flush()
        return self._to_entity(lawyer_model)

    async def find_by_id(self, lawyer_id: UUID) -> Optional[Lawyer]:
        """Find a lawyer by ID."""
        result = await self.session.execute(
            select(LawyerModel).where(LawyerModel.id == lawyer_id)
        )
        lawyer_model = result.scalar_one_or_none()
        return self._to_entity(lawyer_model) if lawyer_model else None

    async def find_all(
        self,
        jurisdiction: Optional[Jurisdiction] = None,
        specialty: Optional[str] = None,
        location: Optional[str] = None,
        min_rating: Optional[float] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Lawyer]:
        """Find lawyers with optional filters."""
        query = select(LawyerModel).where(LawyerModel.is_active == True)

        if jurisdiction:
            query = query.where(LawyerModel.jurisdiction == jurisdiction.value)
        if specialty:
            query = query.where(LawyerModel.specialty.ilike(f"%{specialty}%"))
        if location:
            query = query.where(LawyerModel.location.ilike(f"%{location}%"))
        if min_rating:
            query = query.where(LawyerModel.rating >= min_rating)

        query = query.offset(offset).limit(limit)
        result = await self.session.execute(query)
        lawyer_models = result.scalars().all()
        return [self._to_entity(m) for m in lawyer_models]

    async def search(self, query: str, limit: int = 20) -> List[Lawyer]:
        """Search lawyers by name, specialty, or bio."""
        search_query = select(LawyerModel).where(
            and_(
                LawyerModel.is_active == True,
                or_(
                    LawyerModel.name.ilike(f"%{query}%"),
                    LawyerModel.specialty.ilike(f"%{query}%"),
                    LawyerModel.bio.ilike(f"%{query}%"),
                )
            )
        ).limit(limit)

        result = await self.session.execute(search_query)
        lawyer_models = result.scalars().all()
        return [self._to_entity(m) for m in lawyer_models]

    async def delete(self, lawyer_id: UUID) -> bool:
        """Delete a lawyer by ID."""
        result = await self.session.execute(
            select(LawyerModel).where(LawyerModel.id == lawyer_id)
        )
        lawyer_model = result.scalar_one_or_none()
        if lawyer_model:
            await self.session.delete(lawyer_model)
            return True
        return False

    async def count(self, jurisdiction: Optional[Jurisdiction] = None) -> int:
        """Count lawyers with optional jurisdiction filter."""
        query = select(func.count()).select_from(LawyerModel)
        if jurisdiction:
            query = query.where(LawyerModel.jurisdiction == jurisdiction.value)
        result = await self.session.execute(query)
        return result.scalar()

    def _to_entity(self, model: LawyerModel) -> Lawyer:
        """Convert database model to domain entity."""
        return Lawyer(
            id=model.id,
            name=model.name,
            specialty=model.specialty,
            jurisdiction=Jurisdiction(model.jurisdiction),
            location=model.location,
            rating=model.rating,
            review_count=model.review_count,
            experience=model.experience,
            level=model.level,
            bar_number=model.bar_number,
            profile_image=model.profile_image,
            bio=model.bio,
            is_active=model.is_active,
            match_score=model.match_score,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: Lawyer) -> LawyerModel:
        """Convert domain entity to database model."""
        return LawyerModel(
            id=entity.id,
            name=entity.name,
            specialty=entity.specialty,
            jurisdiction=entity.jurisdiction.value,
            location=entity.location,
            rating=entity.rating,
            review_count=entity.review_count,
            experience=entity.experience,
            level=entity.level,
            bar_number=entity.bar_number,
            profile_image=entity.profile_image,
            bio=entity.bio,
            is_active=entity.is_active,
            match_score=entity.match_score,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


class CaseRepositoryImpl(CaseRepository):
    """SQLAlchemy implementation of CaseRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, case: Case) -> Case:
        """Save a case (create or update)."""
        case_model = await self._to_model(case)
        self.session.add(case_model)
        await self.session.flush()
        return self._to_entity(case_model)

    async def find_by_id(self, case_id: UUID) -> Optional[Case]:
        """Find a case by ID."""
        result = await self.session.execute(
            select(CaseModel).where(CaseModel.id == case_id)
        )
        case_model = result.scalar_one_or_none()
        return self._to_entity(case_model) if case_model else None

    async def find_by_user_id(
        self,
        user_id: UUID,
        status: Optional[CaseStatus] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Case]:
        """Find cases by user ID with optional status filter."""
        query = select(CaseModel).where(CaseModel.user_id == user_id)

        if status:
            query = query.where(CaseModel.status == status.value)

        query = query.order_by(CaseModel.created_at.desc()).offset(offset).limit(limit)
        result = await self.session.execute(query)
        case_models = result.scalars().all()
        return [self._to_entity(m) for m in case_models]

    async def delete(self, case_id: UUID) -> bool:
        """Delete a case by ID."""
        result = await self.session.execute(
            select(CaseModel).where(CaseModel.id == case_id)
        )
        case_model = result.scalar_one_or_none()
        if case_model:
            await self.session.delete(case_model)
            return True
        return False

    async def count_by_user_id(self, user_id: UUID) -> int:
        """Count cases for a user."""
        result = await self.session.execute(
            select(func.count()).select_from(CaseModel).where(CaseModel.user_id == user_id)
        )
        return result.scalar()

    def _to_entity(self, model: CaseModel) -> Case:
        """Convert database model to domain entity."""
        return Case(
            id=model.id,
            user_id=model.user_id,
            title=model.title,
            status=CaseStatus(model.status),
            progress=model.progress,
            description=model.description,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: Case) -> CaseModel:
        """Convert domain entity to database model."""
        return CaseModel(
            id=entity.id,
            user_id=entity.user_id,
            title=entity.title,
            status=entity.status.value,
            progress=entity.progress,
            description=entity.description,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


class ActivityRepositoryImpl(ActivityRepository):
    """SQLAlchemy implementation of ActivityRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, activity: Activity) -> Activity:
        """Save an activity (create or update)."""
        activity_model = await self._to_model(activity)
        self.session.add(activity_model)
        await self.session.flush()
        return self._to_entity(activity_model)

    async def find_by_id(self, activity_id: UUID) -> Optional[Activity]:
        """Find an activity by ID."""
        result = await self.session.execute(
            select(ActivityModel).where(ActivityModel.id == activity_id)
        )
        activity_model = result.scalar_one_or_none()
        return self._to_entity(activity_model) if activity_model else None

    async def find_by_user_id(
        self,
        user_id: UUID,
        activity_type: Optional[ActivityType] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Activity]:
        """Find activities by user ID with optional type filter."""
        query = select(ActivityModel).where(ActivityModel.user_id == user_id)

        if activity_type:
            query = query.where(ActivityModel.type == activity_type.value)

        query = query.order_by(ActivityModel.created_at.desc()).offset(offset).limit(limit)
        result = await self.session.execute(query)
        activity_models = result.scalars().all()
        return [self._to_entity(m) for m in activity_models]

    async def delete(self, activity_id: UUID) -> bool:
        """Delete an activity by ID."""
        result = await self.session.execute(
            select(ActivityModel).where(ActivityModel.id == activity_id)
        )
        activity_model = result.scalar_one_or_none()
        if activity_model:
            await self.session.delete(activity_model)
            return True
        return False

    async def delete_old_activities(self, days: int = 90) -> int:
        """Delete activities older than specified days."""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        result = await self.session.execute(
            select(ActivityModel).where(ActivityModel.created_at < cutoff_date)
        )
        activity_models = result.scalars().all()
        for model in activity_models:
            await self.session.delete(model)
        return len(activity_models)

    def _to_entity(self, model: ActivityModel) -> Activity:
        """Convert database model to domain entity."""
        return Activity(
            id=model.id,
            user_id=model.user_id,
            type=ActivityType(model.type),
            title=model.title,
            description=model.description,
            status=model.status,
            status_type=model.status_type,
            meta=model.meta,
            created_at=model.created_at,
        )

    def _to_model(self, entity: Activity) -> ActivityModel:
        """Convert domain entity to database model."""
        return ActivityModel(
            id=entity.id,
            user_id=entity.user_id,
            type=entity.type.value,
            title=entity.title,
            description=entity.description,
            status=entity.status,
            status_type=entity.status_type,
            meta=entity.meta,
            created_at=entity.created_at,
        )


class MessageRepositoryImpl(MessageRepository):
    """SQLAlchemy implementation of MessageRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, message: Message) -> Message:
        """Save a message (create or update)."""
        message_model = await self._to_model(message)
        self.session.add(message_model)
        await self.session.flush()
        return self._to_entity(message_model)

    async def find_by_id(self, message_id: UUID) -> Optional[Message]:
        """Find a message by ID."""
        result = await self.session.execute(
            select(MessageModel).where(MessageModel.id == message_id)
        )
        message_model = result.scalar_one_or_none()
        return self._to_entity(message_model) if message_model else None

    async def find_by_conversation_id(
        self,
        conversation_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Message]:
        """Find messages by conversation ID."""
        query = select(MessageModel).where(
            MessageModel.conversation_id == conversation_id
        ).order_by(MessageModel.created_at.asc()).offset(offset).limit(limit)

        result = await self.session.execute(query)
        message_models = result.scalars().all()
        return [self._to_entity(m) for m in message_models]

    async def delete(self, message_id: UUID) -> bool:
        """Delete a message by ID."""
        result = await self.session.execute(
            select(MessageModel).where(MessageModel.id == message_id)
        )
        message_model = result.scalar_one_or_none()
        if message_model:
            await self.session.delete(message_model)
            return True
        return False

    async def delete_by_conversation_id(self, conversation_id: UUID) -> int:
        """Delete all messages in a conversation."""
        result = await self.session.execute(
            select(MessageModel).where(MessageModel.conversation_id == conversation_id)
        )
        message_models = result.scalars().all()
        for model in message_models:
            await self.session.delete(model)
        return len(message_models)

    def _to_entity(self, model: MessageModel) -> Message:
        """Convert database model to domain entity."""
        from src.domain.value_objects import MessageRole
        return Message(
            id=model.id,
            conversation_id=model.conversation_id,
            role=MessageRole(model.role),
            content=model.content,
            created_at=model.created_at,
        )

    def _to_model(self, entity: Message) -> MessageModel:
        """Convert domain entity to database model."""
        return MessageModel(
            id=entity.id,
            conversation_id=entity.conversation_id,
            role=entity.role.value,
            content=entity.content,
            created_at=entity.created_at,
        )


class SubscriptionRepositoryImpl(SubscriptionRepository):
    """SQLAlchemy implementation of SubscriptionRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, subscription: Subscription) -> Subscription:
        """Save a subscription (create or update)."""
        subscription_model = await self._to_model(subscription)
        self.session.add(subscription_model)
        await self.session.flush()
        return self._to_entity(subscription_model)

    async def find_by_id(self, subscription_id: UUID) -> Optional[Subscription]:
        """Find a subscription by ID."""
        result = await self.session.execute(
            select(SubscriptionModel).where(SubscriptionModel.id == subscription_id)
        )
        subscription_model = result.scalar_one_or_none()
        return self._to_entity(subscription_model) if subscription_model else None

    async def find_by_user_id(self, user_id: UUID) -> Optional[Subscription]:
        """Find active subscription for a user."""
        result = await self.session.execute(
            select(SubscriptionModel).where(
                and_(
                    SubscriptionModel.user_id == user_id,
                    SubscriptionModel.status == SubscriptionStatus.ACTIVE.value,
                )
            ).order_by(SubscriptionModel.created_at.desc())
        )
        subscription_model = result.scalar_one_or_none()
        return self._to_entity(subscription_model) if subscription_model else None

    async def find_all_by_user_id(self, user_id: UUID) -> List[Subscription]:
        """Find all subscriptions for a user."""
        result = await self.session.execute(
            select(SubscriptionModel).where(SubscriptionModel.user_id == user_id)
            .order_by(SubscriptionModel.created_at.desc())
        )
        subscription_models = result.scalars().all()
        return [self._to_entity(m) for m in subscription_models]

    async def delete(self, subscription_id: UUID) -> bool:
        """Delete a subscription by ID."""
        result = await self.session.execute(
            select(SubscriptionModel).where(SubscriptionModel.id == subscription_id)
        )
        subscription_model = result.scalar_one_or_none()
        if subscription_model:
            await self.session.delete(subscription_model)
            return True
        return False

    async def find_expiring_subscriptions(self, days: int = 7) -> List[Subscription]:
        """Find subscriptions expiring within specified days."""
        cutoff_date = datetime.utcnow() + timedelta(days=days)
        result = await self.session.execute(
            select(SubscriptionModel).where(
                and_(
                    SubscriptionModel.status == SubscriptionStatus.ACTIVE.value,
                    SubscriptionModel.ends_at <= cutoff_date,
                    SubscriptionModel.ends_at > datetime.utcnow(),
                )
            )
        )
        subscription_models = result.scalars().all()
        return [self._to_entity(m) for m in subscription_models]

    def _to_entity(self, model: SubscriptionModel) -> Subscription:
        """Convert database model to domain entity."""
        from src.domain.value_objects import BillingCycle
        return Subscription(
            id=model.id,
            user_id=model.user_id,
            plan_id=model.plan_id,
            status=SubscriptionStatus(model.status),
            billing_cycle=BillingCycle(model.billing_cycle),
            amount=float(model.amount) if model.amount else None,
            started_at=model.started_at,
            ends_at=model.ends_at,
            cancelled_at=model.cancelled_at,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: Subscription) -> SubscriptionModel:
        """Convert domain entity to database model."""
        return SubscriptionModel(
            id=entity.id,
            user_id=entity.user_id,
            plan_id=entity.plan_id,
            status=entity.status.value,
            billing_cycle=entity.billing_cycle.value,
            amount=entity.amount,
            started_at=entity.started_at,
            ends_at=entity.ends_at,
            cancelled_at=entity.cancelled_at,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


class LawRepositoryImpl(LawRepository):
    """SQLAlchemy implementation of LawRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, law: Law) -> Law:
        """Save a law (create or update)."""
        law_model = await self._to_model(law)
        self.session.add(law_model)
        await self.session.flush()
        return self._to_entity(law_model)

    async def find_by_id(self, law_id: UUID) -> Optional[Law]:
        """Find a law by ID."""
        result = await self.session.execute(
            select(LawModel).where(LawModel.id == law_id)
        )
        law_model = result.scalar_one_or_none()
        return self._to_entity(law_model) if law_model else None

    async def find_by_code(self, code: str) -> Optional[Law]:
        """Find a law by code."""
        result = await self.session.execute(
            select(LawModel).where(LawModel.code == code)
        )
        law_model = result.scalar_one_or_none()
        return self._to_entity(law_model) if law_model else None

    async def find_by_jurisdiction(
        self,
        jurisdiction: Jurisdiction,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Law]:
        """Find laws by jurisdiction."""
        query = select(LawModel).where(
            LawModel.jurisdiction == jurisdiction.value
        ).offset(offset).limit(limit)

        result = await self.session.execute(query)
        law_models = result.scalars().all()
        return [self._to_entity(m) for m in law_models]

    async def search(
        self,
        query: str,
        jurisdiction: Optional[Jurisdiction] = None,
        limit: int = 20,
    ) -> List[Law]:
        """Full-text search for laws."""
        search_query = select(LawModel).where(
            or_(
                LawModel.title.ilike(f"%{query}%"),
                LawModel.code.ilike(f"%{query}%"),
                LawModel.summary.ilike(f"%{query}%"),
            )
        )

        if jurisdiction:
            search_query = search_query.where(
                LawModel.jurisdiction == jurisdiction.value
            )

        search_query = search_query.limit(limit)
        result = await self.session.execute(search_query)
        law_models = result.scalars().all()
        return [self._to_entity(m) for m in law_models]

    async def find_by_tags(
        self,
        tags: List[str],
        jurisdiction: Optional[Jurisdiction] = None,
        limit: int = 100,
    ) -> List[Law]:
        """Find laws by tags."""
        query = select(LawModel).where(LawModel.tags.overlap(tags))

        if jurisdiction:
            query = query.where(LawModel.jurisdiction == jurisdiction.value)

        query = query.limit(limit)
        result = await self.session.execute(query)
        law_models = result.scalars().all()
        return [self._to_entity(m) for m in law_models]

    async def delete(self, law_id: UUID) -> bool:
        """Delete a law by ID."""
        result = await self.session.execute(
            select(LawModel).where(LawModel.id == law_id)
        )
        law_model = result.scalar_one_or_none()
        if law_model:
            await self.session.delete(law_model)
            return True
        return False

    def _to_entity(self, model: LawModel) -> Law:
        """Convert database model to domain entity."""
        return Law(
            id=model.id,
            code=model.code,
            title=model.title,
            jurisdiction=Jurisdiction(model.jurisdiction),
            summary=model.summary,
            explanation=model.explanation,
            tags=model.tags,
            related_cases=model.related_cases,
            sources=model.sources,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: Law) -> LawModel:
        """Convert domain entity to database model."""
        return LawModel(
            id=entity.id,
            code=entity.code,
            title=entity.title,
            jurisdiction=entity.jurisdiction.value,
            summary=entity.summary,
            explanation=entity.explanation,
            tags=entity.tags,
            related_cases=entity.related_cases,
            sources=entity.sources,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


class DocumentRepositoryImpl(DocumentRepository):
    """SQLAlchemy implementation of DocumentRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, document: Document) -> Document:
        """Save a document (create or update)."""
        document_model = await self._to_model(document)
        self.session.add(document_model)
        await self.session.flush()
        return self._to_entity(document_model)

    async def find_by_id(self, document_id: UUID) -> Optional[Document]:
        """Find a document by ID."""
        result = await self.session.execute(
            select(DocumentModel).where(DocumentModel.id == document_id)
        )
        document_model = result.scalar_one_or_none()
        return self._to_entity(document_model) if document_model else None

    async def find_by_user_id(
        self,
        user_id: UUID,
        case_id: Optional[UUID] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Document]:
        """Find documents by user ID with optional case filter."""
        query = select(DocumentModel).where(DocumentModel.user_id == user_id)

        if case_id:
            query = query.where(DocumentModel.case_id == case_id)

        query = query.order_by(DocumentModel.created_at.desc()).offset(offset).limit(limit)
        result = await self.session.execute(query)
        document_models = result.scalars().all()
        return [self._to_entity(m) for m in document_models]

    async def find_by_case_id(
        self,
        case_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Document]:
        """Find documents by case ID."""
        query = select(DocumentModel).where(
            DocumentModel.case_id == case_id
        ).order_by(DocumentModel.created_at.desc()).offset(offset).limit(limit)

        result = await self.session.execute(query)
        document_models = result.scalars().all()
        return [self._to_entity(m) for m in document_models]

    async def delete(self, document_id: UUID) -> bool:
        """Delete a document by ID."""
        result = await self.session.execute(
            select(DocumentModel).where(DocumentModel.id == document_id)
        )
        document_model = result.scalar_one_or_none()
        if document_model:
            await self.session.delete(document_model)
            return True
        return False

    async def delete_by_case_id(self, case_id: UUID) -> int:
        """Delete all documents in a case."""
        result = await self.session.execute(
            select(DocumentModel).where(DocumentModel.case_id == case_id)
        )
        document_models = result.scalars().all()
        for model in document_models:
            await self.session.delete(model)
        return len(document_models)

    def _to_entity(self, model: DocumentModel) -> Document:
        """Convert database model to domain entity."""
        return Document(
            id=model.id,
            user_id=model.user_id,
            case_id=model.case_id,
            name=model.name,
            file_path=model.file_path,
            file_size=model.file_size,
            file_type=model.file_type,
            status=model.status,
            created_at=model.created_at,
        )

    def _to_model(self, entity: Document) -> DocumentModel:
        """Convert domain entity to database model."""
        return DocumentModel(
            id=entity.id,
            user_id=entity.user_id,
            case_id=entity.case_id,
            name=entity.name,
            file_path=entity.file_path,
            file_size=entity.file_size,
            file_type=entity.file_type,
            status=entity.status,
            created_at=entity.created_at,
        )


class ConversationRepositoryImpl(ConversationRepository):
    """SQLAlchemy implementation of ConversationRepository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def save(self, conversation: Conversation) -> Conversation:
        """Save a conversation (create or update)."""
        conversation_model = await self._to_model(conversation)
        self.session.add(conversation_model)
        await self.session.flush()
        return self._to_entity(conversation_model)

    async def find_by_id(self, conversation_id: UUID) -> Optional[Conversation]:
        """Find a conversation by ID."""
        result = await self.session.execute(
            select(ConversationModel).where(ConversationModel.id == conversation_id)
        )
        conversation_model = result.scalar_one_or_none()
        return self._to_entity(conversation_model) if conversation_model else None

    async def find_by_user_id(
        self,
        user_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Conversation]:
        """Find conversations by user ID."""
        query = select(ConversationModel).where(
            ConversationModel.user_id == user_id
        ).order_by(ConversationModel.updated_at.desc()).offset(offset).limit(limit)

        result = await self.session.execute(query)
        conversation_models = result.scalars().all()
        return [self._to_entity(m) for m in conversation_models]

    async def delete(self, conversation_id: UUID) -> bool:
        """Delete a conversation by ID."""
        result = await self.session.execute(
            select(ConversationModel).where(ConversationModel.id == conversation_id)
        )
        conversation_model = result.scalar_one_or_none()
        if conversation_model:
            await self.session.delete(conversation_model)
            return True
        return False

    async def delete_by_user_id(self, user_id: UUID) -> int:
        """Delete all conversations for a user."""
        result = await self.session.execute(
            select(ConversationModel).where(ConversationModel.user_id == user_id)
        )
        conversation_models = result.scalars().all()
        for model in conversation_models:
            await self.session.delete(model)
        return len(conversation_models)

    async def count_by_user_id(self, user_id: UUID) -> int:
        """Count conversations for a user."""
        result = await self.session.execute(
            select(func.count()).select_from(ConversationModel).where(
                ConversationModel.user_id == user_id
            )
        )
        return result.scalar()

    def _to_entity(self, model: ConversationModel) -> Conversation:
        """Convert database model to domain entity."""
        return Conversation(
            id=model.id,
            user_id=model.user_id,
            title=model.title,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: Conversation) -> ConversationModel:
        """Convert domain entity to database model."""
        return ConversationModel(
            id=entity.id,
            user_id=entity.user_id,
            title=entity.title,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


# Export repository implementations
UserRepository = UserRepositoryImpl
LawyerRepository = LawyerRepositoryImpl
CaseRepository = CaseRepositoryImpl
ActivityRepository = ActivityRepositoryImpl
MessageRepository = MessageRepositoryImpl
SubscriptionRepository = SubscriptionRepositoryImpl
LawRepository = LawRepositoryImpl
DocumentRepository = DocumentRepositoryImpl
ConversationRepository = ConversationRepositoryImpl
