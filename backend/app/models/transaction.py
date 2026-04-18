from sqlmodel import SQLModel, Field
from uuid import uuid4, UUID
from datetime import datetime
from enum import Enum
from typing import Optional


class TransactionType(str, Enum):
    """Enum for transaction types."""

    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"



class Transaction(SQLModel, table=True):
    """Transaction model representing a financial transaction."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    nft_id: UUID = Field(foreign_key="nft.id")
    buyer_id: UUID = Field(foreign_key="user.id")
    seller_id: UUID = Field(foreign_key="user.id")
    amount: float
    tx_hash: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)