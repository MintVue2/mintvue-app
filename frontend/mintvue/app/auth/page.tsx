import { AuthCard } from "@/components/auth/auth-card";

export default function AuthPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 sm:px-6">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed22,transparent_50%)]" />

      {/* noise */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      <AuthCard />
    </main>
  );
}
