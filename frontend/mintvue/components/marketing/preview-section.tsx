"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export function PreviewSection() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_60%)]" />

      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Where viral culture becomes{" "}
              <span className="text-purple-500">collectible</span>
            </h2>

            <p className="mt-6 text-zinc-400 leading-relaxed">
              Every moment on Mintvue isn’t just watched — it becomes part of a living creator economy.
              Videos, events, and experiences can be owned, shared, and traded seamlessly in the background.
            </p>

            <div className="mt-8 space-y-3 text-sm text-zinc-500">
              <p>• Viral videos become collectible moments</p>
              <p>• Events turn into ticketed experiences</p>
              <p>• Creators earn from engagement directly</p>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="relative h-[500px]">
            

            {/* Floating image */}
            <motion.div
              initial={{ opacity: 0, rotate: -5, y: 20 }}
              whileInView={{ opacity: 1, rotate: 0, y: 0 }}
              viewport={{ once: true }}
              className="
                absolute
                right-10 top-0
                w-56 h-72
                rounded-2xl
                overflow-hidden
                border border-white/10
                shadow-2xl
              "
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
              className="
                absolute
                left-0 top-20
                w-52 h-72
                rounded-2xl
                bg-zinc-900
                border border-white/10
                overflow-hidden
              "
            >
              <video
                src="/feeds/hero-video.mp4"
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
              className="
                absolute
                right-0 bottom-0
                w-60 h-80
                rounded-2xl
                bg-zinc-900
                border border-white/10
                overflow-hidden
              "
            >
              <video
                src="/feeds/hero-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>

          </div>
        </div>
      </Container>
    </section>
  );
}