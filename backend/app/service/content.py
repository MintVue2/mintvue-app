from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, UploadFile, BackgroundTasks
from app.models.content import Content, ContentCreate
from app.models.user import User
from sqlmodel import select
from app.utils.media import process_thumbnail
from uuid import UUID
from app.models.like import Like
from core.logger import logger
from core.redis import get_redis
from app.service.s3 import upload
import os
import tempfile

LIKE_THRESHOLD=2

# Video upload constraints
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/x-msvideo"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi"}
CHUNK_SIZE = 1024 * 1024  # 1MB chunks


async def create_content(
    caption: str,
    description: str,
    video: UploadFile, 
    db: AsyncSession, 
    user: User, 
    background_tasks: BackgroundTasks):
    """Create new content with video upload (streaming)."""
    # 1. Validate video type and extension
    if video.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported video type")
    
    ext = os.path.splitext(video.filename)[1].lower()
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported video extension")

    # 2. Stream video to temp file and validate size
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp_path = tmp.name
            total_size = 0
            
            # Stream chunks instead of loading entire file
            while chunk := await video.read(CHUNK_SIZE):
                total_size += len(chunk)
                
                # Check size limit during streaming
                if total_size > MAX_VIDEO_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"Video exceeds max size of 500MB"
                    )
                
                tmp.write(chunk)
            
            logger.info(f"✅ Streamed {total_size / 1024 / 1024:.2f}MB video to {tmp_path}")

        # 3. Upload to S3
        media_url = await upload(tmp_path, video.filename)

        # 4. Create DB record
        content = Content(
            creator_id=user.id,
            media_url=media_url,
            caption=caption,
            description=description
        )
        db.add(content)
        await db.commit()
        await db.refresh(content)
        
        # Queue thumbnail processing to run in background
        background_tasks.add_task(process_thumbnail, content.id)
        
        return content
    finally:
        # Clean up temp file in background to avoid blocking
        if tmp_path and os.path.exists(tmp_path):
            background_tasks.add_task(os.remove, tmp_path)


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



# from uuid import uuid4
# from core.config import settings
# from app.models.content import Content, ThumbNailStatus
# from app.service.s3 import upload
# from app.utils.media import generate_thumbnail, full_media_pipeline
# from core.logger import logger

# async def create_content(caption, description, video, db, user, background_tasks):
#     # 1. Immediate Validations
#     ext = os.path.splitext(video.filename)[1].lower()
#     if ext not in ALLOWED_VIDEO_EXTENSIONS:
#         raise HTTPException(400, detail="Invalid extension")

#     # 2. Create DB Record (This catches 400 errors in milliseconds)
#     content_id = uuid4()
#     # Pre-calculate the URL (Tigris URLs are deterministic)
#     file_key = f"videos/{content_id}{ext}"
#     media_url = f"{settings.RAILWAY_BUCKET_ENDPOINT}/{settings.RAILWAY_BUCKET_NAME}/{file_key}"

#     content = Content(
#         id=content_id,
#         creator_id=user.id,
#         media_url=media_url,
#         caption=caption,
#         description=description,
#         thumbnail_status=ThumbNailStatus.PENDING
#     )
#     db.add(content)
#     await db.commit() # FAIL HERE if the DB is unhappy. Fast 400.
#     await db.refresh(content)

#     # 3. Stream Video to Local Disk (The only slow part the user waits for)
#     with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
#         tmp_path = tmp.name
#         total_size = 0
#         while chunk := await video.read(CHUNK_SIZE):
#             total_size += len(chunk)
#             if total_size > MAX_VIDEO_SIZE:
#                 raise HTTPException(413, detail="Too large")
#             tmp.write(chunk)

#     # 4. Start Background Pipeline
#     # The user is disconnected after this line.
#     background_tasks.add_task(full_media_pipeline, tmp_path, content_id, video.content_type)
    
#     return content