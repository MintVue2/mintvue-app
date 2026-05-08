"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function SocialAuth() {

  const handleGoogleLogin = async () => {
    // later:
    // OAuth provider flow
  };
  

  return (
    <div className="space-y-4">

      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="
          h-12
          w-full
          border-white/10
          bg-white/[0.03]
          hover:bg-white/10
        "
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>

    </div>
  );
}