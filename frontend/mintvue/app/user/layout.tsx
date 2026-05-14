"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-black text-white flex">
      {/* SIDEBAR — hidden on mobile, fixed on desktop */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 border-r border-white/10 bg-black z-40">
        <Sidebar />
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        <DashboardHeader />

        {/* Scroll container — NO snap here, feed manages its own */}
        <main className="flex-1 overflow-y-auto pt-16">{children}</main>
      </div>
    </div>
  );
}
