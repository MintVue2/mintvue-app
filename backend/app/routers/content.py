from sqlalchemy.ext.asyncio import AsyncSession
from app.models.content import Content, ContentCreate
from app.utils.media import process_thumbnail
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, BackgroundTasks, File, UploadFile, Form, status, HTTPException
from app.models.user import User
from core.security import get_current_user
from core.session import get_session
from app.service.feed import get_feed
from app.service.content import (
    create_content,
    like_content,
    unlike_content,
    mint_status
)
from core.logger import logger


router = APIRouter(
    prefix='/content',
    tags=['content']
)


@router.post('/')
async def createContent(
    bgt: BackgroundTasks,
    file: UploadFile = File(..., description="Video file (MP4, MOV, AVI)"),
    caption: Optional[str] = Form(default=None, description="Optional caption for the content"),
    description: str = Form(..., description="Content description"),
    db: AsyncSession = Depends(get_session), 
    user: User = Depends(get_current_user)
):
    """
    Create new content with video file upload.
    
    **Parameters:**
    - **file**: Video file to upload (MP4, MOV, AVI) - Max 500MB
    - **caption**: Optional caption for the content
    - **description**: Content description (required)
    
    **Validation:**
    - Only MP4, MOV, and AVI files allowed
    - Maximum file size: 500MB
    - File cannot be empty
    - Description must not be empty
    """
    logger.info(f"🚀 POST /content - Creating new content from user {user.id}")
    
    # Validate description
    if not description or not description.strip():
        logger.error("❌ Description is required and cannot be empty")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description is required and cannot be empty"
        )
    
    # Trim caption if provided
    caption_trimmed = caption.strip() if caption else None
    
    # Create ContentCreate object with metadata
    req = ContentCreate(caption=caption_trimmed, description=description.strip())
    
    # Create content with file upload
    new_content = await create_content(req, file, db, user)
    
    logger.info(f"📋 Queueing background task: process_thumbnail({new_content.id})")
    bgt.add_task(process_thumbnail, new_content.id)
    
    return new_content



@router.post('/{content_id}/like')
async def likeContent(
    content_id: UUID,
    db: AsyncSession = Depends(get_session), 
    user: User = Depends(get_current_user) 
):
    liked_content = await like_content(content_id, db, user)
    return liked_content


@router.get('/{content_id}/mint-status')
async def mintStatus(
    content_id: UUID,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user) 
):
    status = await mint_status(content_id, db)
    return status


@router.delete('/{content_id}/like')
async def unLikeContent(
    content_id: UUID,
    db: AsyncSession = Depends(get_session), 
    user: User = Depends(get_current_user) 
):
    unliked_content = await unlike_content(content_id, db, user)
    return unliked_content


@router.get('/feed')
async def feed(
    db: AsyncSession = Depends(get_session)
):
    return await get_feed(db)