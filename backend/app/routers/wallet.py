from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status
from core.security import get_current_user
from typing import Annotated
from app.models.user import User
from app.service.crossmint.wallet import generate_wallet
from core.session import get_session
from core.logger import logger

router = APIRouter(
    prefix='/wallet',
    tags=['wallet']
)

@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_wallet(
    user: Annotated[User, Depends(get_current_user)], 
    db: Annotated[AsyncSession, Depends(get_session)]):
    """Endpoint to generate a new wallet for the user."""

    if user.wallet_address:
        logger.warning(f'wallet already exists for user: {user.email}')
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Wallet already exists for this user."
        )
    
    try:
      logger.info(f"Generating wallet address for: {user.email}...")
      wallet_address = await generate_wallet(user.email)

      user.wallet_address = wallet_address
      db.add(user)
      await db.commit()
      await db.refresh(user)
      logger.success(f'wallet generated successfully: {wallet_address}')
      return {"wallet_address": wallet_address}

    except Exception as e:
        logger.error(f"Error generating wallet: {type(e).__name__}", exc_info=True)
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}."
        )