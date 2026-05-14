"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";

import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import { CreateEventModal } from "@/components/events/create-event-modal";
import { Button } from "@/components/ui/button";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/5 bg-zinc-900 overflow-hidden">
      <div className="h-40 w-full bg-zinc-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 rounded bg-zinc-800" />
        <div className="h-3 w-1/2 rounded bg-zinc-800" />
        <div className="h-3 w-2/3 rounded bg-zinc-800" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { events, loading, createEvent, deleteEvent } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* PAGE HEADER */}
        <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Events
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Discover and create events for the Mintvue community.
            </p>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="shrink-0 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white border-violet-500/20 h-10 gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            <span className="hidden sm:inline">List an Event</span>
          </Button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && events.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-950/40">
              <CalendarPlus className="h-9 w-9 text-violet-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">No events yet.</p>
              <p className="mt-1 text-sm text-zinc-500">
                Be the first to list one.
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="mt-2 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white border-violet-500/20"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              List an Event
            </Button>
          </motion.div>
        )}

        {/* EVENTS GRID */}
        {!loading && events.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDelete={deleteEvent}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <CreateEventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreate={createEvent}
      />
    </div>
  );
}
