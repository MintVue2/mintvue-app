import httpx
import tempfile
import os

from core.config import settings


class BagsService:
    BASE_URL = "https://public-api-v2.bags.fm/api/v1"

    async def launch_token(self, image_url: str, name: str, symbol: str):
        async with httpx.AsyncClient(timeout=60.0) as client:
            # 1. Download and Temp Save (as you had it)
            img_res = await client.get(image_url)
            img_res.raise_for_status()

            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                tmp.write(img_res.content)
                temp_path = tmp.name

            try:
                # Step A: Create Token Info
                with open(temp_path, "rb") as f:
                    launch_res = await client.post(
                        f"{self.BASE_URL}/token-launch/create-token-info",
                        headers={"x-api-key": settings.BAGS_API_KEY},
                        files={"image": f},
                        data={"name": name, "symbol": symbol}
                    )
                launch_res.raise_for_status()
                launch_data = launch_res.json()

                # Step B: Send Transaction
                # If Bags returns a serialized 'transaction', we send it to finalize
                tx_blob = launch_data.get("transaction")
                if not tx_blob:
                    return launch_data # Might already be sent in some configs

                send_res = await client.post(
                    f"{self.BASE_URL}/solana/send-transaction",
                    headers={"x-api-key": settings.BAGS_API_KEY},
                    json={"transaction": tx_blob}
                )
                send_res.raise_for_status()
                send_data = send_res.json()

                # Combine the data
                return {
                    "mint": launch_data.get("mint"),
                    "metadata_url": launch_data.get("metadata_url"),
                    "signature": send_data.get("signature") or send_data.get("response")
                }

            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)