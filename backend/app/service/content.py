from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, UploadFile
from app.models.content import Content, ContentCreate
from app.models.user import User
from sqlmodel import select
from uuid import UUID
from app.models.like import Like
from core.logger import logger
from core.redis import get_redis
from app.service.s3 import upload_local
import os
import tempfile
import httpx

LIKE_THRESHOLD=2

# Video upload constraints
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/x-msvideo"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi"}


async def validate_video_upload(file: UploadFile) -> tuple[str, int]:
    """
    Validate uploaded video file for type, size, and format.
    
    Args:
        file: Uploaded file from multipart/form-data
        
    Returns:
        tuple: (file_path, file_size)
        
    Raises:
        HTTPException: 400 Bad Request if validation fails
    """
    try:
        logger.info(f"🎬 Validating video upload: {file.filename}")
        
        # Validate filename extension
        file_name_lower = file.filename.lower()
        has_valid_extension = any(file_name_lower.endswith(ext) for ext in ALLOWED_VIDEO_EXTENSIONS)
        
        if not has_valid_extension:
            logger.error(f"❌ Invalid file extension: {file.filename}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only MP4, MOV, and AVI files are allowed. Got: {file.filename}"
            )
        
        # Validate content-type
        if file.content_type and file.content_type not in ALLOWED_VIDEO_TYPES:
            logger.error(f"❌ Invalid content-type: {file.content_type}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid video format. Allowed types: {', '.join(ALLOWED_VIDEO_TYPES)}"
            )
        
        # Read file to temp location and validate size
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        file_size = 0
        
        try:
            while chunk := await file.read(1024 * 1024):  # Read 1MB at a time
                file_size += len(chunk)
                temp_file.write(chunk)
                
                # Check size limit during upload
                if file_size > MAX_VIDEO_SIZE:
                    logger.error(f"❌ File too large: {file_size} bytes (max: {MAX_VIDEO_SIZE})")
                    temp_file.close()
                    os.remove(temp_file.name)
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File size exceeds limit of {MAX_VIDEO_SIZE / (1024*1024):.0f}MB"
                    )
            
            temp_file.close()
            
            if file_size == 0:
                logger.error(f"❌ Empty video file uploaded")
                os.remove(temp_file.name)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uploaded file is empty"
                )
            
            logger.info(f"✅ Video file validated: {file_size} bytes")
            return temp_file.name, file_size
        
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ File read error: {type(e).__name__}: {str(e)}")
            if os.path.exists(temp_file.name):
                os.remove(temp_file.name)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to read uploaded file"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Video upload validation error: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to validate video file"
        )


async def create_content(req: ContentCreate, file: UploadFile, db: AsyncSession, user: User) -> Content:
    """
    Create new content with file upload.
    
    Args:
        req: Content metadata (caption, description) as ContentCreate schema
        file: Video file from multipart/form-data upload
        db: Database session
        user: Authenticated user (UUID)
        
    Returns:
        Content: Created content object with all fields
        
    Raises:
        HTTPException: On validation or upload failure
    """
    if not file:
        logger.error(f"❌ No file provided")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is required"
        )
    
    if not isinstance(req, ContentCreate):
        logger.error(f"❌ Invalid request schema")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request data"
        )
    
    logger.info(f"📝 Creating content for user: {user.id}")
    logger.info(f"📹 Video file: {file.filename}")
    logger.info(f"📄 Caption: {req.caption}")
    
    # Validate and save video file
    temp_file_path, file_size = await validate_video_upload(file)
    
    try:
        # Upload video to storage
        logger.info(f"☁️ Uploading video to storage")
        media_url = upload_local(temp_file_path, user.id, "video")
        logger.info(f"✅ Video uploaded: {media_url}")
        
        # Create content in database
        content = Content(
            creator_id=user.id,
            media_url=media_url,
            caption=req.caption,
            description=req.description
        )
        db.add(content)
        await db.commit()
        await db.refresh(content)

        logger.info(f"✅ Content created with ID: {content.id}")

        # Invalidate feed cache
        redis = get_redis()
        await redis.delete("content:feed")

        return content
    
    except Exception as e:
        logger.error(f"❌ Content creation failed: {type(e).__name__}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create content"
        )
    
    finally:
        # Cleanup temp file
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                logger.info(f"🧹 Cleaned up temp file: {temp_file_path}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to cleanup temp file: {str(e)}")



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