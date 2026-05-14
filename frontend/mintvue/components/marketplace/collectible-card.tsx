"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Heart,
  Users,
  Zap,
  Flame,
  Sparkles,
} from "lucide-react";
import type { Listing } from "./trade-modal";

type Props = {
  listing: Listing;
  index: number;
  onTrade: (listing: Listing) => void;
};

function formatUSD(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export function CollectibleCard({ listing, index, onTrade }: Props) {
  const isPositive = listing.priceChange24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group flex flex-col rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
    >
      {/* BANNER */}
      <div
        className={`relative h-36 w-full bg-gradient-to-br ${listing.gradient} flex items-center justify-center`}
      >
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {listing.isTrending && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-orange-400 backdrop-blur-sm border border-orange-500/20">
              <Flame className="h-2.5 w-2.5" /> TRENDING
            </span>
          )}
          {listing.isNew && (
            <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 backdrop-blur-sm border border-blue-500/20">
              <Sparkles className="h-2.5 w-2.5" /> NEW
            </span>
          )}
        </div>

        {/* Price badge */}
        <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
          <p className="font-mono text-xs font-bold text-white">
            {listing.price.toFixed(4)} ETH
          </p>
        </div>

        {/* Center icon */}
        <Zap className="h-10 w-10 text-white/20" />
      </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Creator + caption */}
        <div>
          <p className="text-xs font-semibold text-violet-400">
            {listing.creator}
          </p>
          <p className="mt-0.5 text-sm text-zinc-300 line-clamp-1">
            {listing.caption}
          </p>
        </div>

        {/* Price change */}
        <div
          className={`flex items-center gap-1.5 text-sm font-semibold ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {isPositive ? "+" : ""}
          {listing.priceChange24h.toFixed(1)}%
          <span className="ml-1 text-xs font-normal text-zinc-600">24h</span>
        </div>

        {/* Bonding curve */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-zinc-600">
            <span>Bonding curve</span>
            <span className="text-zinc-400">{listing.bondingProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              initial={{ width: 0 }}
              animate={{ width: `${listing.bondingProgress}%` }}
              transition={{
                duration: 0.8,
                delay: index * 0.05 + 0.2,
                ease: "easeOut",
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {listing.holders}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {listing.likes.toLocaleString()}
          </span>
          <span className="ml-auto text-zinc-500">
            Mkt Cap {formatUSD(listing.marketCap)}
          </span>
        </div>

        {/* Buy / Sell buttons */}
        <div className="mt-auto flex gap-2 pt-1">
          <button
            onClick={() => onTrade(listing)}
            className="flex-1 cursor-pointer rounded-xl bg-green-500/10 py-2 text-sm font-semibold text-green-400 transition hover:bg-green-500/20"
          >
            Buy
          </button>
          <button
            onClick={() => onTrade(listing)}
            className="flex-1 cursor-pointer rounded-xl bg-red-500/10 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            Sell
          </button>
        </div>
      </div>
    </motion.div>
  );
}
