from functools import lru_cache
from typing import List

from dotenv import load_dotenv
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    """Application configuration settings."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )

    API_PREFIX: str
    DEBUG: bool = Field(default=False)
    ALLOWED_ORIGINS: str = Field(
        default="http://localhost:3000,http://localhost:5173,https://mintvue-app.vercel.app"
    )
    PORT: int = Field(default=8080)
    DATABASE_URL_DEV: str = Field(...)
    DATABASE_URL_PROD: str = Field(...)
    SECRET_KEY: str = Field(...)
    EMAIL_FROM: str = Field(...)
    RESEND_API_KEY: str = Field(...)
    GOOGLE_OAUTH_CLIENT_SECRET: str = Field(...)
    GOOGLE_OAUTH_CLIENT_ID: str = Field(...)
    REDIS_URL: str = Field(...)
    AWS_S3_BUCKET_NAME: str = Field(...)
    AWS_DEFAULT_REGION: str = Field(...)
    AWS_ACCESS_KEY_ID: str = Field(...)
    AWS_SECRET_ACCESS_KEY: str = Field(...)
    AWS_ENDPOINT_URL: str = Field(...)
    VIDEO_PROXY_URL: str = Field(...)

    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return [origin.strip() for origin in v.split(",")] if v else []


@lru_cache
def app_settings():
    return Settings()


settings = app_settings()
