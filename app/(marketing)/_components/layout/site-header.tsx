"use client";

import { Download, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthStatus } from "@/app/(marketing)/_components/layout/auth-status";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ThemeToggle } from "@/app/(marketing)/_components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/app/(marketing)/_config/marketing-content";
import { SITE_CONFIG } from "@/lib/site-config";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glassmorphism sticky top-0 z-50 w-full border-b transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <BrandLogo size="md" priority />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-300">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <AuthStatus />

          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link href="/#install">
              免费下载
              <Download className="size-4" />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>{SITE_CONFIG.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-3 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <AuthStatus
                  variant="mobile"
                  onNavigate={() => setOpen(false)}
                />
                <Button asChild className="mt-2">
                  <Link href="/#install" onClick={() => setOpen(false)}>
                    安装扩展
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
