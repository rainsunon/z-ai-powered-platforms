from sqlalchemy import Column, String, Boolean, DateTime, Numeric, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    notifications = relationship("Notification", back_populates="user")

class Client(Base):
    __tablename__ = "clients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String)
    details = Column(JSONB)  # details like address, phone, initials, color, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    invoices = relationship("Invoice", back_populates="client")
    time_entries = relationship("TimeEntry", back_populates="client")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False)  # Draft, Sent, Paid, Overdue
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True))
    details = Column(JSONB)  # items array, description, etc.

    client = relationship("Client", back_populates="invoices")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    amount = Column(Numeric(10, 2), nullable=False)
    merchant = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, nullable=False)  # Pending, Reconciled, etc.
    date = Column(DateTime(timezone=True), nullable=False)
    details = Column(JSONB)  # receipt_url, merchant_logo, merchant_initials

class TimeEntry(Base):
    __tablename__ = "time_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    project = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)  # in seconds or minutes
    date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, nullable=False)  # Billed, Unbilled
    details = Column(JSONB)  # description, start/end times

    client = relationship("Client", back_populates="time_entries")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(JSONB)  # message content, priority, sender info

    user = relationship("User", back_populates="notifications")
