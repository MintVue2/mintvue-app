"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { UploadModal } from "@/components/upload/upload-modal";

export function FloatingUpload() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-6 right-6 z-50
          flex h-14 w-14 items-center justify-center
          rounded-full
          bg-purple-600
          shadow-xl shadow-purple-600/30
          transition hover:scale-105
        "
      >
        <Plus className="h-6 w-6" />
      </button>

      <UploadModal
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}