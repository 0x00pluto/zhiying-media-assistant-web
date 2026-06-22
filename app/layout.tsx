import type { Metadata } from "next";
import { Geist_Mono, Inter, Noto_Sans_SC } from "next/font/google";

import { RootProvider } from "fumadocs-ui/provider/next";

import { ThemeProvider } from "@/components/providers/theme-provider";
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
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootProvider search={{ enabled: false }} theme={{ enabled: false }}>
            {children}
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
