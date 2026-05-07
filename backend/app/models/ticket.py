from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import StrEnum


class TicketStatus(StrEnum):
    """Ticket statuses"""

    ACTIVE = 'active'
    USED = 'used'
    EXPIRED = 'expired'


class Ticket(SQLModel, table=True):
    """Model for Event Tickets"""

    event_id: UUID = Field(foreign_key="event.id", index=True)
    code: UUID = Field(default_factory=uuid4, primary_key=True)
    price: float = Field(..., description='Ticket price')
    start_date: datetime
    end_date: datetime
    status: TicketStatus = Field(default=TicketStatus.ACTIVE)
    created_at: datetime = Field(default_factory=datetime.utcnow)