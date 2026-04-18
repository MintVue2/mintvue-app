from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from core.security import AuthResponse, SignupRequest, LoginRequest
from app.service.auth import signUp, login
from core.session import get_session


router = APIRouter(
    prefix="/auth", 
    tags=["auth"]
)


@router.post("/signup", response_model=AuthResponse)
async def signup_user(req: SignupRequest, db: AsyncSession = Depends(get_session)):
    """Endpoint to handle user signup."""
    return await signUp(req, db)


@router.post("/login", response_model=AuthResponse)
async def login_user(req: LoginRequest, db: AsyncSession = Depends(get_session)):
    """Endpoint to login a user"""
    return await login(req, db)