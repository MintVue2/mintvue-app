"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FloatingUpload } from "@/components/dashboard/floating-upload";
import { VideoFeed } from "@/components/feed/video-feed";
import { FeedNavigation } from "@/components/feed/feed-navigation";

export default function UserDashboard() {
  return (
    <main className="bg-black text-white h-screen overflow-y-scroll snap-y snap-mandatory scroll-pt-16">
      <DashboardHeader />

      <VideoFeed />

      <FeedNavigation />

      <FloatingUpload />
    </main>
  );
}
