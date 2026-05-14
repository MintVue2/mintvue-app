"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Event } from "@/hooks/use-events";

type Props = {
  event: Event;
  onDelete: (id: string) => Promise<void>;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventCard({ event, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onDelete(event.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      {/* BANNER */}
      {event.media_url ? (
        <img
          src={event.media_url}
          alt={event.title}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-violet-900/60 to-fuchsia-900/40">
          <Calendar className="h-12 w-12 text-violet-400 opacity-60" />
        </div>
      )}

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug">
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-violet-400">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatDate(event.date)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {event.description && (
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-auto flex justify-end pt-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
