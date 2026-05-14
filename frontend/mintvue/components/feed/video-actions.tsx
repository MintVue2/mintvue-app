"use client";

import { Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

type Props = {
  contentId: string;
  initialLikes: number;
  initialLiked: boolean;
};

export function VideoActions({ contentId, initialLikes, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [pending, setPending] = useState(false);

  const toggleLike = async () => {
    if (pending) return;
    setPending(true);

    const wasLiked = liked;

    // Optimistic update
    setLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      if (wasLiked) {
        await apiFetch(`/content/${contentId}/like`, { method: "DELETE" });
      } else {
        await apiFetch(`/content/${contentId}/like`, { method: "POST" });
      }
    } catch (error) {
      // Revert on failure
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={toggleLike}
        disabled={pending}
        className="flex cursor-pointer flex-col items-center gap-2 transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-xl">
          <Heart
            className={`h-6 w-6 transition-colors ${
              liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </div>
        <span className="text-sm">{formatCount(likes)}</span>
      </button>

      <button className="cursor-pointer transition-opacity hover:opacity-80">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-xl">
          <Share2 className="h-6 w-6" />
        </div>
      </button>
    </div>
  );
}
