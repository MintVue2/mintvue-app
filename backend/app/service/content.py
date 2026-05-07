from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, UploadFile
from app.models.content import Content
from app.models.user import User
from sqlmodel import select
from uuid import UUID
from app.models.like import Like
from core.logger import logger
from core.redis import get_redis
from app.service.s3 import upload
from typing import Optional

LIKE_THRESHOLD=2
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB

async def Upload_content(
    video_file: UploadFile,
    caption: Optional[str],
    description: str,
    db: AsyncSession,
    user: User
):   
    if video_file.size > MAX_VIDEO_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    try:
        logger.info(f'Attempting video uplod for: {video_file.filename}')
        url = await upload(video_file.file, video_file.content_type)

        content = Content(
            creator_id=user.id,
            caption=caption,
            description=description,
            media_url=url
        )
        db.add(content)
        await db.commit()
        await db.refresh(content)
        logger.success(f'Content created successfully with ID: {content.id}')
        return content
    
    except Exception as e:
        logger.error(f"Upload failed: {type(e).__name__}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Upload failed")




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
    redis = get_redis()
    await redis.delete("content:feed")

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
    redis = get_redis()
    await redis.delete("content:feed")

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