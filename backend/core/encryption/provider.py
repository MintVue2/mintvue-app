from core.config import settings
from core.encryption.fernet import FernetEncryption
from core.encryption.kms import KMSEncryption


def get_encryption_provider():

    if settings.ENCRYPTION_PROVIDER == "kms":
        return KMSEncryption()

    return FernetEncryption()