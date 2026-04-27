from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import uuid4, UUID
from enum import Enum

class ThumbNailStatus(str, Enum):
    PENDING = 'pending'
    PROCESSING = 'processing'
    READY = 'ready'
    FAILED = 'failed'


class Content(SQLModel, table=True):
    """Content model representing user-generated content."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    creator_id: UUID = Field(foreign_key="user.id", index=True)
    media_url: str
    thumbnail_url: str | None = None
    thumbnail_status: ThumbNailStatus = Field(default=ThumbNailStatus.PENDING)
    caption: Optional[str]
    description: str
    likes: int = 0
    views: int = 0
    is_mintable: bool = Field(default=False)
    minted: bool = Field(default=False)
    nft_id: Optional[UUID] = Field(default=None, foreign_key="nft.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ContentCreate(SQLModel):
    """Schema for creating new content."""
    
    caption: Optional[str]
    description: str


class ContentResponse(Content):
    """Schema for content response."""
    ...