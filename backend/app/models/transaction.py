from sqlmodel import SQLModel, Field
from uuid import uuid4, UUID
from datetime import datetime
from enum import StrEnum
from typing import Optional


class TransactionStatus(StrEnum):
    """Enum for transaction types."""

    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"



class Transaction(SQLModel, table=True):
    """Transaction model representing a financial transaction."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    nft_id: UUID = Field(foreign_key="nft.id")
    amount: float
    status: TransactionStatus = Field(default=TransactionStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)