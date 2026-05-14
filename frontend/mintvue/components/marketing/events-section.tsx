"use client";

import { motion } from "framer-motion";
import { CalendarDays, Ticket } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export function EventsSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-28 lg:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#7c3aed22,transparent_55%)]" />

      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
          {/* LEFT — text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
              Events &amp; Experiences
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-6xl">
              Turn real-world experiences into digital culture
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-400">
              From concerts and creator meetups to exclusive digital events,
              Mintvue helps communities discover, attend, and collect
              unforgettable moments.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                <CalendarDays className="mt-0.5 h-6 w-6 shrink-0 text-purple-400" />
                <div>
                  <p className="font-medium">Discover immersive events</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Explore trending creator experiences around you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                <Ticket className="mt-0.5 h-6 w-6 shrink-0 text-purple-400" />
                <div>
                  <p className="font-medium">Own collectible tickets</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Tickets become memorable digital keepsakes.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-only simplified event card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 overflow-hidden rounded-2xl border border-white/10 md:hidden"
            >
              <div className="relative h-52 w-full">
                <Image
                  src="/image.png"
                  alt="event"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <p className="text-xs text-purple-300">
                    Lagos Creator Nights
                  </p>
                  <h3 className="mt-1 text-base font-semibold leading-snug">
                    Experience the future of creator culture
                  </h3>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — decorative, desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative hidden h-[600px] md:block"
          >
            {/* Main event poster */}
            <div className="absolute right-0 top-0 h-[500px] w-[340px] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
              <Image
                src="/image.png"
                alt="event"
                fill
                priority
                sizes="340px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
              <div className="absolute bottom-0 p-6">
                <p className="text-sm text-purple-300">Lagos Creator Nights</p>
                <h3 className="mt-2 text-3xl font-semibold">
                  Experience the future of creator culture
                </h3>
              </div>
            </div>

            {/* Floating ticket */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-20 left-0 rounded-3xl border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-xl"
            >
              <p className="text-sm text-zinc-400">Digital Ticket</p>
              <p className="mt-2 text-2xl font-semibold">VIP Access</p>
              <div className="mt-4 h-1 w-20 rounded-full bg-purple-500" />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
