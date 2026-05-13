"use client";

import { useEffect, useState } from "react";

export function useAuth() {

  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {

    const verify = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          setAuthenticated(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        setAuthenticated(true);

      } catch {

        localStorage.removeItem("token");

        setAuthenticated(false);

      } finally {

        setLoading(false);
      }
    };

    verify();

  }, []);

  return {
    loading,
    authenticated,
  };
}