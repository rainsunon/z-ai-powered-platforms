import strawberry
from strawberry.types import Info
from typing import List, Optional
import uuid
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from database import get_db
import models

# --- Types ---

@strawberry.type
class User:
    id: uuid.UUID
    email: str
    full_name: Optional[str]
    created_at: Optional[datetime]

@strawberry.type
class Client:
    id: uuid.UUID
    name: str
    email: Optional[str]
    details: Optional[strawberry.scalars.JSON]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

@strawberry.type
class Invoice:
    id: uuid.UUID
    client_id: uuid.UUID
    amount: float
    status: str
    created_at: Optional[datetime]
    due_date: Optional[datetime]
    details: Optional[strawberry.scalars.JSON]

@strawberry.type
class Expense:
    id: uuid.UUID
    amount: float
    merchant: str
    category: str
    status: str
    date: datetime
    details: Optional[strawberry.scalars.JSON]

@strawberry.type
class TimeEntry:
    id: uuid.UUID
    client_id: uuid.UUID
    project: str
    duration: int
    date: datetime
    status: str
    details: Optional[strawberry.scalars.JSON]

@strawberry.type
class Notification:
    id: uuid.UUID
    type: str
    read: bool
    created_at: Optional[datetime]
    details: Optional[strawberry.scalars.JSON]

# --- Inputs ---

@strawberry.input
class ClientInput:
    name: str
    email: Optional[str] = None
    details: Optional[strawberry.scalars.JSON] = None

@strawberry.input
class InvoiceInput:
    client_id: uuid.UUID
    amount: float
    status: str = "Draft"
    due_date: Optional[datetime] = None
    details: Optional[strawberry.scalars.JSON] = None

@strawberry.input
class ExpenseInput:
    amount: float
    merchant: str
    category: str
    status: str = "Pending"
    date: datetime
    details: Optional[strawberry.scalars.JSON] = None

@strawberry.input
class TimeEntryInput:
    client_id: uuid.UUID
    project: str
    duration: int
    date: datetime
    status: str = "Unbilled"
    details: Optional[strawberry.scalars.JSON] = None

# --- Query ---

@strawberry.type
class Query:
    @strawberry.field
    async def clients(self, info: Info) -> List[Client]:
        async for session in get_db():
            result = await session.execute(select(models.Client))
            return result.scalars().all()

    @strawberry.field
    async def invoices(self, info: Info, client_id: Optional[uuid.UUID] = None) -> List[Invoice]:
        async for session in get_db():
            query = select(models.Invoice)
            if client_id:
                query = query.where(models.Invoice.client_id == client_id)
            result = await session.execute(query)
            return result.scalars().all()

    @strawberry.field
    async def expenses(self, info: Info) -> List[Expense]:
        async for session in get_db():
            result = await session.execute(select(models.Expense))
            return result.scalars().all()

    @strawberry.field
    async def time_entries(self, info: Info, client_id: Optional[uuid.UUID] = None) -> List[TimeEntry]:
        async for session in get_db():
            query = select(models.TimeEntry)
            if client_id:
                query = query.where(models.TimeEntry.client_id == client_id)
            result = await session.execute(query)
            return result.scalars().all()

    @strawberry.field
    async def notifications(self, info: Info, user_id: Optional[uuid.UUID] = None) -> List[Notification]:
        async for session in get_db():
            query = select(models.Notification)
            if user_id:
                query = query.where(models.Notification.user_id == user_id)
            result = await session.execute(query)
            return result.scalars().all()

# --- Mutation ---

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_client(self, input: ClientInput) -> Client:
        async for session in get_db():
            client = models.Client(
                name=input.name,
                email=input.email,
                details=input.details
            )
            session.add(client)
            await session.commit()
            await session.refresh(client)
            return client

    @strawberry.mutation
    async def create_invoice(self, input: InvoiceInput) -> Invoice:
        async for session in get_db():
            invoice = models.Invoice(
                client_id=input.client_id,
                amount=input.amount,
                status=input.status,
                due_date=input.due_date,
                details=input.details
            )
            session.add(invoice)
            await session.commit()
            await session.refresh(invoice)
            return invoice

    @strawberry.mutation
    async def create_expense(self, input: ExpenseInput) -> Expense:
        async for session in get_db():
            expense = models.Expense(
                amount=input.amount,
                merchant=input.merchant,
                category=input.category,
                status=input.status,
                date=input.date,
                details=input.details
            )
            session.add(expense)
            await session.commit()
            await session.refresh(expense)
            return expense

    @strawberry.mutation
    async def log_time(self, input: TimeEntryInput) -> TimeEntry:
        async for session in get_db():
            entry = models.TimeEntry(
                client_id=input.client_id,
                project=input.project,
                duration=input.duration,
                date=input.date,
                status=input.status,
                details=input.details
            )
            session.add(entry)
            await session.commit()
            await session.refresh(entry)
            return entry

schema = strawberry.Schema(query=Query, mutation=Mutation)
