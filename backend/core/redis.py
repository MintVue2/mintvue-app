import inspect

import redis.asyncio as redis
from dependency_injector import containers, providers

from core.config import settings


# INFO Dependency Injection Container for Redis
class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    # Redis Connection Pool Provider
    redis_pool = providers.Resource(
        redis.from_url, url=config.redis_url, decode_responses=True
    )


# Module-level container instance (set during app startup)
container: Container | None = None


async def init_redis():
    """Create and initialize the DI container and wire application modules that use Provide[]."""
    global container
    container = Container()
    container.config.redis_url.from_value(settings.REDIS_URL)

    # Initialize resource providers (supports async/sync)
    init_resources = getattr(container, "init_resources", None)
    if init_resources:
        maybe_awaitable = init_resources()
        if inspect.isawaitable(maybe_awaitable):
            await maybe_awaitable

    # Wire DI to the application modules that use Provide[...] so injection works
    container.wire(modules=["app.routers.auth"])


async def shutdown_redis():
    """Shutdown resource providers and unwire the container on app shutdown."""
    global container
    if not container:
        return

    shutdown_resources = getattr(container, "shutdown_resources", None)
    if shutdown_resources:
        maybe_awaitable = shutdown_resources()
        if inspect.isawaitable(maybe_awaitable):
            await maybe_awaitable

    container.unwire()
    container = None


class KeyFactory:
    @staticmethod
    def token_blacklist(email: str) -> str:
        return f"auth:token:blacklist:{email}"

    @staticmethod
    def rate_limit(ip: str) -> str:
        return f"api:rate_limit:{ip}"


# INFO Convenience helper for parts of the codebase that don't use dependency-injection
def get_redis() -> redis.Redis:
    """Return the initialized redis.asyncio Redis client from the container."""
    if container is None:
        raise RuntimeError("Redis container has not been initialized.")
    return container.redis_pool()
