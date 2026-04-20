from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List
from functools import lru_cache

class Settings(BaseSettings):
    """Application configuration settings."""

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        case_sensitive=True
    )

    API_PREFIX: str
    DEBUG: bool = False
    ALLOWED_ORIGINS: str ="http://localhost:3000,http://localhost:5173"
    PORT: int
    DATABASE_URL_DEV: str 
    DATABASE_URL_PROD: str
    BAGS_API_KEY: str
    SECRET_KEY: str
    EMAIL_FROM: str
    RESEND_API_KEY: str
    KMS_KEY_ID: str
    FERNET_KEY: str
    ENCRYPTION_PROVIDER: str
    AWS_REGION: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_BUCKET_NAME: str

    @field_validator('ALLOWED_ORIGINS')
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return [origin.strip() for origin in v.split(",")] if v else []

@lru_cache
def app_settings():
    return Settings()


settings = app_settings()
