"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  MessageCircle,
  Bell,
  Wallet,
  Calendar,
  Store,
  Users,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { apiFetch, clearToken } from "@/lib/api";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const items = [
    { label: "Your Vue", icon: Home, href: "/user/home" },
    { label: "Messages", icon: MessageCircle, href: "/user/messages" },
    { label: "Notifications", icon: Bell, href: "/user/notifications" },
    { label: "Wallet", icon: Wallet, href: "/user/wallet" },
    { label: "Events", icon: Calendar, href: "/user/events" },
    { label: "Marketplace", icon: Store, href: "/user/marketplace" },
    { label: "Followers", icon: Users, href: "/user/followers" },
    { label: "Profile", icon: User, href: "/user/profile" },
    { label: "Settings", icon: Settings, href: "/user/settings" },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Clear locally even if backend call fails
    } finally {
      clearToken();
      router.push("/auth");
    }
  };

  return (
    <div className="flex h-full w-full flex-col p-4">
      {/* NAV LABEL */}
      <div className="mb-6 px-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
        Navigation
      </div>

      {/* NAV LINKS */}
      <div className="flex-1 space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                group flex items-center gap-3
                rounded-2xl px-4 py-3
                text-sm font-medium
                transition-all duration-200
                ${
                  active
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <item.icon
                className={`h-5 w-5 transition ${
                  active ? "text-white" : "text-zinc-500 group-hover:text-white"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* DIVIDER + LOGOUT */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            group flex w-full cursor-pointer items-center gap-3
            rounded-2xl px-4 py-3
            text-sm font-medium text-zinc-400
            transition-all duration-200
            hover:bg-red-500/10 hover:text-red-400
            disabled:opacity-50
          "
        >
          <LogOut className="h-5 w-5 transition text-zinc-500 group-hover:text-red-400" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
