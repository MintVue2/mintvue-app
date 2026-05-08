"use client";

import Marquee from "react-fast-marquee";

const companies = [
  "CreatorX",
  "Nova Media",
  "Visionary",
  "Pulse Africa",
  "StreamLab",
  "EventHive",
  "CultureWave",
  "Urban Lens",
];

export function TrustedBy() {
  return (
    <section className="relative border-y border-white/10 bg-black py-6 overflow-hidden">

      {/* subtle gradient fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-black to-transparent" />

      <div className="mb-6 text-center text-xs uppercase tracking-[0.25em] text-zinc-500">
        Trusted by creators & digital communities
      </div>

      <Marquee
        speed={40}
        gradient={false}
        pauseOnHover
      >
        {companies.map((company) => (
          <div
            key={company}
            className="
              mx-8
              flex
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              px-8
              py-4
              text-sm
              font-medium
              text-zinc-400
              backdrop-blur-xl
            "
          >
            {company}
          </div>
        ))}
      </Marquee>
    </section>
  );
}