from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from sqlmodel import select


async def update_user():
    ...