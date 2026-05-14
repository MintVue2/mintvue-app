from typing import Optional
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.service.content import (
    Upload_content,
    like_content,
    mint_status,
    unlike_content,
)
from app.service.feed import get_feed
from core.security import get_current_user
from core.session import get_session

router = APIRouter(prefix="/content", tags=["content"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_content(
    # background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    caption: str = Form(...),
    description: str = Form(...),
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    content = await Upload_content(video, caption, description, db, user)
    return content


@router.post("/{content_id}/like")
async def likeContent(
    content_id: UUID,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    liked_content = await like_content(content_id, db, user)
    return liked_content


@router.get("/{content_id}/mint-status")
async def mintStatus(
    content_id: UUID,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    status = await mint_status(content_id, db)
    return status


@router.delete("/{content_id}/like")
async def unLikeContent(
    content_id: UUID,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
):
    unliked_content = await unlike_content(content_id, db, user)
    return unliked_content


@router.get("/feed")
async def feed(
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await get_feed(db, current_user.id)
