import asyncio
from uuid import UUID

from core.session import AsyncSessionLocal, init_db
from app.models.content import Content
from app.utils.media import process_thumbnail


TEST_CREATOR_ID = UUID("960531f0-98f8-4b6e-aa7b-23ecbc799edf")
TEST_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

async def main():
    # 0) ensure DB tables exist
    await init_db()

    # 1) create content record
    async with AsyncSessionLocal() as db:
        content = Content(
            creator_id=TEST_CREATOR_ID,
            media_url=TEST_VIDEO_URL,
            caption="auto-test",
            description="automated thumbnail test"
        )
        db.add(content)
        await db.commit()
        await db.refresh(content)
        print("Created content id:", content.id)
        content_id = content.id

    # 2) run the thumbnail processor for that content
    print("Running process_thumbnail for:", content_id)
    await process_thumbnail(content_id)
    print("process_thumbnail completed for:", content_id)


if __name__ == '__main__':
    asyncio.run(main())
