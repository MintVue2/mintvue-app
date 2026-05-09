"use client";

import { VideoCard } from "./video-card";

const videos = [
  {
    creator: "@mintboy",
    caption:
      "This creator event in Lagos was insane 🔥",
    src: "/feeds/unction.mp4",
    likes: "12.4K",
    comments: "1.1K",
  },

  {
    creator: "@afrobeatsdaily",
    caption:
      "Viral moments deserve ownership.",
    src: "/feeds/unction.mp4",
    likes: "8.2K",
    comments: "604",
  },

  {
    creator: "@culturehub",
    caption:
      "Mintvue is changing creator economy.",
    src: "/feeds/unction.mp4",
    likes: "21K",
    comments: "3.2K",
  },
];

export function VideoFeed() {
  return (
    <div className="flex flex-col space-y-10">

      {videos.map((video, index) => (
        <VideoCard
          key={index}
          {...video}
        />
      ))}

    </div>
  );
}