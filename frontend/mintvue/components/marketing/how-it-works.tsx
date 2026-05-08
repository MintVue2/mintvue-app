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
    <section className="relative py-28 md:py-36 overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed11,transparent_50%)]" />

      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            How It Works
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Built for the next generation of creators
          </h2>

          <p className="mt-6 text-zinc-400 leading-relaxed">
            Mintvue combines creator culture, collectible ownership,
            and immersive experiences into one seamless platform.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  backdrop-blur-xl
                  p-8
                "
              >
                <div className="
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl
                  bg-purple-500/10
                  border border-purple-500/20
                ">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>

                <h3 className="mt-6 text-2xl font-medium">
                  {step.title}
                </h3>

                <p className="mt-4 text-zinc-400 leading-relaxed">
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