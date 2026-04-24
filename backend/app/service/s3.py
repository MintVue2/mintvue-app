import os
import shutil
import uuid
from uuid import UUID
from core.config import settings
from core.logger import logger

# MVP: Using local file storage. Switch to S3 by setting STORAGE_BACKEND="s3" in .env
STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")
MOCK_STORAGE_PATH = "mock_storage"


# ============================================================================
# LOCAL STORAGE (MVP - Default)
# ============================================================================

def upload_file_local(file_path: str, content_id: UUID, content_type: str = "image/jpeg") -> str:
    """
    Local file storage: copies file to server storage directory
    Used for MVP. Will migrate to S3 when funding arrives.
    """
    try:
        logger.info(f"📦 Uploading thumbnail to local storage: {file_path}")
        
        os.makedirs(f"{MOCK_STORAGE_PATH}/thumbnails", exist_ok=True)

        file_key = f"thumbnails/{content_id}.jpg"
        dest_path = os.path.join(MOCK_STORAGE_PATH, file_key)

        logger.info(f"📁 Destination path: {dest_path}")
        
        if not os.path.exists(file_path):
            logger.error(f"❌ Source file does not exist: {file_path}")
            raise FileNotFoundError(f"Source file not found: {file_path}")
        
        shutil.copy(file_path, dest_path)
        logger.info(f"✅ File copied to: {dest_path}")

        url = f"http://localhost:8000/{dest_path}"
        logger.info(f"✅ Thumbnail URL: {url}")
        return url
    
    except Exception as e:
        logger.error(f"❌ Upload failed: {type(e).__name__}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# S3 STORAGE (Post-funding)
# ============================================================================

def upload_file_s3(file_path: str, content_id: UUID, content_type: str = "image/jpeg") -> str:
    """
    S3 upload: uploads file to AWS S3 bucket
    Enable by setting STORAGE_BACKEND="s3" in .env
    """
    try:
        import boto3
        
        logger.info(f"📦 Uploading thumbnail to S3: {file_path}")
        
        s3_client = boto3.client(
            "s3",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        file_key = f"thumbnails/{content_id}.jpg"

        s3_client.upload_file(
            Filename=file_path,
            Bucket=settings.AWS_BUCKET_NAME,
            Key=file_key,
            ExtraArgs={
                "ContentType": content_type,
                "ACL": "public-read"
            }
        )

        url = f"https://{settings.AWS_BUCKET_NAME}.s3.amazonaws.com/{file_key}"
        logger.info(f"✅ Thumbnail uploaded to S3: {url}")
        return url
    
    except Exception as e:
        logger.error(f"❌ S3 upload failed: {type(e).__name__}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# DYNAMIC DISPATCHER
# ============================================================================

def upload_file(file_path: str, content_id: UUID, content_type: str = "image/jpeg") -> str:
    """
    Upload file using configured backend (local by default for MVP)
    """
    if STORAGE_BACKEND == "s3":
        return upload_file_s3(file_path, content_id, content_type)
    else:
        return upload_file_local(file_path, content_id, content_type)


# Backward compatibility alias
def upload_fake(file_path: str, content_id: UUID) -> str:
    """Deprecated: Use upload_file() instead"""
    return upload_file_local(file_path, content_id)