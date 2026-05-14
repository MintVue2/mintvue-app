from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.content import Content
from uuid import UUID
from fastapi import HTTPException, status
from sqlmodel import select
from core.logger import logger

async def mintContent(content_id: UUID, db: AsyncSession, user: User):
    """Handler for minting contents"""

    logger.info(f'Attempting minting for content: {content_id} by user: {user.email}...')
    result = await db.execute(
        select(Content).where(Content.id == content_id)
    )

    content = result.scalar_one_or_none()
    if not content:
        logger.warning(f'Content with id {content_id} not found')
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found"
        )
    
    if content.creator_id != user.id:
        logger.warning(f'User: {user.email} is not the creator')
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not the creator of this content"
        )

    if not content.is_mintable:
        logger.warning(f'Content: {content_id} is not mintable yet')
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content is not mintable"
        )

    if content.minted:
        logger.warning(f'Content: {content_id} has already been minted')
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content has already been minted"
        )   



    