from sqlmodel import SQLModel, Field
from uuid import uuid4, UUID
from typing import Optional
from datetime import datetime


class Event(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    description: Optional[str] = None
    media_url: Optional[str] = None
    location: str
    date: datetime = Field(default_factory=datetime.utcnow)


class EventCreate(SQLModel):
    title: str
    description: Optional[str] = None
    media_url: Optional[str] = None
    location: str
    date: datetime = Field(default_factory=datetime.utcnow)


class EventDTO(SQLModel):
    id: UUID
    title: str
    description: Optional[str] = None
    media_url: Optional[str] = None
    location: str
    date: datetime