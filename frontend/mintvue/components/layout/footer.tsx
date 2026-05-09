import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">

      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">

          {/* Brand */}
          <div>
          
            <h3 className="text-2xl font-semibold">
              Mintvue
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
              A creator-first platform where viral culture,
              digital ownership, and immersive experiences come together.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-10 text-sm text-zinc-400">

            <div className="space-y-3">
              <p className="font-medium text-white">Platform</p>
              <a href="#" className="block hover:text-white">
                Feed
              </a>
              <a href="#" className="block hover:text-white">
                Marketplace
              </a>
              <a href="#" className="block hover:text-white">
                Events
              </a>
            </div>

            <div className="space-y-3">
              <p className="font-medium text-white">Company</p>
              <a href="#" className="block hover:text-white">
                About
              </a>
              <a href="#" className="block hover:text-white">
                Creators
              </a>
              <a href="#" className="block hover:text-white">
                Contact
              </a>
            </div>

            <div className="space-y-3">
              <p className="font-medium text-white">Legal</p>
              <a href="#" className="block hover:text-white">
                Privacy
              </a>
              <a href="#" className="block hover:text-white">
                Terms
              </a>
            </div>

          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-zinc-500">
          © 2026 Mintvue. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}