"use client";

import Image from "next/image";
import { Bell, Search } from "lucide-react";

import { useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { MobileSidebarTrigger } from "./mobile-sidebar-trigger";
import { NotificationDropdown } from "./notifications/dropdown";

export function DashboardHeader() {
  const [openSearch, setOpenSearch] = useState(false);
  const { count } = useNotifications();

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        border-b border-white/10
        bg-zinc-950
      "
    >
      <div
        className="
          mx-auto flex h-16 max-w-7xl
          items-center justify-between
          px-4
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* MOBILE SIDEBAR */}
          <MobileSidebarTrigger />

          <Image
            src="/ml.png"
            alt="Mintvue"
            width={36}
            height={36}
            className="object-contain"
          />

          <span className="text-lg font-semibold tracking-tight text-white">
            Mintvue
          </span>
        </div>

        {/* CENTER (DESKTOP SEARCH) */}
        <div className="hidden md:flex">
          <div
            className="
              flex items-center gap-3
              rounded-full
              border border-white/10
              bg-white/5
              px-4 py-2
            "
          >
            <Search className="h-4 w-4 text-zinc-400" />

            <input
              placeholder="Search creators..."
              className="
                bg-transparent
                text-sm
                outline-none
                placeholder:text-zinc-500
                text-white
              "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Mobile search toggle (optional UX upgrade) */}
          <button
            onClick={() => setOpenSearch(!openSearch)}
            className="
              md:hidden
              flex h-10 w-10
              items-center justify-center
              rounded-full
              border border-white/10
              bg-white/5
              cursor-pointer
            "
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <NotificationDropdown />

            {count > 0 && (
              <div
                className="
        absolute -right-1 -top-1
        flex h-5 min-w-5 items-center justify-center
        rounded-full
        bg-red-500 px-1 text-[10px] font-semibold
      "
              >
                {count}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH DROPDOWN */}
      {openSearch && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950 px-4 py-3">
          <div
            className="
              flex items-center gap-3
              rounded-full
              border border-white/10
              bg-white/5
              px-4 py-2
            "
          >
            <Search className="h-4 w-4 text-zinc-400" />

            <input
              placeholder="Search creators..."
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                text-white
              "
            />
          </div>
        </div>
      )}
    </header>
  );
}
