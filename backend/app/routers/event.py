from app.models.event import EventCreate, EventDTO
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from app.service.event import create_event, list_events, get_event_by_id, delete_event
from core.session import get_session
from core.security import get_current_user
from typing import Annotated, List
from uuid import UUID

router = APIRouter(
    prefix="/events",
    tags=["events"]
)

@router.post("/", response_model=EventDTO, status_code=201)
async def create_event_endpoint(
    req: EventCreate,
    db: Annotated[AsyncSession, Depends(get_session)],
    current_user: Annotated[str, Depends(get_current_user)]
):
    """Endpoint to create a new event."""
    return await create_event(db, req)


@router.get("/", response_model=List[EventDTO])
async def list_events_endpoint(
    db: Annotated[AsyncSession, Depends(get_session)],
    current_user: Annotated[str, Depends(get_current_user)]
):
    """Endpoint to list all events."""
    events = await list_events(db)
    return events


@router.get("/{event_id}", response_model=EventDTO)
async def get_event_by_id_endpoint(
    event_id: UUID,
    db: Annotated[AsyncSession, Depends(get_session)],
    current_user: Annotated[str, Depends(get_current_user)]
):
    """Endpoint to get an event by its ID."""
    return await get_event_by_id(db, event_id)


@router.delete("/{event_id}", status_code=204)
async def delete_event_endpoint(
    event_id: UUID,
    db: Annotated[AsyncSession, Depends(get_session)],
    current_user: Annotated[str, Depends(get_current_user)]
):
    """Endpoint to delete an event by its ID."""
    await delete_event(db, event_id)
    return {"detail": "Event deleted successfully."}