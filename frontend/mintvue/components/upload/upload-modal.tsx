"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type UploadPhase = "idle" | "uploading" | "processing" | "done";

export function UploadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");

  const isUploading = phase !== "idle";
  const canSubmit = !!video && caption.trim().length > 0;

  const reset = () => {
    setCaption("");
    setDescription("");
    setVideo(null);
    setPhase("idle");
  };

  const handleUpload = async () => {
    if (!video || !canSubmit) return;

    const formData = new FormData();
    formData.append("video", video);
    formData.append("caption", caption);
    formData.append("description", description);

    setPhase("uploading");

    
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}/content`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setPhase("processing");

      await new Promise((r) => setTimeout(r, 800));
      setPhase("done");

      await new Promise((r) => setTimeout(r, 900));
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error(error);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={isUploading ? () => {} : onOpenChange}>
      <DialogContent className="border-white/10 bg-zinc-950 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
          <DialogDescription>
            Upload your video content to Mintvue.
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* ── FORM ── */}
            {phase === "idle" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Video
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setVideo(file);
                    }}
                    className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Caption
                  </label>
                  <input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a viral caption..."
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Description{" "}
                    <span className="text-zinc-600">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your content"
                    className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
                  />
                </div>

                {/* Purple upload button — disabled until video + caption filled */}
                <Button
                  onClick={handleUpload}
                  disabled={!canSubmit}
                  className="h-12 w-full cursor-pointer bg-violet-600 hover:bg-violet-700 text-white border-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Content
                </Button>
              </motion.div>
            )}

            {/* ── UPLOADING / PROCESSING ── */}
            {(phase === "uploading" || phase === "processing") && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              >
                {/* Bouncing upload icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                >
                  <Upload className="h-10 w-10 text-violet-400" />
                </motion.div>

                {/* Progress bar — thick, purple gradient, glowing */}
                <div className="w-56 h-2.5 rounded-full bg-violet-950/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                    initial={{ width: "0%" }}
                    animate={{
                      width: phase === "uploading" ? "65%" : "100%",
                    }}
                    transition={{
                      duration: phase === "uploading" ? 4 : 0.4,
                      ease: "easeOut",
                    }}
                  />
                </div>

                {/* Status text */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phase}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-zinc-400"
                  >
                    {phase === "uploading"
                      ? "Uploading your video..."
                      : "Almost there..."}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── SUCCESS ── */}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <CheckCircle2 className="h-12 w-12 text-green-400" />
                <p className="text-sm text-zinc-400">Uploaded successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
