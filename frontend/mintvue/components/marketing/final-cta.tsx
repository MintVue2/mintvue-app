"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed33,transparent_60%)]" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center backdrop-blur-xl sm:rounded-[3rem] sm:px-8 sm:py-20"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            Join Mintvue
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
            Own the future of digital culture
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Discover viral creators, immersive events, and collectible digital
            experiences all in one platform.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Start Creating
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-white/10 bg-white/5 hover:bg-white/10 sm:w-auto"
            >
              Explore Feed
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
