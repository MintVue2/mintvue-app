from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models import Event
from app.models.event import EventCreate
from fastapi import HTTPException, status
from core.logger import logger
from uuid import UUID


async def create_event(db: AsyncSession, req: EventCreate):
    """Create a new event in the database."""
    logger.info(f"Creating event with title: {req.title}")

    result = await db.execute(
        select(Event).where(Event.title == req.title)
    )

    existing_event = result.scalar_one_or_none()

    if existing_event:
        logger.warning(f"Event creation failed: Event with title '{req.title}' already exists.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event with this ID already exists."
        )
    
    new_event = Event(
        title=req.title,
        description=req.description,
        media_url=req.media_url,
        location=req.location,
        date=req.date
    )
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    logger.info(f"Event created successfully with ID: {new_event.id}")
    return new_event



async def list_events(db: AsyncSession):
    """List all events from the database."""
    
    logger.info("Listing all events.")
    result = await db.execute(select(Event))
    events = result.scalars().all()
    logger.info(f"Retrieved {len(events)} events.")
    return events



async def get_event_by_id(db: AsyncSession, event_id: UUID):
    """Get an event by its ID."""

    logger.info(f"Fetching event with ID: {event_id}")
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        logger.warning(f"Event with ID '{event_id}' not found.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found."
        )
    logger.info(f"Event with ID '{event_id}' retrieved successfully.")
    return event



async def delete_event(db: AsyncSession, event_id: UUID):
    """Delete an event by its ID."""

    logger.info(f"Deleting event with ID: {event_id}")
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        logger.warning(f"Event with ID '{event_id}' not found for deletion.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found."
        )
    await db.delete(event)
    await db.commit()
    logger.info(f"Event with ID '{event_id}' deleted successfully.")