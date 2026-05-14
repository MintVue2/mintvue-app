"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Grid3X3, Heart, Gem, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

type UserProfile = {
  id: string;
  email: string;
  wallet_address: string | null;
  joined_at: string;
};

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
  liked_by_me: boolean;
};

type Tab = "posts" | "liked" | "minted";

// ── Helpers ───────────────────────────────────────────────────────────────────

function truncateAddress(addr: string) {
  return addr.length <= 12 ? addr : `${addr.slice(0, 6)}....${addr.slice(-4)}`;
}

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

function formatJoinDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Seed a stable gradient from a content id
const GRADIENTS = [
  "from-violet-900 to-fuchsia-900",
  "from-blue-900 to-cyan-900",
  "from-rose-900 to-pink-900",
  "from-amber-900 to-orange-900",
  "from-emerald-900 to-teal-900",
  "from-indigo-900 to-violet-900",
];

function gradientFor(id: string) {
  const h = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[h % GRADIENTS.length];
}

// ── Content card (profile grid item) ─────────────────────────────────────────

function ContentCard({ item, index }: { item: FeedItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={`group relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-gradient-to-br ${gradientFor(item.id)} cursor-pointer`}
    >
      {/* Badges */}
      <div className="absolute left-1.5 top-1.5 flex flex-col gap-1">
        {item.minted && (
          <span className="rounded-full bg-violet-600/80 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
            MINTED
          </span>
        )}
        {item.is_mintable && !item.minted && (
          <span className="rounded-full bg-fuchsia-600/80 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
            MINTABLE
          </span>
        )}
      </div>

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <div className="flex items-center gap-1 text-xs text-white">
          <Heart className="h-3 w-3 fill-white" />
          <span>{item.likes.toLocaleString()}</span>
        </div>
        {item.caption && (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-300">
            {item.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [liked, setLiked] = useState<FeedItem[]>([]);
  const [minted, setMinted] = useState<FeedItem[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [tab, setTab] = useState<Tab>("posts");
  const [copied, setCopied] = useState(false);

  // Fetch user
  useEffect(() => {
    apiFetch<UserProfile>("/user/me")
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoadingUser(false));
  }, []);

  // Fetch posts + liked — both derived from the same feed call
  useEffect(() => {
    if (!user) return;
    apiFetch<FeedItem[]>("/content/feed")
      .then((feed) => {
        setPosts(feed.filter((f) => f.creator_id === user.id));
        setLiked(feed.filter((f) => f.liked_by_me));
      })
      .catch(console.error)
      .finally(() => setLoadingPosts(false));
  }, [user]);

  // Fetch minted collectibles lazily
  useEffect(() => {
    if (tab !== "minted") return;
    apiFetch<FeedItem[]>("/mint/collectibles")
      .then((data) => setMinted(data ?? []))
      .catch(() => setMinted([]));
  }, [tab]);

  const copyAddress = useCallback(async () => {
    if (!user?.wallet_address) return;
    await navigator.clipboard.writeText(user.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [user?.wallet_address]);

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const mintedCount = posts.filter((p) => p.minted).length;

  // ── Tabs config ──────────────────────────────────────────────────────────
  const TABS: {
    key: Tab;
    label: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
    { key: "posts", label: "Posts", icon: Grid3X3, count: posts.length },
    { key: "liked", label: "Liked", icon: Heart, count: liked.length },
    { key: "minted", label: "Minted", icon: Gem, count: mintedCount },
  ];

  // ── Render ───────────────────────────────────────────────────────────────

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* ── PROFILE HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 pb-8 text-center"
        >
          {/* Avatar — initials only, no image */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl font-bold text-white shadow-xl shadow-violet-600/20">
            {user ? getInitials(user.email) : "??"}
          </div>

          {/* Email */}
          <div>
            <p className="text-xl font-bold tracking-tight">
              {user?.email ?? "—"}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-zinc-600">
              <Clock className="h-3 w-3" />
              Joined {user ? formatJoinDate(user.joined_at) : "—"}
            </div>
          </div>

          {/* Wallet address */}
          {user?.wallet_address ? (
            <button
              onClick={copyAddress}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
            >
              <span className="min-w-0 max-w-[160px] truncate font-mono text-sm text-zinc-300 sm:max-w-none">
                {truncateAddress(user.wallet_address)}
              </span>
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                  >
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                  >
                    <Copy className="h-3.5 w-3.5 text-zinc-500" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ) : (
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-600">
              No wallet connected
            </span>
          )}

          {/* Stats row */}
          <div className="mt-2 flex items-center gap-6 sm:gap-10">
            {[
              { label: "Posts", value: posts.length },
              { label: "Likes", value: totalLikes.toLocaleString() },
              { label: "Minted", value: mintedCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="text-xl font-bold">{stat.value}</span>
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <div className="sticky top-16 z-10 flex border-b border-white/10 bg-black">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 py-3 text-xs font-medium sm:text-sm transition-colors ${
                tab === key
                  ? "border-b-2 border-violet-500 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {label}
              {typeof count === "number" && count > 0 && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="pt-4">
          <AnimatePresence mode="wait">
            {/* POSTS */}
            {tab === "posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {loadingPosts ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[9/16] w-full animate-pulse rounded-xl bg-zinc-900"
                      />
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <EmptyState
                    icon={Grid3X3}
                    title="No posts yet"
                    subtitle="Content you upload will appear here."
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {posts.map((item, i) => (
                      <ContentCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* LIKED */}
            {tab === "liked" && (
              <motion.div
                key="liked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {loadingPosts ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[9/16] w-full animate-pulse rounded-xl bg-zinc-900"
                      />
                    ))}
                  </div>
                ) : liked.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="No liked content yet"
                    subtitle="Content you heart will appear here."
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {liked.map((item, i) => (
                      <ContentCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* MINTED */}
            {tab === "minted" && (
              <motion.div
                key="minted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {minted.length === 0 ? (
                  <EmptyState
                    icon={Gem}
                    title="No minted content yet"
                    subtitle="Content you mint will appear here."
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {minted.map((item, i) => (
                      <ContentCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Empty state helper ────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  subtitle,
  muted = false,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  muted?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 py-24 text-center"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${muted ? "bg-zinc-900" : "bg-violet-950/40"}`}
      >
        <Icon
          className={`h-7 w-7 ${muted ? "text-zinc-600" : "text-violet-400"}`}
        />
      </div>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>
    </motion.div>
  );
}
