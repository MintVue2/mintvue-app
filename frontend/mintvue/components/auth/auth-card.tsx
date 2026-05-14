"use client";

import { motion } from "framer-motion";
import { AuthForm } from "./auth-form";
import { SocialAuth } from "./social-auth";

export function AuthCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl sm:p-8"
    >
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
          Welcome to Mintvue
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Join the future of creator culture
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
          Create, discover, and own digital experiences seamlessly.
        </p>
      </div>

      <div className="mt-7 sm:mt-10">
        <SocialAuth />
      </div>

      <div className="relative my-7 sm:my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-4 text-zinc-500">
            Or continue with email
          </span>
        </div>
      </div>

      <AuthForm />
    </motion.div>
  );
}
