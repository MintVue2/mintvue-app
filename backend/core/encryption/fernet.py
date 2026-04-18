from cryptography.fernet import Fernet
from core.config import settings
from core.encryption.base import EncryptionProvider


class FernetEncryption(EncryptionProvider):

    def __init__(self):
        self.fernet = Fernet(settings.FERNET_KEY)

    def encrypt(self, data: bytes, context: dict = None) -> bytes:
        return self.fernet.encrypt(data)

    def decrypt(self, data: bytes, context: dict = None) -> bytes:
        return self.fernet.decrypt(data)