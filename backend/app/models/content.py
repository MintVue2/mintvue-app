from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from uuid import uuid4, UUID
from core.config import settings


class Content(SQLModel, table=True):
    """Content model representing user-generated content."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    creator_id: UUID = Field(foreign_key="user.id", index=True)
    media_url: str
    caption: Optional[str]
    description: str
    likes: int = 0
    views: int = 0
    is_mintable: bool = Field(default=False)
    minted: bool = Field(default=False)
    nft_id: Optional[UUID] = Field(default=None, foreign_key="nft.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def media_url_path(self):
        if self.media_url:
            return f'{settings.RAILWAY_BUCKET_ENDPOINT}/{settings.RAILWAY_BUCKET_NAME}/{self.media_url.split("/")[-1]}'



class ContentResponse(SQLModel):
    """Schema for content response."""

    id: UUID
    media_url: str
    created_at: datetime
    caption: Optional[str]
    description: str
    likes: int
    views: int
    is_mintable: bool
    minted: bool