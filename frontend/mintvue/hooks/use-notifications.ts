"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        setCount(data.unread_count || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  return {
    count,
  };
}
