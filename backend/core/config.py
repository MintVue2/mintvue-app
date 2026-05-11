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
    ALLOWED_ORIGINS: str ="http://localhost:3000,http://localhost:5173,https://mintvue-app.vercel.app"
    PORT: int
    DATABASE_URL_DEV: str 
    DATABASE_URL_PROD: str
    SECRET_KEY: str
    EMAIL_FROM: str
    RESEND_API_KEY: str 
    REDIS_URL: str
    AWS_S3_BUCKET_NAME: str
    AWS_DEFAULT_REGION: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_ENDPOINT_URL: str
    VIDEO_PROXY_URL: str

    @field_validator('ALLOWED_ORIGINS')
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return [origin.strip() for origin in v.split(",")] if v else []

@lru_cache
def app_settings():
    return Settings()


settings = app_settings()
