"use client";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "./sidebar";

export function MobileSidebarTrigger() {

  return (
    <Sheet>

      <SheetTrigger asChild>

        <button
          className="
            flex h-11 w-11
            items-center justify-center
            rounded-full
            border border-white/10
            bg-white/5
            md:hidden
          "
        >
          <Menu className="h-5 w-5" />
        </button>

      </SheetTrigger>

      <SheetContent
        side="left"
        className="
          border-white/10
          bg-black
          text-white
        "
      >

        <div className="mt-10">

          <Sidebar />

        </div>

      </SheetContent>

    </Sheet>
  );
}