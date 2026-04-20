from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.content import Content, ContentCreate
from app.models.user import User
from sqlmodel import select
from uuid import UUID
from app.models.like import Like
from core.logger import logger
from core.redis import redis_client

LIKE_THRESHOLD=1000

async def create_content(req: ContentCreate, db: AsyncSession, user: User):
    content = Content(
        creator_id=user.id,
        media_url=req.media_url,
        caption=req.caption,
        description=req.description
    )
    db.add(content)
    await db.commit()
    await db.refresh(content)

    await redis_client.delete("content:feed")

    return content


async def like_content(content_id: UUID, db: AsyncSession, user: User):
    result = await db.execute(select(Content).where(Content.id == content_id))
    content = result.scalar_one_or_none()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    existing_like = await db.execute(
        select(Like).where(
            Like.user_id == user.id,
            Like.content_id == content_id
        )
    )

    if existing_like.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already liked")

    # ✅ 1. create like
    like = Like(user_id=user.id, content_id=content_id)
    db.add(like)

    # ✅ 2. update DB count (SOURCE OF TRUTH)
    content.likes += 1

    # ✅ 3. mint logic (DB-based)
    if content.likes >= LIKE_THRESHOLD and not content.is_mintable:
        content.is_mintable = True

    await db.commit()

    # ⚡ 4. OPTIONAL: update Redis cache (non-critical)
    await redis_client.delete("content:feed")

    return {
        "message": "Liked",
        "likes": content.likes,
        "is_mintable": content.is_mintable
    }




async def unlike_content(content_id: UUID, db: AsyncSession, user: User):
    result = await db.execute(
        select(Like).where(
            Like.user_id == user.id,
            Like.content_id == content_id
        )
    )

    like = result.scalar_one_or_none()

    if not like:
        raise HTTPException(status_code=404, detail="Like not found")

    await db.delete(like)

    content = await db.get(Content, content_id)
    content.likes = max(content.likes - 1, 0)  # safety

    await db.commit()

    # ⚡ invalidate cache
    await redis_client.delete("content:feed")

    return {"message": "Unliked"}




async def mint_status(
    content_id: UUID,
    db: AsyncSession
):
    result = await db.execute(
        select(Content).where(Content.id == content_id)
    )
    content = result.scalar_one_or_none()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return {
        "likes": content.likes,
        "is_mintable": content.is_mintable,
        "minted": content.minted
    }