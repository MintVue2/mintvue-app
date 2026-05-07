from sqlmodel import SQLModel, Field
from uuid import uuid4, UUID
from typing import Optional
from enum import Enum


class MintStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FAILED = "failed"



class NFT(SQLModel, table=True):
    """NFT model representing a non-fungible token."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    content_id: UUID = Field(foreign_key="content.id", index=True)
    creator_id: UUID = Field(foreign_key="user.id")    
    token_id: Optional[str]
    contract_address: Optional[str] # This will be the "Mint Address"
    metadata_url: Optional[str]
    mint_status: MintStatus = Field(default=MintStatus.PENDING)
    supply: int = 1
    price: float = 0



class MintRequest(SQLModel):
    """Schema for minting a new NFT."""

    creator_id: UUID
    supply: int
    price: float


class MintResponse(SQLModel):
    """Schema for NFT response."""
    
    id: UUID
    content_id: UUID
    mint_address: str
    supply: int
    price: float