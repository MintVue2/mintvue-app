"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export function Header() {
  return (
    <header
      className="
        fixed top-0 left-0 right-0
        z-50
        border-b border-white/10
        bg-black/40
        backdrop-blur-xl
      "
    >
      <Container>
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/ml.png"
              alt="Mintvue"
              width={130}
              height={132}
              className="h-6 w-auto"
              loading="eager"
            />
          </motion.div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
            <a href="#" className="hover:text-white transition">
              Feed
            </a>
            <a href="#" className="hover:text-white transition">
              Explore
            </a>
            <a href="#" className="hover:text-white transition">
              Events
            </a>
            <a href="#" className="hover:text-white transition">
              Marketplace
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">

            <Link href="/auth">
            <button
              className="
                rounded-xl
                bg-purple-600
                px-4 py-2
                text-sm
                hover:bg-purple-700
                transition
              "
            >
              Get Started
            </button>
            </Link>
          </div>

        </div>
      </Container>
    </header>
  );
}