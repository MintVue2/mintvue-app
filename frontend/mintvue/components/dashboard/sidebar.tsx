"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  Home,
  MessageCircle,
  Bell,
  Calendar,
  Store,
  Users,
  Settings,
} from "lucide-react";

export function Sidebar() {

  const pathname = usePathname();

  const items = [
    {
      label: "Your Vue",
      icon: Home,
      href: "/user/home",
    },

    {
      label: "Messages",
      icon: MessageCircle,
      href: "/user/messages",
    },

    {
      label: "Notifications",
      icon: Bell,
      href: "/user/notifications",
    },

    {
      label: "Events",
      icon: Calendar,
      href: "/user/events",
    },

    {
      label: "Marketplace",
      icon: Store,
      href: "/user/marketplace",
    },

    {
      label: "Followers",
      icon: Users,
      href: "/user/followers",
    },

    {
      label: "Settings",
      icon: Settings,
      href: "/user/settings",
    },
  ];

  return (
    <div className="w-full p-4">

      <div className="mb-6 px-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
        Navigation
      </div>

      <div className="space-y-2">

        {items.map((item) => {

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                group flex items-center gap-3
                rounded-2xl
                px-4 py-3
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
                className={`
                  h-5 w-5 transition

                  ${
                    active
                      ? "text-white"
                      : "text-zinc-500 group-hover:text-white"
                  }
                `}
              />

              {item.label}

            </Link>
          );
        })}

      </div>

    </div>
  );
}