"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, CheckCircle2, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type Listing = {
  id: string;
  creator: string;
  caption: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  holders: number;
  bondingProgress: number;
  likes: number;
  volume24h: number;
  supply: number;
  gradient: string;
  isTrending: boolean;
  isNew: boolean;
};

type TradeType = "buy" | "sell";
type Phase = "idle" | "confirming" | "done";

type Props = {
  listing: Listing | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function TradeModal({ listing, open, onOpenChange }: Props) {
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  if (!listing) return null;

  const ethAmount = parseFloat(amount) || 0;
  const tokenAmount =
    ethAmount > 0 ? (ethAmount / listing.price).toFixed(2) : "0";
  const priceImpact =
    ethAmount > 0 ? Math.min((ethAmount / 10) * 100, 15).toFixed(2) : "0.00";
  const isPositive = listing.priceChange24h >= 0;

  const reset = () => {
    setAmount("");
    setPhase("idle");
    setTradeType("buy");
  };

  const handleTrade = async () => {
    if (!amount || ethAmount <= 0) return;
    setPhase("confirming");
    // Simulated network delay
    await new Promise((r) => setTimeout(r, 1800));
    setPhase("done");
    await new Promise((r) => setTimeout(r, 1200));
    onOpenChange(false);
    reset();
  };

  const handleClose = (v: boolean) => {
    if (phase === "confirming") return;
    onOpenChange(v);
    if (!v) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-white/10 bg-zinc-950 text-white overflow-hidden max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Trade &middot; {listing.caption.slice(0, 28)}
            {listing.caption.length > 28 ? "\u2026" : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            {/* ── TRADE FORM ── */}
            {phase === "idle" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Buy / Sell toggle */}
                <div className="flex rounded-xl bg-white/5 p-1">
                  {(["buy", "sell"] as TradeType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTradeType(t)}
                      className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-medium capitalize transition-all ${
                        tradeType === t
                          ? t === "buy"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Price info */}
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-xs text-zinc-500">Current Price</p>
                    <p className="font-mono text-sm font-semibold text-white">
                      {listing.price.toFixed(4)} ETH
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {isPositive ? "+" : ""}
                    {listing.priceChange24h.toFixed(1)}%
                  </div>
                </div>

                {/* Amount input */}
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-500 uppercase tracking-wider">
                    Amount (ETH)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-violet-500/50">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.001"
                      className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-zinc-600"
                    />
                    <span className="text-xs text-zinc-500">ETH</span>
                  </div>
                  {/* Quick amounts */}
                  <div className="mt-2 flex gap-2">
                    {["0.01", "0.05", "0.1", "0.5"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmount(v)}
                        className="cursor-pointer rounded-lg bg-white/5 px-2.5 py-1 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trade info */}
                <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-500">
                  <div className="flex justify-between">
                    <span>You receive</span>
                    <span className="font-mono text-white">
                      {tokenAmount} tokens
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price impact</span>
                    <span
                      className={`font-mono ${
                        parseFloat(priceImpact) > 5
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      ~{priceImpact}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slippage tolerance</span>
                    <span className="font-mono text-zinc-400">2%</span>
                  </div>
                </div>

                <Button
                  onClick={handleTrade}
                  disabled={!amount || ethAmount <= 0}
                  className={`h-11 w-full cursor-pointer font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                    tradeType === "buy"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {tradeType === "buy" ? "Confirm Buy" : "Confirm Sell"}
                </Button>
              </motion.div>
            )}

            {/* ── CONFIRMING ── */}
            {phase === "confirming" && (
              <motion.div
                key="confirming"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-12 w-12 rounded-full border-4 border-white/10 border-t-violet-500"
                />
                <div className="text-center">
                  <p className="font-semibold text-white">
                    Confirming transaction
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Broadcasting to network...
                  </p>
                </div>
                <div className="w-48 overflow-hidden rounded-full bg-violet-950/60 h-1.5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* ── DONE ── */}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <CheckCircle2 className="h-14 w-14 text-green-400" />
                <div className="text-center">
                  <p className="font-semibold text-white">
                    {tradeType === "buy"
                      ? "Purchase complete!"
                      : "Sale complete!"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {ethAmount} ETH {tradeType === "buy" ? "spent" : "received"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
