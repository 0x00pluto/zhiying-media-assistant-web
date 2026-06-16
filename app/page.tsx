import { HeroAmbientBackground } from "@/components/home/hero-ambient-background";
import { FaqSection } from "@/components/home/faq-section";
import { FeaturesSection } from "@/components/home/features-section";
import { FeishuSyncSection } from "@/components/home/feishu-sync-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { InstallCtaSection } from "@/components/home/install-cta-section";
import { PricingSection } from "@/components/home/pricing-section";
import { StatsBar } from "@/components/home/stats-bar";
import { TrustSection } from "@/components/home/trust-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <HeroAmbientBackground />
      <div className="relative z-10">
        <SiteHeader />
        <main className="selection:bg-emerald-200 dark:selection:bg-emerald-800">
          <HeroSection />
          <StatsBar />
          <FeaturesSection />
          <FeishuSyncSection />
          <HowItWorksSection />
          <TrustSection />
          <PricingSection />
          <FaqSection />
          <InstallCtaSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
