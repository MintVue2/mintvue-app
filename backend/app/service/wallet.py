import base64
from solders.keypair import Keypair
from core.encryption.provider import get_encryption_provider


def generate_wallet(user_id: str):

    provider = get_encryption_provider()

    kp = Keypair()
    public_key = str(kp.pubkey())
    private_bytes = bytes(kp)

    encrypted = provider.encrypt(
        private_bytes,
        context={"user_id": user_id}
    )

    encrypted_b64 = base64.b64encode(encrypted).decode()

    return public_key, encrypted_b64



def decrypt_private_key(encrypted_b64: str, user_id: str):

    provider = get_encryption_provider()

    encrypted = base64.b64decode(encrypted_b64)

    decrypted = provider.decrypt(
        encrypted,
        context={"user_id": user_id}
    )

    return decrypted