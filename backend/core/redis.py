import redis.asyncio as redis
from core.config import settings

redis_client: redis.Redis | None = None


async def init_redis():
    """dependency to startup redis connection"""

    global redis_client
    redis_client = redis.from_url(
        settings.REDIS_URL,
        decode_responses=True  # important (strings instead of bytes)
    )


async def close_redis():
    """dependency for closing redis connection"""

    global redis_client
    if redis_client:
        await redis_client.close()



def get_redis():
    """redis dependency injection"""
    
    return redis_client