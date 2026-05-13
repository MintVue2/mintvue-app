import asyncio
import time

import redis.asyncio as redis
from google.auth.exceptions import GoogleAuthError
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token as google_id_token
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models import User
from core.email import EmailService
from core.logger import logger
from core.redis import KeyFactory
from core.config import settings
from core.security import (
    LoginRequest,
    SignupRequest,
    create_access_token,
    decode_access_token,
    GoogleLoginRequest,
)


async def _get_or_create_user(email: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user:
        return user

    user = User(email=email)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def signUp(req: SignupRequest, db: AsyncSession):
    logger.info(f"Signing up user: {req.email}")

    result = await db.execute(select(User).where(User.email == req.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        logger.warning(f"User: {req.email} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    new_user = User(email=req.email)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    logger.success(f"User: {req.email} successfully signed up")

    token = create_access_token({"user_id": str(new_user.id)})

    # await EmailService.send_email(
    #     to=new_user.email,
    #     subject="WELCOME TO MINTVUE - EARN AS YOU CREATE CONTENTS",
    #     template_name="welcome.html",
    #     context={"email": new_user.email}
    # )

    return {"access_token": token, "token_type": "bearer"}


async def login(req: LoginRequest, db: AsyncSession):
    logger.info(f"logging in user: {req.email}....")

    user = await _get_or_create_user(req.email, db)

    token = create_access_token({"user_id": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}


def _verify_google_credential(credential: str) -> dict:
    request = GoogleRequest()
    return google_id_token.verify_oauth2_token(
        credential,
        request,
        settings.GOOGLE_OAUTH_CLIENT_ID,
    )


async def login_with_google(req: GoogleLoginRequest, db: AsyncSession):
    credential = req.token()
    if not credential:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google credential is required",
        )

    try:
        payload = await asyncio.to_thread(_verify_google_credential, credential)
    except (ValueError, GoogleAuthError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    if not payload.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google email is not verified",
        )

    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token did not include an email",
        )

    user = await _get_or_create_user(email, db)
    token = create_access_token({"user_id": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}


async def logout(token: str, redis_client: redis.Redis, email: str):
    data = decode_access_token(token)
    expiration = data.get("exp")

    if expiration:
        ttl = int(expiration - time.time())
        if ttl > 0:
            await redis_client.set(KeyFactory.token_blacklist(email), token, ex=ttl)
    return {"message": "Logged out successfully"}
