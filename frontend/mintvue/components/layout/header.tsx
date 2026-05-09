"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {

  const [open, setOpen] = useState(false);

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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
            <a href="#" className="hover:text-white transition">Feed</a>
            <a href="#" className="hover:text-white transition">Explore</a>
            <a href="#" className="hover:text-white transition">Events</a>
            <a href="#" className="hover:text-white transition">Marketplace</a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Get Started */}
            <Link href="/auth">
              <button
                className="
                  hidden md:block
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="
                md:hidden
                flex items-center justify-center
                h-10 w-10
                rounded-lg
                border border-white/10
                bg-white/5
              "
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

          </div>

        </div>

      </Container>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="
            md:hidden
            border-t border-white/10
            bg-black/95
            backdrop-blur-xl
          "
        >
          <div className="flex flex-col gap-4 p-5 text-sm text-zinc-300">

            <a href="#" className="hover:text-white">Feed</a>
            <a href="#" className="hover:text-white">Explore</a>
            <a href="#" className="hover:text-white">Events</a>
            <a href="#" className="hover:text-white">Marketplace</a>

            <Link href="/auth">
              <button
                className="
                  mt-2
                  w-full
                  rounded-xl
                  bg-purple-600
                  py-2
                  text-white
                "
              >
                Get Started
              </button>
            </Link>

          </div>
        </div>
      )}

    </header>
  );
}