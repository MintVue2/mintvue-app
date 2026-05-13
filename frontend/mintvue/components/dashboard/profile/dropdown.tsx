"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { apiFetch, clearToken } from "@/lib/api";

export function ProfileDropdown() {

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Even if the backend call fails, clear locally and redirect
    } finally {
      clearToken();
      router.push("/auth");
    }
  };

  // ✅ CLOSE ON OUTSIDE CLICK
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ✅ CLOSE ON ESC
  useEffect(() => {

    const handleEsc = (e: KeyboardEvent) => {

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () =>
      document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div ref={ref} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
          flex h-11 w-11 items-center justify-center
          rounded-full
          border border-white/10
          bg-white/5
          text-sm font-semibold
        "
      >
        U
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-14
            w-56
            overflow-hidden
            rounded-2xl
            border border-white/10
            bg-zinc-950/95
            backdrop-blur-2xl
            shadow-2xl
          "
        >

          <button
            className="
              flex w-full items-center gap-3
              px-4 py-4
              text-left
              transition
              hover:bg-white/5
            "
          >
            <User className="h-4 w-4" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              flex w-full items-center gap-3
              px-4 py-4
              text-left
              text-red-400
              transition
              hover:bg-red-500/10
              disabled:opacity-50
            "
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

        </div>
      )}

    </div>
  );
}