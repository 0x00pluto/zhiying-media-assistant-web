import type { Metadata } from "next";
import { Geist_Mono, Inter, Noto_Sans_SC } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { HomeJsonLd } from "@/components/seo/json-ld";
import { ORG_CONFIG, SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-sc",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(ORG_CONFIG.siteOrigin),
  title: SITE_CONFIG.title,
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
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/brand/icon-128.png", sizes: "128x128", type: "image/png" }],
    apple: [
      { url: "/brand/icon-1024.png", sizes: "1024x1024", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        inter.variable,
        notoSansSC.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <HomeJsonLd />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
