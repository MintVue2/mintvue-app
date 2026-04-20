from fastapi import HTTPException
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.content import Content
from app.models.nft import NFT, MintStatus, MintRequest
from app.models.user import User
from app.service.bags import BagsService
from uuid import UUID

bags = BagsService()


async def mint_content(req: MintRequest, db: AsyncSession, user: User):
    result = await db.execute(
        select(Content).where(Content.id == req.content_id)
    )
    content = result.scalar_one_or_none()

    if not content:
        raise HTTPException(404, "Content not found")

    # 🔐 ownership check
    if content.creator_id != user.id:
        raise HTTPException(403, "Not allowed")

    # 🚫 eligibility checks
    if not content.is_mintable:
        raise HTTPException(400, "Content not mintable yet")

    if not content.thumbnail_url:
        raise HTTPException(400, "Thumbnail not ready")

    if content.minted:
        raise HTTPException(400, "Already minted")

    launch_result = await bags.launch_token(
        image_url=content.thumbnail_url,
        name=f"MintVue #{content.id}",
        symbol="MINTV"
    )

    # 🧱 Save NFT with the Signature
    nft = NFT(
        content_id=req.content_id,
        creator_id=req.creator_id,
        contract_address=launch_result.get("mint"),
        tx_signature=launch_result.get("signature"),
        metadata_url=launch_result.get("metadata_url"),
        supply=req.supply,
        price=req.price,
        mint_status=MintStatus.CONFIRMED
    )

    db.add(nft)

    # link content
    content.minted = True
    content.nft_id = nft.id

    await db.commit()
    await db.refresh(nft)

    return {
        "message": "Mint successful",
        "nft_id": str(nft.id)
    }