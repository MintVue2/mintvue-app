import subprocess
import tempfile
from core.session import AsyncSessionLocal
import os
from uuid import UUID
import httpx
from app.models.content import Content, ThumbNailStatus
from app.service.s3 import upload_local
from core.logger import logger

def generate_thumbnail(video_path: str, output_path: str):
    command = [
        "ffmpeg",
        "-i", video_path,
        "-ss", "00:00:01.000",
        "-vframes", "1",
        output_path
    ]

    subprocess.run(command, check=True)



async def process_thumbnail(content_id: UUID):
    logger.info(f"🎬 Starting thumbnail processing for content: {content_id}")
    
    async with AsyncSessionLocal() as db:
        content = await db.get(Content, content_id)

        if not content:
            logger.error(f"❌ Content not found: {content_id}")
            return

        try:
            logger.info(f"⏳ Setting status to PROCESSING for {content_id}")
            content.thumbnail_status = ThumbNailStatus.PROCESSING
            await db.commit()

            logger.info(f"📥 Acquiring video from: {content.media_url}")

            video_path = None

            # If media_url is a local path, use it directly
            if os.path.exists(content.media_url):
                logger.info(f"📁 Found local video file: {content.media_url}")
                video_path = content.media_url
            else:
                # download video over HTTP
                logger.info(f"🌐 Downloading video over HTTP: {content.media_url}")
                async with httpx.AsyncClient() as client:
                    res = await client.get(content.media_url)
                    res.raise_for_status()

                logger.info(f"✅ Video downloaded successfully, size: {len(res.content)} bytes")

                with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as video_file:
                    video_file.write(res.content)
                    video_path = video_file.name

            logger.info(f"💾 Saved video to: {video_path}")

            # generate thumbnail
            thumb_path = video_path.replace(".mp4", ".jpg")
            logger.info(f"🎨 Generating thumbnail with ffmpeg: {thumb_path}")
            generate_thumbnail(video_path, thumb_path)
            logger.info(f"✅ Thumbnail generated successfully")

            # upload
            logger.info(f"☁️ Uploading thumbnail to storage")
            thumbnail_url = upload_local(thumb_path, content.id, "thumbnail")
            logger.info(f"✅ Thumbnail uploaded: {thumbnail_url}")

            # update DB
            content.thumbnail_url = thumbnail_url
            content.thumbnail_status = ThumbNailStatus.READY

            await db.commit()
            logger.info(f"✅ Content {content_id} thumbnail processing completed successfully")

            # cleanup
            logger.info(f"🧹 Cleaning up temporary files")
            os.remove(video_path)
            os.remove(thumb_path)

        except Exception as e:
            logger.error(f"❌ Thumbnail processing failed for {content_id}: {type(e).__name__}: {str(e)}", exc_info=True)
            content.thumbnail_status = ThumbNailStatus.FAILED
            await db.commit()