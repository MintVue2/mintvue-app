import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.config import settings
from core.redis import init_redis, close_redis
from core.session import init_db
from contextlib import asynccontextmanager
from core.middleware import LoggingMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.gzip import GZipMiddleware 
from core.middleware import LoggingMiddleware
from core.logger import logger
from app.routers import auth, content, user, nft

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Event Handler"""

    await init_redis()
    logger.info('Redis connection successfull....')
    await init_db()
    logger.info("Database initialized successfully.")
    logger.info("Starting application...")
    yield
    await close_redis()
    logger.info('Closing redis connection...')
    logger.info("Shutting down application...")


#----------- FastAPI Application Setup --------------#
app = FastAPI(
    title="MintVue API",
    description="API for MintVue application",
    version="1.0.0",
    lifespan=lifespan
)


#-----------middleware --------------#
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=['*'],
)   

# app.add_middleware(
#     HTTPSRedirectMiddleware
# )

app.add_middleware(
    GZipMiddleware, 
    minimum_size=1000,
    compresslevel=5
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)


#--------Static Files---------#
import os
os.makedirs("mock_storage", exist_ok=True)
app.mount("/mock_storage", StaticFiles(directory="mock_storage"), name="mock_storage")


#--------Routes---------#
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(content.router, prefix=settings.API_PREFIX)
app.include_router(user.router, prefix=settings.API_PREFIX)
app.include_router(nft.router, prefix=settings.API_PREFIX)


#------health check endpoint-----#
@app.get("/")
async def root():
    return {"message": "Welcome to the MintVue API!"}



if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.PORT,
        debug=settings.DEBUG
    )
