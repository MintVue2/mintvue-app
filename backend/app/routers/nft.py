from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.models.nft import MintRequest, MintResponse
from core.session import get_session
from core.security import get_current_user
from app.models.user import User
from app.service.nft import mint_content

router = APIRouter(prefix="/nft", tags=["nft"])


@router.post("/mint/{content_id}", response_model=MintResponse)
async def mint_nft(
    req: MintRequest,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user)
):
    return await mint_content(req, db, user)