"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

export function FeedNavigation() {
  const scroll = (direction: "up" | "down") => {
    window.scrollBy({
      top:
        direction === "down"
          ? window.innerHeight
          : -window.innerHeight,

      behavior: "smooth",
    });
  };

  return (
    <div
      className="
        fixed right-4 top-1/2 z-50
        hidden -translate-y-1/2
        flex-col gap-3 md:flex
      "
    >
      <button
        onClick={() => scroll("up")}
        className="
          flex h-12 w-12 items-center justify-center
          rounded-full
          border border-white/10
          bg-black/50
          backdrop-blur-xl
          transition hover:bg-white/10
        "
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}