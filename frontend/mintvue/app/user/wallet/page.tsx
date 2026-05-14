"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Copy, Check, Plus, Shield } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type UserProfile = {
  id: string;
  email: string;
  wallet_address: string | null;
  joined_at: string;
};

type Phase = "idle" | "creating" | "error";

const MOCK_BALANCES = [
  { symbol: "ETH", name: "Ethereum", amount: "0.00", color: "text-blue-400" },
  { symbol: "USDC", name: "USD Coin", amount: "0.00", color: "text-green-400" },
  {
    symbol: "MATIC",
    name: "Polygon",
    amount: "0.00",
    color: "text-purple-400",
  },
];

function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}....${address.slice(-4)}`;
}

export default function WalletPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch<UserProfile>("/user/me")
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const createWallet = async () => {
    setPhase("creating");
    setError(null);
    try {
      const data = await apiFetch<{ wallet_address: string }>("/wallet/", {
        method: "POST",
      });
      setUser((prev) =>
        prev ? { ...prev, wallet_address: data.wallet_address } : prev,
      );
      setPhase("idle");
    } catch (e) {
      setPhase("error");
      setError(e instanceof Error ? e.message : "Failed to create wallet");
    }
  };

  const copyAddress = async () => {
    if (!user?.wallet_address) return;
    await navigator.clipboard.writeText(user.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
      </div>
    );
  }

  const hasWallet = !!user?.wallet_address;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl space-y-6 px-6 py-10">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your on-chain wallet for NFT proceeds and transactions.
          </p>
        </div>

        {/* WALLET CARD */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <AnimatePresence mode="wait">
            {/* ── NO WALLET ── */}
            {!hasWallet && (
              <motion.div
                key="no-wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-6 py-8 text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-950/50 ring-1 ring-violet-500/20">
                  <Wallet className="h-9 w-9 text-violet-400" />
                </div>

                <div>
                  <p className="text-lg font-semibold">No Wallet Connected</p>
                  <p className="mt-2 max-w-xs text-sm text-zinc-500">
                    Create your smart wallet to receive NFT proceeds and manage
                    your on-chain assets.
                  </p>
                </div>

                {phase === "error" && error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <Button
                  onClick={createWallet}
                  disabled={phase === "creating"}
                  className="h-11 cursor-pointer border-violet-500/20 bg-violet-600 px-8 text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {phase === "creating" ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.9,
                          ease: "linear",
                        }}
                        className="mr-2 block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      />
                      Creating Wallet...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Wallet
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* ── HAS WALLET ── */}
            {hasWallet && (
              <motion.div
                key="has-wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Label */}
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-violet-400" />
                  <span className="text-xs uppercase tracking-widest text-zinc-500">
                    Smart Wallet · EVM
                  </span>
                </div>

                {/* Address row */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="min-w-0">
                    <p className="mb-0.5 text-xs text-zinc-500">Address</p>
                    <p className="truncate font-mono text-sm text-white">
                      {truncateAddress(user!.wallet_address!)}
                    </p>
                  </div>

                  <button
                    onClick={copyAddress}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition hover:bg-white/10"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span
                          key="check"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          className="flex items-center gap-1.5 text-green-400"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Copied!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          className="flex items-center gap-1.5 text-zinc-400"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BALANCES — only when wallet exists */}
        {hasWallet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-zinc-300">Balances</h2>
            </div>

            <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-zinc-900">
              {MOCK_BALANCES.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-zinc-300">
                      {asset.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {asset.symbol}
                      </p>
                      <p className="text-xs text-zinc-600">{asset.name}</p>
                    </div>
                  </div>
                  <p className={`font-mono text-sm font-medium ${asset.color}`}>
                    {asset.amount}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TRANSACTIONS — coming soon */}
        {hasWallet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-300">
                Transactions
              </h2>
              <span className="rounded-full border border-violet-500/20 bg-violet-950/60 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-violet-400">
                Coming Soon
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              {/* Blurred fake rows */}
              <div className="pointer-events-none select-none divide-y divide-white/5 blur-[2px]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-800" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-24 rounded bg-zinc-800" />
                        <div className="h-2.5 w-16 rounded bg-zinc-800" />
                      </div>
                    </div>
                    <div className="h-3 w-14 rounded bg-zinc-800" />
                  </div>
                ))}
              </div>

              {/* Coming soon overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-zinc-900/70 backdrop-blur-[1px]">
                <p className="text-sm font-medium text-zinc-300">
                  Transaction history coming soon
                </p>
                <p className="text-xs text-zinc-600">Powered by Crossmint</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
