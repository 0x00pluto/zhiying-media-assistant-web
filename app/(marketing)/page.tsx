import type { Metadata } from "next";

import { FaqSection } from "@/app/(marketing)/_components/home/faq-section";
import { FeaturesSection } from "@/app/(marketing)/_components/home/features-section";
import { FeishuSyncSection } from "@/app/(marketing)/_components/home/feishu-sync-section";
import { HeroAmbientBackground } from "@/app/(marketing)/_components/home/hero-ambient-background";
import { HeroSection } from "@/app/(marketing)/_components/home/hero-section";
import { HowItWorksSection } from "@/app/(marketing)/_components/home/how-it-works-section";
import { InstallCtaSection } from "@/app/(marketing)/_components/home/install-cta-section";
import { PricingSection } from "@/app/(marketing)/_components/home/pricing-section";
import { StatsBar } from "@/app/(marketing)/_components/home/stats-bar";
import { TrustSection } from "@/app/(marketing)/_components/home/trust-section";
import { HomeJsonLd } from "@/app/(marketing)/_components/seo/home-json-ld";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: SITE_CONFIG.title,
  },
  description: SITE_CONFIG.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/brand/icon-1024.png",
        width: 1024,
        height: 1024,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["/brand/icon-1024.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <div className="relative">
        <HeroAmbientBackground />
        <div className="relative z-10">
          <HeroSection />
          <StatsBar />
          <FeaturesSection />
          <FeishuSyncSection />
          <HowItWorksSection />
          <TrustSection />
          <PricingSection />
          <FaqSection />
          <InstallCtaSection />
        </div>
      </div>
    </>
  );
}
