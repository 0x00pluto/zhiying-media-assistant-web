import enterpriseBase from "@/content/geo/enterprise-base.json";
import {
  FAQ_ITEMS,
  HOW_IT_WORKS_STEPS,
  PRICING_PLANS,
} from "@/app/(marketing)/_config/marketing-content";
import { ORG_CONFIG, SITE_CONFIG } from "@/lib/site-config";

export const SITE_ORIGIN = ORG_CONFIG.siteOrigin;

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const SOFTWARE_ID = `${SITE_ORIGIN}/#software`;
const HOWTO_ID = `${SITE_ORIGIN}/#howto`;
const FAQ_ID = `${SITE_ORIGIN}/#faq`;
const PAGE_URL = `${SITE_ORIGIN}/`;

function parsePriceCny(price: string): number | null {
  const match = price.match(/[\d.]+/);
  if (!match) return null;
  return Number.parseFloat(match[0]);
}

function buildOffers() {
  return PRICING_PLANS.filter((plan) => plan.price !== "价格待定")
    .map((plan) => {
      const price = parsePriceCny(plan.price);
      if (price === null) return null;

      return {
        "@type": "Offer" as const,
        name: plan.name,
        price,
        priceCurrency: "CNY",
        description: plan.description,
        availability: "https://schema.org/InStock",
      };
    })
    .filter((offer) => offer !== null);
}

export function buildHomeJsonLd() {
  const org = enterpriseBase.organization;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": org["@type"] || "Corporation",
        "@id": ORG_ID,
        name: org.legalName,
        alternateName: org.brandName,
        url: SITE_ORIGIN,
        logo: org.logo,
        email: enterpriseBase.productSite.supportEmail,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_ORIGIN,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        inLanguage: "zh-CN",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "SoftwareApplication",
        "@id": SOFTWARE_ID,
        name: SITE_CONFIG.name,
        applicationCategory: "BrowserApplication",
        operatingSystem: "Chrome, Edge",
        description: SITE_CONFIG.description,
        url: PAGE_URL,
        downloadUrl: SITE_CONFIG.chromeStoreUrl,
        softwareVersion: SITE_CONFIG.version,
        publisher: { "@id": ORG_ID },
        offers: buildOffers(),
      },
      {
        "@type": "HowTo",
        "@id": HOWTO_ID,
        name: "智赢媒体助手快速上手",
        description: "只需三步，即刻步入敏捷采集时代。",
        step: HOW_IT_WORKS_STEPS.map((step) => ({
          "@type": "HowToStep",
          position: step.step,
          name: step.title,
          text: step.description,
          url: `${PAGE_URL}#how-it-works-step-${step.step}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": FAQ_ID,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
