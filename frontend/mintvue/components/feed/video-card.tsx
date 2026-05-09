"use client";

import { VideoActions } from "./video-actions";
import { useEffect, useRef, useState } from "react";

type Props = {
  creator: string;
  caption: string;
  src: string;
  likes: string;
  comments: string;
};

export function VideoCard({
  creator,
  caption,
  src,
  likes,
  comments,
}: Props) {

  const videoRef = useRef<HTMLVideoElement>(null);

const [visible, setVisible] = useState(false);
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setVisible(entry.isIntersecting);
    },
    {
      threshold: 0.7,
    }
  );

  if (videoRef.current) {
    observer.observe(videoRef.current);
  }

  return () => {
    if (videoRef.current) {
      observer.unobserve(videoRef.current);
    }
  };
}, []);

useEffect(() => {
  if (!videoRef.current) return;

  if (visible) {
    videoRef.current.play();
  } else {
    videoRef.current.pause();
  }
}, [visible]);

  return (
    <div
  className="
    relative
    h-[calc(100svh-4rem)]
    w-full
    snap-start
    overflow-hidden
    bg-black
    flex justify-center
  "
>

      {/* VIDEO */}
    <video
  ref={videoRef}
  muted
  loop
  playsInline
  preload="metadata"
  className="
    h-full w-full object-cover
    md:rounded-2xl
  "
>
  <source src={src} type="video/mp4" />
</video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* CONTENT */}
      <div
        className="
          absolute bottom-24 left-0 right-0
          flex items-end justify-between
          px-6
        "
      >

        {/* LEFT */}
        <div className="max-w-md">

          <p className="text-lg font-semibold">
            {creator}
          </p>

          <p className="mt-3 text-zinc-200">
            {caption}
          </p>

        </div>

        {/* RIGHT */}
        <VideoActions
          likes={likes}
          comments={comments}
        />

      </div>

    </div>
  );
}