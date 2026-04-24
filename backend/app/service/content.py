from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.content import Content, ContentCreate
from app.models.user import User
from sqlmodel import select
from uuid import UUID
from app.models.like import Like
from core.logger import logger
from core.redis import get_redis
import os
import httpx

LIKE_THRESHOLD=2


async def validate_video_file(media_url: str) -> None:
    """
    Validate that the media_url points to a valid MP4 video file.
    
    Args:
        media_url: Either a local file path or HTTP(S) URL
        
    Raises:
        HTTPException: 400 Bad Request if not a valid video file
    """
    try:
        logger.info(f"🎬 Validating video file: {media_url}")
        
        # Check if it's a local file path
        if os.path.exists(media_url):
            logger.info(f"📁 Found local file: {media_url}")
            
            # Validate file extension
            if not media_url.lower().endswith('.mp4'):
                logger.error(f"❌ Invalid file extension: {media_url}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="must be a valid video"
                )
            
            # Validate file size (must be > 0)
            file_size = os.path.getsize(media_url)
            if file_size == 0:
                logger.error(f"❌ Empty video file: {media_url}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="must be a valid video"
                )
            
            logger.info(f"✅ Local video file validated: {file_size} bytes")
            return
        
        # Check if it's a URL
        if media_url.startswith(('http://', 'https://')):
            logger.info(f"🌐 Validating remote video URL: {media_url}")
            
            # Make a HEAD request to check content-type without downloading
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.head(media_url, follow_redirects=True)
                    response.raise_for_status()
                    
                    # Check content-type header
                    content_type = response.headers.get('content-type', '').lower()
                    logger.info(f"📊 Response content-type: {content_type}")
                    
                    if 'video' not in content_type and not media_url.lower().endswith('.mp4'):
                        logger.error(f"❌ Invalid content-type: {content_type}")
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="must be a valid video"
                        )
                    
                    # Check content-length if available
                    content_length = response.headers.get('content-length')
                    if content_length:
                        size = int(content_length)
                        if size == 0:
                            logger.error(f"❌ Empty video file from URL")
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail="must be a valid video"
                            )
                        logger.info(f"✅ Remote video validated: {size} bytes")
                    else:
                        logger.info(f"✅ Remote video URL validated (size unknown)")
                    
                except httpx.RequestError as e:
                    logger.error(f"❌ Failed to access video URL: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="must be a valid video"
                    )
        else:
            logger.error(f"❌ Invalid media_url format: {media_url}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="must be a valid video"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Video validation error: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="must be a valid video"
        )

async def create_content(req: ContentCreate, db: AsyncSession, user: User):
    logger.info(f"📝 Creating content for user: {user.id}")
    logger.info(f"📹 Media URL: {req.media_url}")
    logger.info(f"📄 Caption: {req.caption}")
    
    # Validate video file before creating content
    await validate_video_file(req.media_url)
    
    content = Content(
        creator_id=user.id,
        media_url=req.media_url,
        caption=req.caption,
        description=req.description
    )
    db.add(content)
    await db.commit()
    await db.refresh(content)

    logger.info(f"✅ Content created with ID: {content.id}")

    redis = get_redis()
    await redis.delete("content:feed")

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