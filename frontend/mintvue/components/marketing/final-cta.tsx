"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed33,transparent_60%)]" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="
            relative
            overflow-hidden
            rounded-[3rem]
            border border-white/10
            bg-white/[0.03]
            px-8 py-20
            text-center
            backdrop-blur-xl
          "
        >

          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            Join Mintvue
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Own the future of digital culture
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Discover viral creators, immersive events,
            and collectible digital experiences all in one platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg">
              Start Creating
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              Explore Feed
            </Button>
          </div>

        </motion.div>
      </Container>
    </section>
  );
}