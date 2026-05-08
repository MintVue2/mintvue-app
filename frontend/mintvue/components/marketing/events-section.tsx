"use client";

import { motion } from "framer-motion";
import { CalendarDays, Ticket } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export function EventsSection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">

      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#7c3aed22,transparent_55%)]" />

      <Container>
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
              Events & Experiences
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
              Turn real-world experiences into digital culture
            </h2>

            <p className="mt-6 leading-relaxed text-zinc-400">
              From concerts and creator meetups to exclusive digital events,
              Mintvue helps communities discover, attend, and collect unforgettable moments.
            </p>

            <div className="mt-10 flex flex-col gap-4">

              <div className="
                flex items-center gap-4
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                p-4
                backdrop-blur-xl
              ">
                <CalendarDays className="h-6 w-6 text-purple-400" />

                <div>
                  <p className="font-medium">Discover immersive events</p>
                  <p className="text-sm text-zinc-500">
                    Explore trending creator experiences around you.
                  </p>
                </div>
              </div>

              <div className="
                flex items-center gap-4
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                p-4
                backdrop-blur-xl
              ">
                <Ticket className="h-6 w-6 text-purple-400" />

                <div>
                  <p className="font-medium">Own collectible tickets</p>
                  <p className="text-sm text-zinc-500">
                    Tickets become memorable digital keepsakes.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px]"
          >

            {/* Main event poster */}
            <div className="
              absolute right-0 top-0
              h-[500px]
              w-[340px]
              overflow-hidden
              rounded-[2.5rem]
              border border-white/10
              shadow-2xl
            ">
              <Image
                src="/image.png"
                alt="event"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 340px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />

              <div className="absolute bottom-0 p-6">
                <p className="text-sm text-purple-300">
                  Lagos Creator Nights
                </p>

                <h3 className="mt-2 text-3xl font-semibold">
                  Experience the future of creator culture
                </h3>
              </div>
            </div>

            {/* Floating ticket */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="
                absolute
                left-0 bottom-20
                rounded-3xl
                border border-white/10
                bg-black/60
                backdrop-blur-xl
                p-6
                shadow-2xl
              "
            >
              <p className="text-sm text-zinc-400">
                Digital Ticket
              </p>

              <p className="mt-2 text-2xl font-semibold">
                VIP Access
              </p>

              <div className="mt-4 h-1 w-20 rounded-full bg-purple-500" />
            </motion.div>

          </motion.div>

        </div>
      </Container>
    </section>
  );
}