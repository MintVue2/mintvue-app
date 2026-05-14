"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export function PreviewSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-28 lg:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_60%)]" />

      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
          {/* LEFT — text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-20"
          >
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Where viral culture becomes{" "}
              <span className="text-purple-500">collectible</span>
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              Every moment on Mintvue isn't just watched — it becomes part of a
              living creator economy. Videos, events, and experiences can be
              owned, shared, and traded seamlessly in the background.
            </p>

            <div className="mt-6 space-y-3 text-sm text-zinc-500">
              <p>• Viral videos become collectible moments</p>
              <p>• Events turn into ticketed experiences</p>
              <p>• Creators earn from engagement directly</p>
            </div>
          </motion.div>

          {/* RIGHT — decorative media, desktop only */}
          <div className="relative hidden h-[500px] md:block">
            {/* Floating image */}
            <motion.div
              initial={{ opacity: 0, rotate: -5, y: 20 }}
              whileInView={{ opacity: 1, rotate: 0, y: 0 }}
              viewport={{ once: true }}
              className="absolute right-10 top-0 h-72 w-56 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            >
              <Image
                src="/lady.jpeg"
                alt="preview"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 300px"
                className="object-cover"
              />
            </motion.div>

            {/* Video card 1 */}
            <motion.div
              initial={{ opacity: 0, rotate: 8, y: 40 }}
              whileInView={{ opacity: 1, rotate: 4, y: 0 }}
              viewport={{ once: true }}
              className="absolute left-0 top-20 h-72 w-52 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
            >
              <video
                src="/feeds/vid1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Video card 2 */}
            <motion.div
              initial={{ opacity: 0, rotate: -10, y: 60 }}
              whileInView={{ opacity: 1, rotate: -6, y: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-0 right-0 h-80 w-60 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
            >
              <video
                src="/feeds/vid2.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>

          {/* Mobile-only: single video preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto h-72 w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 md:hidden"
          >
            <video
              src="/feeds/vid1.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
