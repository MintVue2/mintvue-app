from sqlalchemy.ext.asyncio import AsyncSession
from core.security import (
LoginRequest, 
SignupRequest, 
create_access_token
)
from core.logger import logger
from app.models import User
from sqlmodel import select
from fastapi import HTTPException, status
from app.service.wallet import generate_wallet
from uuid import uuid4


async def signUp(req: SignupRequest, db: AsyncSession):
    logger.info(f"Signing up user with email: {req.email}")

    result = await db.execute(select(User).where(User.email == req.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        logger.warning(f"User with email {req.email} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    pub_key, priv_key = generate_wallet(str(uuid4()))

    new_user = User(
        email=req.email,
        wallet_address=pub_key,
        encrypted_private_key=priv_key
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    logger.info(f"User with email {req.email} successfully signed up")

    token = create_access_token(
        {
            "user_id": str(new_user.id)
        }
    )
    return {"access_token": token, "token_type": "bearer"}


async def login(req: LoginRequest, db: AsyncSession):
    logger.info(f'logging in user {req.email}....')

    result = await db.execute(
        select(User).where(User.email == req.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        logger.debug(f'creating account for new user with email {req.email}.....')
        public_key, encrypted_key = generate_wallet(str(uuid4()))

        user = User(
            email=req.email,
            wallet_address=public_key,
            encrypted_private_key=encrypted_key
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token({"user_id": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }