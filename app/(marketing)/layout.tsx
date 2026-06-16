import { SiteFooter } from "@/app/(marketing)/_components/layout/site-footer";
import { SiteHeader } from "@/app/(marketing)/_components/layout/site-header";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 selection:bg-emerald-200 dark:selection:bg-emerald-800">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
