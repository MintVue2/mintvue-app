import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from core.logger import logger

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = None
        try:
            response = await call_next(request)
            return response
        finally:
            process_time = (time.time() - start_time) * 1000
            client = request.client.host if request.client else "unknown"
            logger.info(
                f"{client} | {request.method} {request.url.path} | "
                f"status={response.status_code if response else 'ERROR'} | "
                f"duration={process_time:.2f}ms"
            )