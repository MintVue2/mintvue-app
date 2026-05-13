"use client";

import { useEffect, useState } from "react";

type FeedVideo = {
  id: string;

  creator: string;

  caption: string;

  description?: string;

  video_url: string;

  likes?: number;

  comments?: number;
};

export function useFeed() {

  const [videos, setVideos] =
    useState<FeedVideo[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchFeed = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/feed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch feed");
        }

        const data =
          await response.json();

        setVideos(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    fetchFeed();

  }, []);

  return {
    videos,
    loading,
  };
}