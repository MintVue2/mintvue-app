"use client";

import { useEffect, useState } from "react";
import { VideoCard } from "./video-card";
import { apiFetch } from "@/lib/api";

type FeedItem = {
  id: string;
  creator_id: string;
  media_url: string;
  caption: string | null;
  description: string;
  likes: number;
  views: number;
  is_mintable: boolean;
  minted: boolean;
  created_at: string;
  liked_by_me: boolean;
};

export function VideoFeed() {
  const [videos, setVideos] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => setMuted((prev) => !prev);

  useEffect(() => {
    apiFetch<FeedItem[]>("/content/feed")
      .then(setVideos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-500">
        Loading feed...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-500">
        No content yet. Be the first to upload!
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {videos.map((video) => {
        const absoluteVideoUrl = video.media_url.startsWith("http")
          ? video.media_url
          : `https://${video.media_url}`;

        return (
          <VideoCard
            key={video.id}
            id={video.id}
            src={absoluteVideoUrl}
            caption={video.caption ?? ""}
            creator={`@user_${video.creator_id.slice(0, 6)}`}
            likes={video.likes}
            initialLiked={video.liked_by_me}
            isMuted={muted}
            onToggleMute={toggleMute}
          />
        );
      })}
    </div>
  );
}
