class EncryptionProvider:

    def encrypt(self, data: bytes, context: dict) -> bytes:
        raise NotImplementedError

    def decrypt(self, data: bytes, context: dict) -> bytes:
        raise NotImplementedError