import httpx
from core.config import settings
from core.logger import logger


class BagsService:

    BASE_URL = "https://public-api-v2.bags.fm/api/v1/"

    async def mint(self, metadata: dict, supply: int, wallet: str):
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    f"{self.BASE_URL}/mint",
                    json={
                        "metadata": metadata,
                        "supply": supply,
                        "wallet": wallet
                    },
                    headers={
                        "x-api-key": f"{settings.BAGS_API_KEY}"
                    }
                )
                return res.json()
        except Exception as e:
            logger.error(f"Error minting NFT: {str(e)}")
