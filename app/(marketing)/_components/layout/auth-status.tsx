"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type MeResponse =
  | { loggedIn: false }
  | { loggedIn: true; phoneMasked: string; userId: string };

type AuthStatusProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function AuthStatus({
  variant = "desktop",
  onNavigate,
}: AuthStatusProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse>({ loggedIn: false });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/web/auth/me", {
          credentials: "include",
        });
        const body = (await response.json()) as MeResponse;
        if (!cancelled) setMe(body);
      } catch {
        if (!cancelled) setMe({ loggedIn: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/web/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setMe({ loggedIn: false });
      onNavigate?.();
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <span
        className={
          variant === "desktop"
            ? "hidden h-8 w-24 animate-pulse rounded-md bg-muted sm:inline-block"
            : "h-16 w-full animate-pulse rounded-md bg-muted"
        }
        aria-hidden
      />
    );
  }

  if (!me.loggedIn) {
    return (
      <Button
        asChild
        variant={variant === "mobile" ? "outline" : "ghost"}
        size="sm"
        className={variant === "desktop" ? "hidden sm:inline-flex" : "w-full"}
      >
        <Link href="/login" onClick={onNavigate}>
          登录
        </Link>
      </Button>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-sm leading-relaxed">
          <span className="font-medium text-foreground">{me.phoneMasked}</span>
          <span className="text-muted-foreground">，欢迎回来</span>
        </p>
        <Button
          variant="outline"
          className="w-full"
          disabled={loggingOut}
          onClick={handleLogout}
        >
          {loggingOut ? "退出中..." : "退出登录"}
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <p className="text-sm whitespace-nowrap">
        <span className="font-medium text-foreground">{me.phoneMasked}</span>
        <span className="text-muted-foreground">，欢迎回来</span>
      </p>
      <Button
        variant="outline"
        size="sm"
        disabled={loggingOut}
        onClick={handleLogout}
      >
        {loggingOut ? "退出中..." : "退出登录"}
      </Button>
    </div>
  );
}
