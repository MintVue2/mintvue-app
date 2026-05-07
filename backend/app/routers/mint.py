from fastapi import APIRouter, Depends
from core.security import get_current_user
from typing import Annotated
from app.models.user import User
from uuid import UUID


router = APIRouter(
    prefix='/mint',
    tags=['mint']
)


@router.post('/')
async def mint_content(user: Annotated[User, Depends(get_current_user)]):
    """Endpoiint to mint contents"""
    ...


@router.get('/collectibles')
async def get_my_assets(user: Annotated[User, Depends(get_current_user)]):
    """Endpoint to fetch user's collectibles"""
    ...


@router.get('/collectibles/{nft_id}')
async def get_an_asset(nft_id: UUID, user: Annotated[User, Depends(get_current_user)]):
    """Endpoint to fetch a specific asset"""
    ...