"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Layers,
  PackageOpen,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { StatsBar } from "@/components/marketplace/stats-bar";
import { CollectibleCard } from "@/components/marketplace/collectible-card";
import { TradeModal, type Listing } from "@/components/marketplace/trade-modal";

// ── Types ────────────────────────────────────────────────────────────────────

type FeedItem = {
  id: string;
  creator_id: string;
  media_url: string;
  caption: string | null;
  description: string;
  likes: number;
  views: number;
  is_mintable: boolean;
  minted: boolean;
  created_at: string;
};

type Tab = "trending" | "new" | "collectibles";
type SortKey = "marketCap" | "price" | "holders" | "priceChange24h";

// ── Mock seed helpers ────────────────────────────────────────────────────────

const GRADIENTS = [
  "from-violet-900 to-fuchsia-900",
  "from-blue-900 to-cyan-900",
  "from-rose-900 to-pink-900",
  "from-amber-900 to-orange-900",
  "from-emerald-900 to-teal-900",
  "from-indigo-900 to-violet-900",
];

function hashId(id: string): number {
  return id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function seedListing(item: FeedItem, index: number): Listing {
  const h = hashId(item.id);
  const price = parseFloat((((h % 90) + 10) / 1000).toFixed(4));
  const holders = (h % 150) + 5;
  const marketCap = Math.round(price * holders * 1800);
  const bondingProgress = (h % 70) + 20;
  const priceChange = parseFloat((((h % 400) - 150) / 10).toFixed(1));
  const volume24h = Math.round(marketCap * 0.12);

  return {
    id: item.id,
    creator: `@user_${item.creator_id.slice(0, 6)}`,
    caption: item.caption ?? "Untitled content",
    price,
    priceChange24h: priceChange,
    marketCap,
    holders,
    bondingProgress,
    likes: item.likes,
    volume24h,
    supply: 100,
    gradient: GRADIENTS[h % GRADIENTS.length],
    isTrending: bondingProgress > 70 || priceChange > 15,
    isNew: index < 3,
  };
}

const MOCK_FALLBACK: Listing[] = [
  {
    id: "mock-1",
    creator: "@0xfire",
    caption: "This changed the game 🔥",
    price: 0.052,
    priceChange24h: 18.4,
    marketCap: 5200,
    holders: 63,
    bondingProgress: 82,
    likes: 1842,
    volume24h: 1240,
    supply: 100,
    gradient: "from-violet-900 to-fuchsia-900",
    isTrending: true,
    isNew: false,
  },
  {
    id: "mock-2",
    creator: "@neon_pulse",
    caption: "POV: You went viral 🌊",
    price: 0.034,
    priceChange24h: 7.2,
    marketCap: 3400,
    holders: 41,
    bondingProgress: 54,
    likes: 967,
    volume24h: 820,
    supply: 100,
    gradient: "from-blue-900 to-cyan-900",
    isTrending: true,
    isNew: false,
  },
  {
    id: "mock-3",
    creator: "@aurora_labs",
    caption: "We built this in 48h",
    price: 0.071,
    priceChange24h: -4.1,
    marketCap: 7100,
    holders: 88,
    bondingProgress: 91,
    likes: 3201,
    volume24h: 2100,
    supply: 100,
    gradient: "from-emerald-900 to-teal-900",
    isTrending: false,
    isNew: true,
  },
  {
    id: "mock-4",
    creator: "@synthwave",
    caption: "Generative art drop 🎨",
    price: 0.019,
    priceChange24h: 31.5,
    marketCap: 1900,
    holders: 24,
    bondingProgress: 38,
    likes: 512,
    volume24h: 440,
    supply: 100,
    gradient: "from-rose-900 to-pink-900",
    isTrending: false,
    isNew: true,
  },
  {
    id: "mock-5",
    creator: "@defi_degen",
    caption: "1000x or nothing 💎",
    price: 0.044,
    priceChange24h: -11.2,
    marketCap: 4400,
    holders: 55,
    bondingProgress: 67,
    likes: 1103,
    volume24h: 670,
    supply: 100,
    gradient: "from-amber-900 to-orange-900",
    isTrending: false,
    isNew: false,
  },
  {
    id: "mock-6",
    creator: "@meta_mint",
    caption: "First mover advantage 🚀",
    price: 0.088,
    priceChange24h: 22.8,
    marketCap: 8800,
    holders: 112,
    bondingProgress: 95,
    likes: 4520,
    volume24h: 3300,
    supply: 100,
    gradient: "from-indigo-900 to-violet-900",
    isTrending: true,
    isNew: false,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const TABS: {
  key: Tab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}[] = [
  { key: "trending", label: "Trending", shortLabel: "Trending", icon: Flame },
  { key: "new", label: "New", shortLabel: "New", icon: Sparkles },
  {
    key: "collectibles",
    label: "My Collectibles",
    shortLabel: "Mine",
    icon: Layers,
  },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "marketCap", label: "Market Cap" },
  { key: "price", label: "Price" },
  { key: "holders", label: "Holders" },
  { key: "priceChange24h", label: "24h Change" },
];

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [myCollectibles, setMyCollectibles] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectiblesLoading, setCollectiblesLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("trending");
  const [sort, setSort] = useState<SortKey>("marketCap");
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [tradeOpen, setTradeOpen] = useState(false);

  useEffect(() => {
    apiFetch<FeedItem[]>("/content/feed")
      .then((feed) => {
        const mintable = feed.filter((f) => f.is_mintable);
        const mapped = mintable.map((item, i) => seedListing(item, i));
        setListings(mapped.length > 0 ? mapped : MOCK_FALLBACK);
      })
      .catch(() => setListings(MOCK_FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== "collectibles") return;
    setCollectiblesLoading(true);
    apiFetch<FeedItem[]>("/mint/collectibles")
      .then((data) => {
        const mapped = (data ?? []).map((item, i) => seedListing(item, i));
        setMyCollectibles(mapped);
      })
      .catch(() => setMyCollectibles([]))
      .finally(() => setCollectiblesLoading(false));
  }, [tab]);

  const handleTrade = (listing: Listing) => {
    setSelectedListing(listing);
    setTradeOpen(true);
  };

  const filtered = useMemo(() => {
    let base = tab === "collectibles" ? myCollectibles : listings;
    if (tab === "trending")
      base = base.filter((l) => l.isTrending || l.bondingProgress > 60);
    if (tab === "new") base = base.filter((l) => l.isNew || true).slice(0, 12);
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (l) =>
          l.caption.toLowerCase().includes(q) ||
          l.creator.toLowerCase().includes(q),
      );
    }
    return [...base].sort((a, b) => {
      if (sort === "priceChange24h") return b.priceChange24h - a.priceChange24h;
      return (b[sort] as number) - (a[sort] as number);
    });
  }, [listings, myCollectibles, tab, sort, search]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6 sm:py-10">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Marketplace
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Discover, buy and sell minted content NFTs.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-violet-500/20 bg-violet-950/40 px-3 py-1 text-xs text-violet-400">
            MVP · Mock
          </span>
        </div>

        {/* STATS */}
        <StatsBar />

        {/* TABS + SEARCH + SORT */}
        <div className="flex flex-col gap-3">
          {/* Tabs row */}
          <div className="flex gap-1 rounded-xl bg-zinc-900 p-1 border border-white/5 w-full">
            {TABS.map(({ key, label, shortLabel, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm ${
                  tab === key
                    ? "bg-violet-600 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="sm:hidden">{shortLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Search + Sort row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search creators or content..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 sm:w-auto">
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="flex-1 cursor-pointer bg-transparent text-sm text-zinc-300 outline-none sm:flex-none"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key} className="bg-zinc-900">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {/* Loading */}
          {(loading || (tab === "collectibles" && collectiblesLoading)) && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-white/5 bg-zinc-900 overflow-hidden"
                >
                  <div className="h-36 bg-zinc-800" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-1/3 rounded bg-zinc-800" />
                    <div className="h-3 w-2/3 rounded bg-zinc-800" />
                    <div className="h-2 w-full rounded bg-zinc-800" />
                    <div className="h-8 w-full rounded-xl bg-zinc-800" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* My Collectibles empty state */}
          {!loading &&
            tab === "collectibles" &&
            !collectiblesLoading &&
            myCollectibles.length === 0 && (
              <motion.div
                key="empty-collectibles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-28 text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-950/40">
                  <PackageOpen className="h-9 w-9 text-violet-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold">No collectibles yet</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Content you mint will appear here.
                  </p>
                </div>
              </motion.div>
            )}

          {/* Grid */}
          {!loading &&
            !(tab === "collectibles" && collectiblesLoading) &&
            !(tab === "collectibles" && myCollectibles.length === 0) && (
              <motion.div
                key={`grid-${tab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((listing, i) => (
                  <CollectibleCard
                    key={listing.id}
                    listing={listing}
                    index={i}
                    onTrade={handleTrade}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full py-24 text-center text-sm text-zinc-600">
                    No results found for &quot;{search}&quot;
                  </div>
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      <TradeModal
        listing={selectedListing}
        open={tradeOpen}
        onOpenChange={setTradeOpen}
      />
    </div>
  );
}
