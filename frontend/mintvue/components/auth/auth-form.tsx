"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export function AuthForm() {

  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const endpoint =
        mode === "login"
          ? "/auth/login"
          : "/auth/signup";

      const data = await apiFetch<{
        access_token: string;
      }>(endpoint, {
        method: "POST",
        body: JSON.stringify({ email: trimmedEmail }),
      });

      document.cookie = `token=${data.access_token}; path=/;`;

      router.push("/user/home");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      <div>
        <label className="mb-2 block text-sm text-zinc-300">
          Email
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            h-12
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            px-4
            outline-none
            transition
            focus:border-purple-500/50
          "
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="h-12 w-full"
      >
        {loading
          ? "Please wait..."
          : mode === "login"
          ? "Login"
          : "Create Account"}
      </Button>

      <button
        onClick={() =>
          setMode(mode === "login" ? "register" : "login")
        }
        className="w-full text-sm text-zinc-400 hover:text-white"
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>

    </div>
  );
}