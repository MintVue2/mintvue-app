"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  media_url: string | null;
  location: string;
  date: string;
};

export type CreateEventPayload = {
  title: string;
  location: string;
  date: string;
  description?: string;
  media_url?: string;
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await apiFetch<Event[]>("/events/");
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (payload: CreateEventPayload): Promise<Event> => {
    const event = await apiFetch<Event>("/events/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setEvents((prev) => [event, ...prev]);
    return event;
  };

  const deleteEvent = async (id: string): Promise<void> => {
    // DELETE returns 204 No Content — use raw fetch to avoid JSON parse errors
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}/events/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok && res.status !== 204) {
      throw new Error("Failed to delete event");
    }

    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return { events, loading, createEvent, deleteEvent, refetch: fetchEvents };
}
