"use client";

import { Heart, MessageCircle, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const videos = [
  {
    creator: "@davidwaves",
    likes: "12.4K",
    comments: "1.2K",
  },
  {
    creator: "@urbanamira",
    likes: "8.1K",
    comments: "604",
  },
  {
    creator: "@culturehub",
    likes: "21K",
    comments: "3.8K",
  },
];

export function FeedPreview() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">

      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            Explore the Feed
          </p>

          <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
            A creator platform designed for viral culture
          </h2>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-8">

          {videos.map((video, index) => (
            <motion.div
              key={video.creator}
              initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -4 : 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -2 : 2 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="
                relative
                h-[520px]
                w-[280px]
                overflow-hidden
                rounded-[2.5rem]
                border
                border-white/10
                bg-zinc-900
                shadow-2xl
              "
            >

              {/* fake video bg */}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-black" />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="
                  flex h-20 w-20 items-center justify-center
                  rounded-full
                  bg-white/10
                  backdrop-blur-xl
                ">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>

              {/* bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">

                <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs inline-flex">
                  Collectible
                </div>

                <p className="mt-4 font-medium">
                  {video.creator}
                </p>

                <div className="mt-6 flex gap-6 text-zinc-300 text-sm">
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
      </Container>
    </section>
  );
}