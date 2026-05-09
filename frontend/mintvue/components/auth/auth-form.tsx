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

  const handleSubmit = async () => {

  try {

    setLoading(true);

    const endpoint =
      mode === "login"
        ? "/auth/login"
        : "/auth/signup";

    const data = await apiFetch<{
      access_token: string;
    }>(endpoint, {
      method: "POST",

      body: JSON.stringify({
        email,
      }),
    });
    console.log(data);  

    document.cookie = `token=${data.access_token}; path=/;`;

    router.push("/user/home");

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