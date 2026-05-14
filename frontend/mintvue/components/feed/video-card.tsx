"use client";

import { VideoActions } from "./video-actions";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  id: string;
  creator: string;
  caption: string;
  src: string;
  likes: number;
  initialLiked: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
};

export function VideoCard({
  id,
  creator,
  caption,
  src,
  likes,
  initialLiked,
  isMuted,
  onToggleMute,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  // Play / pause based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.7 },
    );

    const el = videoRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
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

  // Imperatively sync global mute state to the video element.
  // React's `muted` prop is a one-time HTML attribute — it doesn't
  // re-render reactively, so we must use the DOM property directly.
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  return (
    // Outer: full viewport height, black bg, centers the phone-shaped inner container
    <div className="relative h-svh w-full snap-start bg-black flex items-center justify-center">
      {/* Inner: phone-shaped on desktop — max 390px wide, rounded, no overflow */}
      <div className="relative h-full w-full md:max-w-[390px] md:rounded-2xl overflow-hidden">
        {/* VIDEO — starts muted for autoplay, then controlled imperatively */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* MUTE BUTTON — top right */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onToggleMute}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 backdrop-blur-xl transition-opacity hover:opacity-80"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* CONTENT */}
        <div className="absolute bottom-24 left-0 right-0 flex items-end justify-between px-6">
          {/* LEFT — creator + caption */}
          <div className="max-w-[70%]">
            <p className="text-lg font-semibold">{creator}</p>
            <p className="mt-3 text-sm text-zinc-200">{caption}</p>
          </div>

          {/* RIGHT — actions */}
          <VideoActions
            contentId={id}
            initialLikes={likes}
            initialLiked={initialLiked}
          />
        </div>
      </div>
    </div>
  );
}
