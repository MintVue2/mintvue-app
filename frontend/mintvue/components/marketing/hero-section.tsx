"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";


export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      
      {/* Background Video */}
      {/* <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover blur-sm scale-105"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video> */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Purple Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed22,transparent_85%)]" />

      {/* Noise / Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.pg')]" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-white/10
               bg-white/5
              backdrop-blur-xl
              px-4
              py-2
              text-sm
              text-zinc-300
            "
          >
            Creator Ownership Reimagined
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="
              mt-8
              text-5xl
              font-semibold
              tracking-tight
              md:text-7xl
            "
          >
            Own The{" "}
            <span className="text-purple-500">
              Moments
            </span>{" "}
            The Internet Loves
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-lg
              leading-relaxed
              text-zinc-400
            "
          >
            Mintvue helps creators transform viral videos, events,
            and digital experiences into collectible assets.
          </motion.p>


          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Button size="lg"
              className="
                 rounded-xl
                bg-purple-600
                px-4 py-2
                text-sm
                hover:bg-purple-700
                transition
              ">
              Explore Feed
            </Button>
            <Button
              size="lg"
              className="
                rounded-xl
                bg-purple-600
                px-4 py-2
                text-sm
                hover:bg-purple-700
                transition
              "
            >
              Watch Demo
            </Button>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}

