from loguru import logger
import sys
import os

# Remove default logger
logger.remove()

# Console logging
logger.add(
    sys.stdout,
    level="INFO",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
           "<level>{level}</level> | "
           "<cyan>{name}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
)

# File logging with rotation
os.makedirs("logs", exist_ok=True)
logger.add(
    "logs/primestores_{time:YYYY-MM-DD}.log",
    rotation="1 day",
    retention="7 days",
    compression="zip",
    level="DEBUG",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{line} - {message}"
)