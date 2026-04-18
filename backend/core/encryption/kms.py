import boto3
from core.config import settings
from core.encryption.base import EncryptionProvider


class KMSEncryption(EncryptionProvider):

    def __init__(self):
        self.client = boto3.client(
            "kms",
            region_name=settings.AWS_REGION
        )

    def encrypt(self, data: bytes, context: dict = None) -> bytes:
        response = self.client.encrypt(
            KeyId=settings.KMS_KEY_ID,
            Plaintext=data,
            EncryptionContext=context or {}
        )
        return response["CiphertextBlob"]

    def decrypt(self, data: bytes, context: dict = None) -> bytes:
        response = self.client.decrypt(
            CiphertextBlob=data,
            EncryptionContext=context or {}
        )
        return response["Plaintext"]