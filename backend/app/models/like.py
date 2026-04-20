from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime


class Like(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    user_id: UUID = Field(foreign_key="user.id", index=True)
    content_id: UUID = Field(foreign_key="content.id", index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)