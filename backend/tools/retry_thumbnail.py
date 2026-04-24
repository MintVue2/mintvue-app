import asyncio
from uuid import UUID

from core.session import AsyncSessionLocal
from app.utils.media import process_thumbnail
from app.models.content import Content

CONTENT_ID = UUID('cdc33869-9b81-45ba-b8f3-24dfe3d0b3c3')
NEW_URL = '/home/akwaubok/Desktop/mintvue/mintvue-app/backend/tmp/test_video.mp4'

async def main():
    async with AsyncSessionLocal() as db:
        content = await db.get(Content, CONTENT_ID)
        if not content:
            print('content not found')
            return
        content.media_url = NEW_URL
        await db.commit()
        print('updated media_url to', NEW_URL)

    await process_thumbnail(CONTENT_ID)

if __name__ == '__main__':
    asyncio.run(main())
