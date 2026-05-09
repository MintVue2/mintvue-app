"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  message: string;
  time: string;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "🔥 Your video is trending!",
    time: "2m ago",
  },
  {
    id: "2",
    message: "💬 New comment on your post",
    time: "10m ago",
  },
  {
    id: "3",
    message: "🎉 You got 1K new followers",
    time: "1h ago",
  },
];

export function NotificationDropdown() {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close outside click
  useEffect(() => {

    const handleClickOutside = (e: MouseEvent) => {

      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex h-11 w-11
          items-center justify-center
          rounded-full
          border border-white/10
          bg-white/3
          hover:bg-white/10
          transition
        "
      >
        <Bell className="h-5 w-5" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute right-0 top-14
            w-80
            overflow-hidden
            rounded-2xl
            border border-white/10
            bg-zinc-950/95
            backdrop-blur-2xl
            shadow-2xl
          "
        >

          <div className="p-4 border-b border-white/10">
            <p className="text-sm font-semibold">
              Notifications
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto">

            {mockNotifications.map((n) => (
              <div
                key={n.id}
                className="
                  flex flex-col
                  gap-1
                  px-4 py-3
                  hover:bg-white/5
                  transition
                "
              >
                <p className="text-sm text-white">
                  {n.message}
                </p>

                <p className="text-xs text-zinc-500">
                  {n.time}
                </p>
              </div>
            ))}

          </div>

          <div className="p-3 border-t border-white/10 text-center">
            <a
              href="/user/notifications"
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              View all notifications
            </a>
          </div>

        </div>
      )}

    </div>
  );
}