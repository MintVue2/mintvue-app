import httpx
from core.config import settings
from pydantic import EmailStr

url = "https://staging.crossmint.com/api/2025-06-09/wallets"

headers = {
    "X-API-KEY": f"{settings.CROSSMINT_SS_API_KEY}",
    "Content-Type": "application/json"
}

async def generate_wallet(email: EmailStr):
    """Generates a new wallet using the Crossmint API."""

    payload = {
    "chainType": "evm",
    "type": "smart",
    "config": {
        "adminSigner": {
            "type": "external-wallet",
            "address": f"{settings.CROSSMINT_SIGNER_ADDRESS}"
        }
    },
    "owner": f"email:{email}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['address']

