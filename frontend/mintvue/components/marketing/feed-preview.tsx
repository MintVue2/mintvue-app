"use client";

import { Heart, MessageCircle, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const videos = [
  {
    creator: "@davidwaves",
    likes: "12.4K",
    comments: "1.2K",
    src: "/feeds/akwaman.mp4",
  },
  {
    creator: "@urbanamira",
    likes: "8.1K",
    comments: "604",
    src: "/feeds/guy.mp4",
  },
  {
    creator: "@culturehub",
    likes: "21K",
    comments: "3.8K",
    src: "/feeds/prisoner.mp4",
  },
];

export function FeedPreview() {
  return (
    <section className="relative overflow-hidden py-16 md:py-28 lg:py-40">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            Explore the Feed
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-6xl">
            A creator platform designed for viral culture
          </h2>
        </div>

        {/* Mobile: horizontal scroll snap. Desktop: flex-wrap centered. */}
        <div className="mt-10 md:mt-20">
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:flex-wrap md:items-center md:justify-center md:gap-8 md:overflow-visible md:pb-0">
            {videos.map((video, index) => (
              <motion.div
                key={video.creator}
                initial={{
                  opacity: 0,
                  y: 40,
                  rotate: index % 2 === 0 ? -4 : 4,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: index % 2 === 0 ? -2 : 2,
                }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="
                  relative
                  h-[440px] w-[240px] shrink-0 snap-center
                  md:h-[520px] md:w-[280px]
                  overflow-hidden
                  rounded-[2.5rem]
                  border border-white/10
                  bg-zinc-900
                  shadow-2xl
                "
              >
                {/* video bg */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                  <video
                    className="h-full w-full scale-[1.02] object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl md:h-20 md:w-20">
                    <Play className="h-6 w-6 fill-white text-white md:h-8 md:w-8" />
                  </div>
                </div>

                {/* bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs">
                    Collectible
                  </div>
                  <p className="mt-3 font-medium md:mt-4">{video.creator}</p>
                  <div className="mt-4 flex gap-5 text-sm text-zinc-300 md:gap-6">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {video.likes}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {video.comments}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll hint — mobile only */}
          <p className="mt-3 text-center text-xs text-zinc-600 md:hidden">
            Swipe to explore →
          </p>
        </div>
      </Container>
    </section>
  );
}
