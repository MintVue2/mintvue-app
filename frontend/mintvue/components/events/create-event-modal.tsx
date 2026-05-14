"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CreateEventPayload } from "@/hooks/use-events";

type Phase = "idle" | "submitting" | "done";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (payload: CreateEventPayload) => Promise<unknown>;
};

export function CreateEventModal({ open, onOpenChange, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  const isSubmitting = phase !== "idle";
  const canSubmit =
    title.trim().length > 0 && location.trim().length > 0 && date.length > 0;

  const reset = () => {
    setTitle("");
    setLocation("");
    setDate("");
    setDescription("");
    setMediaUrl("");
    setPhase("idle");
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setPhase("submitting");

    try {
      await onCreate({
        title: title.trim(),
        location: location.trim(),
        date: new Date(date).toISOString(),
        description: description.trim() || undefined,
        media_url: mediaUrl.trim() || undefined,
      });

      setPhase("done");
      await new Promise((r) => setTimeout(r, 900));
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error(error);
      setPhase("idle");
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50";

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? () => {} : onOpenChange}>
      <DialogContent className="border-white/10 bg-zinc-950 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle>List an Event</DialogTitle>
          <DialogDescription>
            Create an event for the Mintvue community.
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait">
            {/* FORM */}
            {phase === "idle" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    Location
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Venue or Online"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`${inputClass} cursor-pointer [color-scheme:dark]`}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    Description{" "}
                    <span className="text-zinc-600">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell people what this event is about"
                    className="min-h-20 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    Banner Image URL{" "}
                    <span className="text-zinc-600">(optional)</span>
                  </label>
                  <input
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="h-12 w-full cursor-pointer bg-violet-600 hover:bg-violet-700 text-white border-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  List Event
                </Button>
              </motion.div>
            )}

            {/* SUBMITTING */}
            {phase === "submitting" && (
              <motion.div
                key="submitting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                >
                  <CalendarPlus className="h-10 w-10 text-violet-400" />
                </motion.div>

                <div className="w-56 h-2.5 rounded-full bg-violet-950/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>

                <p className="text-sm text-zinc-400">Creating your event...</p>
              </motion.div>
            )}

            {/* DONE */}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <CheckCircle2 className="h-12 w-12 text-green-400" />
                <p className="text-sm text-zinc-400">
                  Event listed successfully!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
