from uuid import UUID

from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.content import Content
from app.models.like import Like
from core.logger import logger

FEED_CACHE_KEY = "content:feed"
FEED_TTL = 60  # seconds


async def get_feed(db: AsyncSession, user_id: UUID):
    # Fetch all content newest first
    result = await db.execute(select(Content).order_by(desc(Content.created_at)))  # type: ignore[arg-type]
    contents = result.scalars().all()

    # Fetch content IDs already liked by this user
    liked_result = await db.execute(
        select(Like.content_id).where(Like.user_id == user_id)
    )
    liked_ids = {str(lid) for lid in liked_result.scalars().all()}

    data = [
        {
            **c.dict(),
            "id": str(c.id),
            "creator_id": str(c.creator_id),
            "created_at": c.created_at.isoformat(),
            "liked_by_me": str(c.id) in liked_ids,
        }
        for c in contents
    ]

    return data
