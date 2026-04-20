import boto3
from core.config import settings
from uuid import UUID

s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
)


def upload_file(file_path: str, content_type: str = "image/jpeg") -> str:
    file_key = f"thumbnails/{uuid.uuid4()}.jpg"

    s3_client.upload_file(
        Filename=file_path,
        Bucket=settings.AWS_BUCKET_NAME,
        Key=file_key,
        ExtraArgs={
            "ContentType": content_type,
            "ACL": "public-read"  # ⚠️ okay for MVP
        }
    )

    url = f"https://{settings.AWS_BUCKET_NAME}.s3.amazonaws.com/{file_key}"
    return url




import os
import shutil
import uuid

MOCK_STORAGE_PATH = "mock_storage"


def upload_fake(file_path: str, content_id: UUID) -> str:
    """
    Mock S3 upload: copies file locally and returns fake URL
    """

    os.makedirs(f"{MOCK_STORAGE_PATH}/thumbnails", exist_ok=True)

    file_key = f"thumbnails/{content_id}.jpg"
    dest_path = os.path.join(MOCK_STORAGE_PATH, file_key)

    shutil.copy(file_path, dest_path)

    # pretend this is a real CDN URL
    return f"http://localhost:8000/{dest_path}"