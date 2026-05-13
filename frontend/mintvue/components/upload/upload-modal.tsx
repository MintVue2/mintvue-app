"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Upload } from "lucide-react";

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

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();

    formData.append("video", video);
    formData.append("caption", caption);
    formData.append("description", description);

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
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      onOpenChange(false);

      setCaption("");
      setDescription("");
      setVideo(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle>
            Upload Content
          </DialogTitle>
          <DialogDescription>
      Upload your video content to Mintvue.
    </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Video
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setVideo(file);
                }
                 }}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
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
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content"
              className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
            />
          </div>

          <Button
            onClick={handleUpload}
            className="h-12 w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Content
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}