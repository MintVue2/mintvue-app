import os
import shutil
from uuid import UUID
from core.config import settings
from core.logger import logger

MOCK_STORAGE_PATH = "mock_storage"


# ============================================================================
# LOCAL UPLOAD (Development)
# ============================================================================

def upload_local(file_path: str, content_id: UUID, file_type: str) -> str:
    """
    Upload file to local storage for development.
    
    Args:
        file_path: Path to the file to upload
        content_id: Content/user ID for organizing files
        file_type: Type of file - "video" or "thumbnail"
        
    Returns:
        Local URL to access the file
        
    Raises:
        FileNotFoundError: If source file doesn't exist
        Exception: On file copy failure
    """
    try:
        logger.info(f"📦 Uploading {file_type} to local storage: {file_path}")
        
        # Create directories
        os.makedirs(f"{MOCK_STORAGE_PATH}/{file_type}s", exist_ok=True)

        # Determine file extension
        if file_type == "video":
            file_key = f"{file_type}s/{content_id}.mp4"
        else:  # thumbnail
            file_key = f"{file_type}s/{content_id}.jpg"
        
        dest_path = os.path.join(MOCK_STORAGE_PATH, file_key)
        logger.info(f"📁 Destination path: {dest_path}")
        
        # Validate source file exists
        if not os.path.exists(file_path):
            logger.error(f"❌ Source file does not exist: {file_path}")
            raise FileNotFoundError(f"Source file not found: {file_path}")
        
        # Copy file
        shutil.copy(file_path, dest_path)
        logger.info(f"✅ {file_type} copied to: {dest_path}")

        # Generate local URL
        url = f"http://localhost:8000/{dest_path}"
        logger.info(f"✅ {file_type} URL: {url}")
        return url
    
    except Exception as e:
        logger.error(f"❌ Local upload failed: {type(e).__name__}: {str(e)}", exc_info=True)
        raise


# ============================================================================
# AWS S3 UPLOAD (Production)
# ============================================================================

def upload_to_s3(file_path: str, content_id: UUID, file_type: str) -> str:
    """
    Upload file to AWS S3 bucket for production.
    
    Args:
        file_path: Path to the file to upload
        content_id: Content/user ID for organizing files
        file_type: Type of file - "video" or "thumbnail"
        
    Returns:
        S3 URL to access the file
        
    Raises:
        Exception: On S3 upload failure
    """
    try:
        import boto3
        
        logger.info(f"📦 Uploading {file_type} to S3: {file_path}")
        
        s3_client = boto3.client(
            "s3",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        # Determine file extension and content-type
        if file_type == "video":
            file_key = f"videos/{content_id}.mp4"
            content_type = "video/mp4"
        else:  # thumbnail
            file_key = f"thumbnails/{content_id}.jpg"
            content_type = "image/jpeg"

        # Upload to S3
        s3_client.upload_file(
            Filename=file_path,
            Bucket=settings.AWS_BUCKET_NAME,
            Key=file_key,
            ExtraArgs={
                "ContentType": content_type,
                "ACL": "public-read"
            }
        )

        # Generate S3 URL
        url = f"https://{settings.AWS_BUCKET_NAME}.s3.amazonaws.com/{file_key}"
        logger.info(f"✅ {file_type} uploaded to S3: {url}")
        return url
    
    except Exception as e:
        logger.error(f"❌ S3 upload failed: {type(e).__name__}: {str(e)}", exc_info=True)
        raise