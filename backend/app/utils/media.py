import subprocess
import tempfile
from sqlalchemy.ext.asyncio import async_sessionmaker
import os
from uuid import UUID
import httpx
from app.models.content import Content, ThumbNailStatus
from app.service.s3 import upload_file, upload_fake

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
    async with async_sessionmaker() as db:
        content = await db.get(Content, content_id)

        if not content:
            return

        try:
            content.thumbnail_status = ThumbNailStatus.PROCESSING
            await db.commit()

            # download video
            async with httpx.AsyncClient() as client:
                res = await client.get(content.media_url)
                res.raise_for_status()

            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as video_file:
                video_file.write(res.content)
                video_path = video_file.name

            # generate thumbnail
            thumb_path = video_path.replace(".mp4", ".jpg")
            generate_thumbnail(video_path, thumb_path)

            # upload
            thumbnail_url = upload_fake(thumb_path, str(content.id))

            # update DB
            content.thumbnail_url = thumbnail_url
            content.thumbnail_status = ThumbNailStatus.READY

            await db.commit()

            # cleanup
            os.remove(video_path)
            os.remove(thumb_path)

        except Exception as e:
            content.thumbnail_status = ThumbNailStatus.FAILED
            await db.commit()