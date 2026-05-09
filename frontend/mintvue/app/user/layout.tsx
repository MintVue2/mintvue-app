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

      {/* SIDEBAR (we'll build this next) */}
     <aside
  className="
    hidden md:block
    fixed left-0 top-16 bottom-0
    w-64
    border-r border-white/10
    bg-black
  "
>
        <Sidebar />
        </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col md:ml-64">

        <DashboardHeader />

        {/* IMPORTANT: scroll lives here */}
        <main
  className="
    flex-1
    overflow-y-auto
    snap-y snap-mandatory
    pt-16
  "
>
          {children}
        </main>

      </div>

    </div>
  );
}