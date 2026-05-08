"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthForm() {

  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    try {

      setLoading(true);

      const endpoint =
        mode === "login"
          ? "http://localhost:8000/login"
          : "http://localhost:8000/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      // assuming backend returns JWT
      localStorage.setItem("token", data.access_token);

      router.push("/users/me");

    } catch (error) {

      console.error(error);

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