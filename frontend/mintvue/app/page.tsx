import { HeroSection } from "@/components/marketing/hero-section";
import { PreviewSection } from "@/components/marketing/preview-section";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeedPreview } from "@/components/marketing/feed-preview";
import { EventsSection } from "@/components/marketing/events-section";
import { FinalCTA } from "@/components/marketing/final-cta";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <TrustedBy />
      <PreviewSection />
      <HowItWorks />
      <FeedPreview />
      <EventsSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}