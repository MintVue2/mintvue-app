from typing import Annotated

import redis.asyncio as redis
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.service.auth import login, logout, signUp
from core.redis import Container
from core.security import (
    AuthResponse,
    LoginRequest,
    SignupRequest,
    auth_scheme,
    get_current_user,
)
from core.session import get_session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse)
async def signup_user(req: SignupRequest, db: AsyncSession = Depends(get_session)):
    """Endpoint to handle user signup."""
    return await signUp(req, db)


@router.post("/login", response_model=AuthResponse)
async def login_user(req: LoginRequest, db: AsyncSession = Depends(get_session)):
    """Endpoint to login a user"""
    return await login(req, db)


@router.post("/logout")
@inject
async def logout_user(
    token: Annotated[HTTPAuthorizationCredentials, Depends(auth_scheme)],
    current_user: User = Depends(get_current_user),
    redis_client: redis.Redis = Depends(Provide[Container.redis_pool]),
):
    """Endpoint to logout a user"""
    return await logout(token.credentials, redis_client, current_user.email)

