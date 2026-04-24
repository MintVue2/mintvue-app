import json
from sqlmodel import select
from app.models.content import Content
from core.redis import get_redis
from sqlalchemy.ext.asyncio import AsyncSession

FEED_CACHE_KEY = "content:feed"
FEED_TTL = 60  # seconds (tune later)


async def get_feed(db: AsyncSession):
    redis = get_redis()
    # 1. Check Redis
    cached = await redis.get(FEED_CACHE_KEY)
    if cached:
        return json.loads(cached)

    # 2. Fetch from DB
    result = await db.execute(select(Content).order_by(Content.created_at.desc()))
    contents = result.scalars().all()

    data = [
        {
            **c.dict(),
            "id": str(c.id),
            "creator_id": str(c.creator_id),
            "created_at": c.created_at.isoformat()
        }
        for c in contents
    ]

    # 3. Cache it
    redis = get_redis()
    await redis.set(FEED_CACHE_KEY, json.dumps(data), ex=FEED_TTL)

    return data