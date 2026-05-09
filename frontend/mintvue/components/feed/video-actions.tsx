"use client";

import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

type Props = {
  likes: string;
  comments: string;
};

export function VideoActions({
  likes,
  comments,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6">

      <button className="flex flex-col items-center gap-2">
        <div
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full
            bg-black/40
            backdrop-blur-xl
          "
        >
          <Heart className="h-6 w-6" />
        </div>

        <span className="text-sm">
          {likes}
        </span>
      </button>

      <button className="flex flex-col items-center gap-2">
        <div
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full
            bg-black/40
            backdrop-blur-xl
          "
        >
          <MessageCircle className="h-6 w-6" />
        </div>

        <span className="text-sm">
          {comments}
        </span>
      </button>

      <button>
        <div
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full
            bg-black/40
            backdrop-blur-xl
          "
        >
          <Share2 className="h-6 w-6" />
        </div>
      </button>

    </div>
  );
}