from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from uuid import uuid4, UUID
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    """User model representing application users."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: EmailStr = Field(index=True, unique=True)
    name: Optional[str]
    encrypted_private_key: str
    wallet_address: str = Field(unique=True, index=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow)


class UserResponse(SQLModel):
    """Response model for user data."""
    
    id: UUID
    email: EmailStr
    name: Optional[str]
    wallet_address: str
    joined_at: datetime