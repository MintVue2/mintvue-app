from uuid import UUID
from core.config import settings
from core.logger import logger
from starlette.concurrency import run_in_threadpool
import boto3
from botocore.exceptions import ClientError



def _get_s3_client():
    """Helper for returning an S3/Tigris client."""
    return boto3.client(
        "s3",
        region_name=settings.RAILWAY_BUCKET_REGION,
        aws_access_key_id=settings.RAILWAY_BUCKET_ACCESS_KEY,
        aws_secret_access_key=settings.RAILWAY_BUCKET_SECRET_KEY,
        endpoint_url=settings.RAILWAY_BUCKET_ENDPOINT
    )


def _upload_to_s3(file_path: str, content_id: UUID, file_type: str) -> str:
    """Upload to S3/Railway bucket."""

    s3_client = _get_s3_client()
    if file_type == "video":
        file_key = f"videos/{content_id}.mp4"
        content_type = "video/mp4"
    else:
        file_key = f"thumbnails/{content_id}.jpg"
        content_type = "image/jpeg"

    try:
        logger.debug("📦 Attempting file upload to s3/Tigris...")
        s3_client.upload_file(
            Filename=file_path,
            Bucket=settings.AWS_BUCKET_NAME,
            Key=file_key,
            ExtraArgs={"ContentType": content_type}
        )

        url = f"{settings.RAILWAY_BUCKET_ENDPOINT}/{settings.RAILWAY_BUCKET_NAME}/{file_key}"
        logger.success(f"✅ File upload successfull: {url}")
        return url

    except Exception as e:
        logger.error(f"❌ S3 upload failed: {type(e).__name__}: {str(e)}", exc_info=True)
        raise ClientError(f"S3 upload failed: {str(e)}")
    


async def upload(file_path: str, content_id: UUID, file_type: str) -> str:
    """Async wrapper for S3 upload."""
    S3_url = await run_in_threadpool(
        _upload_to_s3, 
        file_path, 
        content_id, 
        file_type
    )
    return S3_url