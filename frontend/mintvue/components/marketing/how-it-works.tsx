"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";

const steps = [
  {
    icon: Upload,
    title: "Create",
    description:
      "Upload short-form videos, moments, and digital experiences in seconds.",
  },
  {
    icon: Sparkles,
    title: "Engage",
    description:
      "Fans interact, share, and amplify your content across the platform.",
  },
  {
    icon: BadgeCheck,
    title: "Own",
    description:
      "Transform viral moments into collectible digital experiences your audience can own.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-16 md:py-28 lg:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed11,transparent_50%)]" />

      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Built for the next generation of creators
          </h2>

          <p className="mt-5 leading-relaxed text-zinc-400">
            Mintvue combines creator culture, collectible ownership, and
            immersive experiences into one seamless platform.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:mt-20 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>

                <h3 className="mt-5 text-xl font-medium md:mt-6 md:text-2xl">
                  {step.title}
                </h3>

                <p className="mt-3 leading-relaxed text-zinc-400 md:mt-4">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
